import { useState, useEffect } from "react";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import Link from "next/link";
import GraveImage from "./GraveImage";

async function getGraves(page = 1, pageSize = 5) {
  const supabase = createClientComponentClient()
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Fetching data and total count in parallel
  const [{ data, error }, { count }] = await Promise.all([
    supabase
      .from("graves")
      .select(`
        *,
        cemetery ( * )
      `)
      .eq("user_email", user.email)
      .range((page - 1) * pageSize, page * pageSize - 1),
    supabase
      .from("graves")
      .select("id", { count: "exact", head: true })
      .eq("user_email", user.email),
  ]);

  if (error) {
    console.log(error.message);
  }

  return { data, totalCount: count };
}

export default function GravesList() {
  const [graves, setGraves] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0); // State to hold the total count
  const [loading, setLoading] = useState(false)
  const pageSize = 5; // You can adjust the page size as needed

  useEffect(() => {
    setLoading(true)
    getGraves(currentPage, pageSize).then(({data, totalCount}) => {
      setGraves(data);
      setTotalCount(totalCount);
      setLoading(false)
    });
  }, [currentPage, pageSize]);

  return (
    <>
      {!loading ? graves.map((grave) => (
        <Link
          key={grave.id}
          href={`/graves/${grave.id}`}
          className="flex flex-col items-center bg-white border border-gray-200 rounded-lg shadow md:flex-row md:max-w-xl hover:bg-gray-100 dark:border-gray-700 dark:bg-gray-800 dark:hover:bg-gray-700"
        >
          <GraveImage grave_id={grave.id} />
          <div className="flex flex-col justify-between p-4 leading-normal">
            <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
              {grave.firstname} {grave.lastname}
            </h5>
            <p className="mb-3 font-normal text-gray-700 dark:text-gray-400">
              {grave.cemetery.name}
            </p>
          </div>
        </Link>
      )) : (
        <p className="text-center">Loading...</p>
      )}
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
