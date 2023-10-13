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
  console.log(filteredGrave)
  //console.log(grave)

  const supabase = createServerActionClient({ cookies });

  const {
    data: { session },
  } = await supabase.auth.getSession();

  // insert the data
  const { error } = await supabase.from("graves").insert({
    ...filteredGrave,
    user_email: session.user.email,
  });

  if (error) {
    throw new Error("Could not add the new grave");
  }

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
