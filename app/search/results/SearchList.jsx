import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import Link from "next/link";
import SearchImage from "./SearchImage";

import { useSearchParams } from 'next/navigation'
import { useEffect, useState } from "react";

async function getGraves(query) {
  const supabase = createClientComponentClient();

  // base query
  let supabase_query = supabase
    .from("graves")
    .select(`
      *,
      cemetery ( * )
    `);

  // add more params here if needed, follow lang sa format/pattern
  // ani siya kay para optional tanan fields, so if naay value ang field, i-add siya sa query
  // better for me if optional tanan fields kay para dili kaayo strict ang search
  if (query.cemetery) {
    supabase_query = supabase_query.eq("cemetery", query.cemetery.trim())
  }

  if (query.firstName) {
    supabase_query = supabase_query.ilike("firstname", `%${query.firstName.trim()}%`)
  }

  if (query.lastName) {
    supabase_query = supabase_query.ilike("lastname", `%${query.lastName.trim()}%`)
  }

  if (query.aliases) {
    supabase_query = supabase_query.ilike("aliases", `%${query.aliases.trim()}%`)
  }

  if (query.birth) {
    supabase_query = supabase_query.eq("birth", `${query.birth.trim()}`)
  }

  if (query.death) {
    supabase_query = supabase_query.eq("death", `${query.death.trim()}`)
  }

  if (query.ageMin) {
    supabase_query = supabase_query.gte("age", parseInt(query.ageMin.trim()))
  }

  if (query.ageMax) {
    supabase_query = supabase_query.lte("age", parseInt(query.ageMax.trim()))
  }

  if (query.age) {
    supabase_query = supabase_query.eq("age", parseInt(query.age.trim()))
  }

  const { data, error } = await supabase_query;

  if (error) {
    console.log(error.message);
  }

  return data;
}

export default async function GravesList() {
  const searchParams = useSearchParams()

  // get params from url (basically gamita lang tong name na element sa fields)
  // add more params here if needed, follow lang sa format/pattern
  const cemetery = searchParams.get('cemetery')
  const firstName = searchParams.get('first_name')
  const lastName = searchParams.get('last_name')
  const aliases = searchParams.get('aliases')
  const birth = searchParams.get('birth')
  const death = searchParams.get('death')
  const age = searchParams.get('age')
  const ageMin = searchParams.get('age_min')
  const ageMax = searchParams.get('age_max')

  const [graves, setGraves] = useState([]);

  useEffect(() => {
    // add more params here if needed, follow lang sa format/pattern
    getGraves({
      cemetery,
      firstName,
      lastName,
      aliases,
      birth,
      death,
      ageMin,
      ageMax,
    }).then((data) => {
      setGraves(data)
    })
  }, [
    cemetery,
    firstName,
    lastName,
    aliases,
    birth,
    death,
  ])

  return (
    <>
      {graves.map((grave) => (
        <Link
          key={grave.id}
          href={`/graves/${grave.id}/search_result`}
          className="flex flex-col items-center bg-white border border-gray-200 rounded-lg shadow md:flex-row md:max-w-xl hover:bg-gray-100 dark:border-gray-700 dark:bg-gray-800 dark:hover:bg-gray-700"
        >
          <SearchImage grave_id={grave.id} />
          <div className="flex flex-col justify-between p-4 leading-normal">
            <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
              {grave.firstname} {grave.lastname}
            </h5>
            <p className="mb-3 font-normal text-gray-700 dark:text-gray-400">
              {grave.cemetery.name}
            </p>
          </div>
        </Link>
      ))}
      {graves.length === 0 && <p className="text-center">No Graves</p>}
    </>
  );
}
