import { useState, useEffect } from "react";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import Link from "next/link";
import GraveImage from "./GraveImage";
import { Pagination } from "flowbite-react";
import GraveListSkeleton from "../components/GraveListSkeleton";
import EntriesSearch from "../components/EntriesSearch";

async function getGraves(page = 1, pageSize = 5) {
  const supabase = createClientComponentClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Fetching data and total count in parallel
  const { data, error } = await supabase
    .from("graves")
    .select(
      `
      *,
      cemetery ( * )
    `
    )
    .eq("user_email", user.email)
    .range((page - 1) * pageSize, page * pageSize - 1);

  if (error) {
    console.log(error.message);
  }

  return data;
}

async function getGravesTotalCount() {
  const supabase = createClientComponentClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Fetching data and total count in parallel
  const { count, error } = await supabase
    .from("graves")
    .select("id", { count: "exact", head: true })
    .eq("user_email", user.email);

  if (error) {
    console.log(error.message);
  }

  return count;
}

export default function GravesList() {
  const [graves, setGraves] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0); // State to hold the total count
  const [loading, setLoading] = useState(false);
  const pageSize = 10; // You can adjust the page size as needed

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const data = await getGraves(currentPage, pageSize);
      setGraves(data);
      setLoading(false);
    };

    fetchData();
  }, [currentPage, pageSize]);

  useEffect(() => {
    getGravesTotalCount().then((count) => {
      setTotalCount(count);
    });
  }, []);

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  return (
    <>
      <div className="container mx-auto">
        <EntriesSearch />
      </div>
      <div
        className={graves.length === 0 ? "hidden" : "flex justify-center my-4"}
      >
        <Pagination
          layout="navigation"
          currentPage={currentPage}
          totalPages={Math.ceil(totalCount / pageSize)} // Calculate total pages
          onPageChange={handlePageChange}
          showIcons
        />
      </div>
      {loading ? (
        <GraveListSkeleton />
      ) : graves.length === 0 ? (
        <p className="text-center font-semibold mt-4">No Graves</p>
      ) : (
        <div className="container mx-auto">
          <div className="grid grid-cols-1 gap-4 mx-4 md:grid-cols-2 justify-center">
            {graves.map((grave) => (
              <div
                key={grave.id}
                className="max-w-2xl w-full mx-auto bg-white rounded-xl shadow-md overflow-hidden md:max-w-md"
              >
                <Link
                  key={grave.id}
                  href={`/graves/${grave.id}`}
                  className="flex"
                >
                  <GraveImage grave_id={grave.id} />
                  <div className="flex flex-col justify-center p-4 leading-normal">
                    <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900">
                      {grave.firstname} {grave.lastname}
                    </h5>
                    <p className="mb-3 font-normal text-gray-700">
                      {grave.cemetery.name}
                    </p>
                  </div>
                </Link>
              </div>
            ))}
          </div>
        </div>
      )}

      <div
        className={graves.length === 0 ? "hidden" : "flex justify-center my-4"}
      >
        <Pagination
          layout="navigation"
          currentPage={currentPage}
          totalPages={Math.ceil(totalCount / pageSize)} // Calculate total pages
          onPageChange={handlePageChange}
          showIcons
        />
      </div>
    </>
  );
}
