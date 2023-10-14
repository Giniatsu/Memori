"use server";

import { createServerActionClient } from "@supabase/auth-helpers-nextjs";
import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { v4 as uuidv4 } from 'uuid';

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

  // insert the cemetery data
  const { data: cemeteryData, error: cemeteryError } = await supabase
    .from("cemetery")
    .upsert({
      location_name: filteredGrave.cemeterylocation,
      location: filteredGrave.cemeterycoordinates,
      name: filteredGrave.cemetery,
    }, {
      onConflict: "name",
    })
    .select();

  if (cemeteryError) {
    console.log(cemeteryError);
    throw new Error("Could not add cemetery");
  }

  // remove cemetery data from grave
  delete filteredGrave.cemetery;
  delete filteredGrave.cemeterylocation;
  delete filteredGrave.cemeterycoordinates;

  // insert the grave data
  const { data: graveData, error: graveError } = await supabase.from("graves").insert({
    ...filteredGrave,
    cemetery: cemeteryData[0].id,
    user_email: session.user.email,
  }).select();

  if (graveError) {
    console.log(graveError);
    throw new Error("Could not add the new grave");
  }

  const file = filteredGrave.grave_images;
  const fileExt = file.name.split(".").pop();
  const filePath = `${uuidv4()}.${fileExt}`;

  // upload image to storage
  let { error: uploadError } = await supabase.storage
    .from("grave_images")
    .upload(filePath, file);

  if (uploadError) {
    console.log(uploadError);
    throw new Error("Could not upload image");
  }

  // add image to database
  const { error: imageDbError } = await supabase
    .from("images")
    .insert({
      file_name: filePath,
      owner: session.user.id,
      grave: graveData[0].id,
    });
  
  if (imageDbError) {
    console.log(imageDbError);
    throw new Error("Could not add image to database");
  }
  //*/

  revalidatePath("/graves/contributions");
  redirect("/graves/contributions");
}

export async function updateGrave(id,formData) {
  const grave = Object.fromEntries(formData);
  const filteredGrave = Object.fromEntries(
    Object.entries(grave).filter(([_, value]) => value != "")
  );
  console.log(filteredGrave);
  const supabase = createServerActionClient({ cookies });

  const {
    data: { session },
  } = await supabase.auth.getSession();

  // update the data
  const { error } = await supabase
    .from("graves")
    .update({
      ...filteredGrave,
      user_email: session.user.email,
    })
    .eq("id", id);

  if (error) {
    throw new Error("Could not update the grave");
  }

  revalidatePath("/graves/contributions");
  redirect("/graves/contributions");
}

export async function deleteGrave(id) {
  const supabase = createServerActionClient({ cookies });

  // delete the data
  const { error } = await supabase.from("graves").delete().eq("id", id);

  if (error) {
    throw new Error("Could not delete the new graves");
  }

  revalidatePath("/graves/contributions");
  redirect("/graves/contributions");
}
