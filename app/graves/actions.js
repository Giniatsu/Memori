"use server";

import { createServerActionClient } from "@supabase/auth-helpers-nextjs";
import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

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
  const { error: cemeteryError } = await supabase
    .from("cemetery")
    .upsert({
      location_name: filteredGrave.cemeterylocation,
      location: filteredGrave.cemeterycoordinates,
      name: filteredGrave.cemetery,
    }, {
      onConflict: "name",
    });

  if (cemeteryError) {
    console.log(cemeteryError);
    throw new Error("Could not add cemetery");
  }

  // get the cemetery id
  const { data: cemeteryData, error: cemeteryDataError } = await supabase
    .from("cemetery")
    .select("id")
    .eq("name", filteredGrave.cemetery);

  if (cemeteryDataError) {
    console.log(cemeteryDataError);
    throw new Error("Could not get cemetery data");
  }

  // remove cemetery data from grave
  delete filteredGrave.cemetery;
  delete filteredGrave.cemeterylocation;
  delete filteredGrave.cemeterycoordinates;

  // insert the grave data
  const { error } = await supabase.from("graves").insert({
    ...filteredGrave,
    cemetery: cemeteryData[0].id,
    user_email: session.user.email,
  });

  if (error) {
    console.log(error);
    throw new Error("Could not add the new grave");
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
