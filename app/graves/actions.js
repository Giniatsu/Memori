"use server";

import { createServerActionClient } from "@supabase/auth-helpers-nextjs";
import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { v4 as uuidv4 } from "uuid";

const MAX_NUM_OF_IMAGES = 5;

export async function addGrave(formData) {
  const grave = Object.fromEntries(formData);
  const filteredGrave = Object.fromEntries(
    Object.entries(grave).filter(([_, value]) => value != "")
  );

  console.log(filteredGrave);

  const supabase = createServerActionClient({ cookies });

  const {
    data: { session },
  } = await supabase.auth.getSession();

  let cemeteryDataId = null;

  if (filteredGrave.cemetery_id) {
    cemeteryDataId = parseInt(filteredGrave.cemetery_id);
  } else {
    // insert the cemetery data
    const { data: cemeteryData, error: cemeteryError } = await supabase
      .from("cemetery")
      .upsert(
        {
          location_name: filteredGrave.cemeterylocation,
          location: filteredGrave.cemeterycoordinates,
          name: filteredGrave.cemetery,
          address: filteredGrave.cemetery_address,
        },
        {
          onConflict: "name, address",
        }
      )
      .select();

    if (cemeteryError) {
      console.log(cemeteryError);
      throw new Error("Could not add cemetery");
    }

    cemeteryDataId = cemeteryData[0].id;
  }

  // remove cemetery data from grave
  delete filteredGrave.cemetery;
  delete filteredGrave.cemeterylocation;
  delete filteredGrave.cemeterycoordinates;
  delete filteredGrave.cemetery_address;
  delete filteredGrave.cemetery_id;
  delete filteredGrave.grave_images;
  delete filteredGrave.imagesForDeletion;

  if (!filteredGrave.birth || filteredGrave.birth.trim() === "") {
    filteredGrave.birth = null;
    filteredGrave.age = null;
  }

  if (!filteredGrave.death || filteredGrave.death.trim() === "") {
    filteredGrave.death = null;
    filteredGrave.age = null;
  }

  // insert the grave data
  const { data: graveData, error: graveError } = await supabase
    .from("graves")
    .insert({
      ...filteredGrave,
      cemetery: cemeteryDataId,
      user_email: session.user.email,
    })
    .select();

  if (graveError) {
    console.log(graveError);
    throw new Error("Could not add the new grave");
  }

  console.log(formData.getAll("grave_images"));

  if (formData.getAll("grave_images").length > MAX_NUM_OF_IMAGES) {
    console.log("Exceeded maximum number of images");
    throw new Error("Exceeded maximum number of images");
  }

  await Promise.all(
    formData.getAll("grave_images").map(async (file) => {
      const fileExt = file.name.split(".").pop();
      const filePath = `${uuidv4()}.${fileExt}`;

      if (file.size === 0) return;

      // upload image to storage
      let { error: uploadError } = await supabase.storage
        .from("grave_images")
        .upload(filePath, file);

      if (uploadError) {
        console.log(uploadError);
        throw new Error("Could not upload image");
      }

      // add image to database
      const { error: imageDbError } = await supabase.from("images").insert({
        file_name: filePath,
        owner: session.user.id,
        grave: graveData[0].id,
      });

      if (imageDbError) {
        console.log(imageDbError);
        throw new Error("Could not add image to database");
      }
    })
  );
  //*/

  revalidatePath("/graves/contributions");
  redirect("/graves/contributions");
}

export async function updateGrave(id, formData) {
  const grave = Object.fromEntries(formData);
  const filteredGrave = Object.fromEntries(
    Object.entries(grave).filter(([_, value]) => value != "")
  );

  console.log(filteredGrave);

  const supabase = createServerActionClient({ cookies });

  const {
    data: { session },
  } = await supabase.auth.getSession();

  let cemeteryDataId = null;

  if (filteredGrave.cemetery_id) {
    cemeteryDataId = parseInt(filteredGrave.cemetery_id);
  } else {
    // insert the cemetery data
    const { data: cemeteryData, error: cemeteryError } = await supabase
      .from("cemetery")
      .upsert(
        {
          location_name: filteredGrave.cemeterylocation,
          location: filteredGrave.cemeterycoordinates,
          name: filteredGrave.cemetery,
          address: filteredGrave.cemetery_address,
        },
        {
          onConflict: "name, address",
        }
      )
      .select();

    if (cemeteryError) {
      console.log(cemeteryError);
      throw new Error("Could not add cemetery");
    }
    cemeteryDataId = cemeteryData[0].id;
  }
  // remove cemetery data from grave
  delete filteredGrave.cemetery;
  delete filteredGrave.cemeterylocation;
  delete filteredGrave.cemeterycoordinates;
  delete filteredGrave.cemetery_address;
  delete filteredGrave.cemetery_id;
  delete filteredGrave.grave_images;
  delete filteredGrave.imagesForDeletion;

  if (!filteredGrave.birth || filteredGrave.birth.trim() === "") {
    filteredGrave.birth = null;
    filteredGrave.age = null;
  }

  if (!filteredGrave.death || filteredGrave.death.trim() === "") {
    filteredGrave.death = null;
    filteredGrave.age = null;
  }

  // insert the grave data
  const { data: graveData, error: graveError } = await supabase
    .from("graves")
    .update({
      ...filteredGrave,
      cemetery: cemeteryDataId,
      user_email: session.user.email,
    })
    .eq("id", id)
    .select();

  if (graveError) {
    console.log(graveError);
    throw new Error("Could not add the new grave");
  }

  // image deletion
  console.log(formData.getAll("imagesForDeletion"));
  for await (const img of formData.getAll("imagesForDeletion")) {
    const fileName = img.split("/").pop();
    const { error: imageError } = await supabase
      .from("images")
      .delete()
      .eq("file_name", fileName);
    if (imageError) {
      console.log(imageError);
    }
  }
  const { error: storageError } = await supabase.storage
    .from("grave_images")
    .remove(
      formData.getAll("imagesForDeletion").map((img) => {
        const fileName = img.split("/").pop();
        console.log(fileName);
        return fileName;
      })
    );
  if (storageError) {
    console.log(storageError);
  }

  const { count: imagesCount, error: imagesError } = await supabase
    .from("images")
    .select("*", { count: "exact", head: true })
    .eq("grave", id);
  if (imagesError) {
    console.log(imagesError);
    throw new Error("Could not count images");
  }

  if (
    imagesCount +
      formData.getAll("grave_images").filter((image) => image.size > 0).length >
    MAX_NUM_OF_IMAGES
  ) {
    console.log("Exceeded maximum number of images");
    throw new Error("Exceeded maximum number of images");
  }

  console.log(formData.getAll("grave_images"));
  await Promise.all(
    formData.getAll("grave_images").map(async (file) => {
      const fileExt = file.name.split(".").pop();
      const filePath = `${uuidv4()}.${fileExt}`;

      if (file.size === 0) return;

      // upload image to storage
      let { error: uploadError } = await supabase.storage
        .from("grave_images")
        .upload(filePath, file);

      if (uploadError) {
        console.log(uploadError);
        throw new Error("Could not upload image");
      }

      // add image to database
      const { error: imageDbError } = await supabase.from("images").insert({
        file_name: filePath,
        owner: session.user.id,
        grave: graveData[0].id,
      });

      if (imageDbError) {
        console.log(imageDbError);
        throw new Error("Could not add image to database");
      }
    })
  );

  revalidatePath(`/graves/${id}`);
  redirect(`/graves/contributions`);
}

export async function deleteGrave(id) {
  const supabase = createServerActionClient({ cookies });

  // delete the grave data
  const { error } = await supabase.from("graves").delete().eq("id", id);

  if (error) {
    console.log(error);
    throw new Error("Could not delete the new graves");
  }

  // delete all null images
  const { data, error: imageSelectError } = await supabase
    .from("images")
    .select("*")
    .is("grave", null);
  if (imageSelectError) {
    console.log(imageSelectError);
  }

  const { error: imageError } = await supabase
    .from("images")
    .delete()
    .is("grave", null);
  if (imageError) {
    console.log(imageError);
  }

  // delete images from actual storage
  const { error: storageError } = await supabase.storage
    .from("grave_images")
    .remove(data.map((image) => image.file_name));

  if (storageError) {
    console.log(storageError);
  }

  revalidatePath("/graves/contributions");
  redirect("/graves/contributions");
}

export async function addGraveRating(id, formData) {
  const rating = Object.fromEntries(formData);
  const filteredRating = Object.fromEntries(
    Object.entries(rating).filter(([_, value]) => value != "")
  );

  console.log(filteredRating);

  const supabase = createServerActionClient({ cookies });

  const {
    data: { session },
  } = await supabase.auth.getSession();

  // insert the rating data
  const { error } = await supabase
    .from("ratings")
    .insert({
      grave_id: id,
      rating: filteredRating.rating,
      comment: filteredRating.comment,
      user_email: session?.user?.email ?? "",
      user_id: session?.user?.id ?? null,
    })
    .select();

  if (error) {
    console.log(error);
    throw new Error("Could not add rating");
  }

  revalidatePath(`/graves/${id}/search_result`);
  redirect(`/graves/${id}/search_result`);
}

const serialize = (obj) => {
  var str = [];
  for (var p in obj)
    if (obj.hasOwnProperty(p)) {
      str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
    }
  return str.join("&");
};

export async function search(formData) {
  const query = Object.fromEntries(formData);
  const filteredQuery = Object.fromEntries(
    Object.entries(query).filter(
      ([key, value]) => value != "" && key !== "ageradio"
    )
  );

  const queryString = serialize(filteredQuery);

  revalidatePath(`/graves/contributions?${queryString}`);
  redirect(`/graves/contributions?${queryString}`);
}
