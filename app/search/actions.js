"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

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
    Object.entries(query).filter(([_, value]) => value != "")
  );
  
  console.log(filteredQuery);

  const queryString = serialize(filteredQuery);

  revalidatePath(`/search/results?${queryString}`);
  redirect(`/search/results?${queryString}`);
}