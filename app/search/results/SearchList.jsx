import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import Link from "next/link";
import SearchImage from "./SearchImage";

import { useSearchParams } from 'next/navigation'
import { useEffect, useState } from "react";

async function getGraves(query, page = 1, pageSize = 5) {
  const supabase = createClientComponentClient();

  // base query
  let supabase_query = supabase
    .from("graves")
    .select(`
      *,
      cemetery ( * )
    `)
    .range((page - 1) * pageSize, page * pageSize - 1); // Calculate offset based on page and pageSize

  // Build the count query
  const countQuery = supabase
    .from("graves")
    .select("id", { count: "exact", head: true });

  // Add conditions based on the query object
  if (query.cemetery) {
    supabase_query = supabase_query.eq("cemetery", query.cemetery.trim());
    countQuery = countQuery.eq("cemetery", query.cemetery.trim());
  }

  if (query.firstName) {
    supabase_query = supabase_query.ilike("firstname", `%${query.firstName.trim()}%`);
    countQuery = countQuery.ilike("firstname", `%${query.firstName.trim()}%`);
  }

  if (query.lastName) {
    supabase_query = supabase_query.ilike("lastname", `%${query.lastName.trim()}%`);
    countQuery = countQuery.ilike("lastname", `%${query.lastName.trim()}%`);
  }

  if (query.aliases) {
    supabase_query = supabase_query.ilike("aliases", `%${query.aliases.trim()}%`);
    countQuery = countQuery.ilike("aliases", `%${query.aliases.trim()}%`);
  }

  if (query.birth) {
    supabase_query = supabase_query.eq("birth", `${query.birth.trim()}`);
    countQuery = countQuery.eq("birth", `${query.birth.trim()}`);
  }

  if (query.death) {
    supabase_query = supabase_query.eq("death", `${query.death.trim()}`);
    countQuery = countQuery.eq("death", `${query.death.trim()}`);
  }

  if (query.ageMin) {
    supabase_query = supabase_query.gte("age", parseInt(query.ageMin.trim()));
    countQuery = countQuery.gte("age", parseInt(query.ageMin.trim()));
  }

  if (query.ageMax) {
    supabase_query = supabase_query.lte("age", parseInt(query.ageMax.trim()));
    countQuery = countQuery.lte("age", parseInt(query.ageMax.trim()));
  }

  if (query.age) {
    supabase_query = supabase_query.eq("age", parseInt(query.age.trim()));
    countQuery = countQuery.eq("age", parseInt(query.age.trim()));
  }

  // Fetch both the paginated data and the total count in parallel
  const [data, { count }] = await Promise.all([
    supabase_query,
    countQuery
  ]);

  return { data, totalCount: count };
}

export default async function GravesList() {
  const searchParams = useSearchParams()
  const [graves, setGraves] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0); // State to hold the total count
  const pageSize = 5; // You can adjust the page size as needed

  useEffect(() => {
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

    // add more params here if needed, follow lang sa format/pattern
    getGraves({
      cemetery,
      firstName,
      lastName,
      aliases,
      birth,
      death,
      age,
      ageMin,
      ageMax,
    }).then(({data, totalCount}) => {
      setGraves(data);
      setTotalCount(totalCount);
    })
  }, [
    searchParams,
    currentPage,
    pageSize,
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
      <div className="flex justify-center mt-4">
        { currentPage !== 1 && (
          <button
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            onClick={() => setCurrentPage((prevPage) => prevPage - 1)}
          >
            Previous Page
          </button>
        ) }
        { !(graves.length < pageSize || currentPage * pageSize >= totalCount) && (
          <button
            className="ml-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            onClick={() => setCurrentPage((prevPage) => prevPage + 1)}
          >
            Next Page
          </button>
        ) }
      </div>
    </>
  );
}
