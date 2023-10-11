import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import Link from "next/link";
import Image from "next/image";

async function getGraves() {
  const supabase = createServerComponentClient({ cookies });
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data, error } = await supabase
    .from("graves")
    .select()
    .eq("user_email", user.email);

  if (error) {
    console.log(error.message);
  }
  return data;
}

export default async function GravesList() {
  const graves = await getGraves();
  return (
    <>
      {graves.map((grave) => (
        <Link
          key={grave.id}
          href={`/graves/${grave.id}`}
          className="flex flex-col items-center bg-white border border-gray-200 rounded-lg shadow md:flex-row md:max-w-xl hover:bg-gray-100 dark:border-gray-700 dark:bg-gray-800 dark:hover:bg-gray-700"
        >
          <Image
            src={`/${grave.grave_image}`}
            alt=""
            height={384}
            width={384}
            className="object-cover w-full rounded-t-lg h-96 md:h-auto md:w-48 md:rounded-none md:rounded-l-lg"
          />
          <div className="flex flex-col justify-between p-4 leading-normal">
            <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
              {grave.firstname} {grave.lastname}
            </h5>
            <p className="mb-3 font-normal text-gray-700 dark:text-gray-400">
              {grave.cemetery}
            </p>
          </div>
        </Link>
      ))}
      {graves.length === 0 && <p className="text-center">No Graves</p>}
    </>
  );
}
