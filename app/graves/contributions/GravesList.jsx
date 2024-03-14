import { useState, useEffect } from "react";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import Link from "next/link";
import GraveImage from "./GraveImage";
import { Pagination } from "flowbite-react";
import GraveListSkeleton from "../components/GraveListSkeleton";
import EntriesSearch from "../components/EntriesSearch";
import { useSearchParams, usePathname, useRouter } from "next/navigation";

async function getGraves(query, page = 1, pageSize = 10) {
  const supabase = createClientComponentClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Fetching data and total count in parallel
  let supabase_query = supabase
    .from("graves")
    .select(
      `
      *,
      cemetery ( * )
    `
    )
    .eq("user_email", user.email)
    .range((page - 1) * pageSize, page * pageSize - 1);

  if (query.cemetery) {
    supabase_query = supabase_query.eq("cemetery", query.cemetery.trim());
  }

  if (query.firstName) {
    supabase_query = supabase_query.ilike(
      "firstname",
      `%${query.firstName.trim()}%`
    );
  }

  if (query.lastName) {
    supabase_query = supabase_query.ilike(
      "lastname",
      `%${query.lastName.trim()}%`
    );
  }

  const { data, error } = await supabase_query;
  if (error) {
    console.log(error.message);
  }

  return data;
}

async function getGravesTotalCount(query) {
  const supabase = createClientComponentClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  let countQuery = supabase
    .from("graves")
    .select("id", { count: "exact", head: true })
    .eq("user_email", user.email);

  if (query.cemetery) {
    countQuery = countQuery.eq("cemetery", query.cemetery.trim());
  }

  if (query.firstName) {
    countQuery = countQuery.ilike("firstname", `%${query.firstName.trim()}%`);
  }

  if (query.lastName) {
    countQuery = countQuery.ilike("lastname", `%${query.lastName.trim()}%`);
  }

  const { count, error } = await countQuery;
  if (error) {
    console.log(error.message);
  }

  return count;
}

export default function GravesList() {
  const searchParams = useSearchParams();
  const [graves, setGraves] = useState([]);
  const [totalCount, setTotalCount] = useState(0); // State to hold the total count
  const [loading, setLoading] = useState(false);
  const pageSize = 10; // You can adjust the page size as needed
  const pathname = usePathname();
  const { push } = useRouter();

  const cemetery = searchParams.get("cemetery");
  const firstName = searchParams.get("first_name");
  const lastName = searchParams.get("last_name");
  const currentPage = searchParams.get("page") || 1;

  useEffect(() => {
    setLoading(true);

    const loadData = async () => {
      const fetchedGraves = await getGraves(
        { cemetery, firstName, lastName },
        currentPage,
        pageSize
      );
      setGraves(fetchedGraves);

      const count = await getGravesTotalCount({
        cemetery,
        firstName,
        lastName,
      });
      setTotalCount(count);

      setLoading(false);
    };

    loadData();
  }, [cemetery, firstName, lastName, currentPage, pageSize]);

  const firstEntry = (parseInt(currentPage) - 1) * pageSize + 1;
  const lastEntry = Math.min(parseInt(currentPage) * pageSize, totalCount);

  function setCurrentPage(page) {
    const params = new URLSearchParams(searchParams);
    params.set("page", page);
    push(`${pathname}?${params.toString()}`);
  }

  return (
    <>
      <div className="container mx-auto">
        <EntriesSearch />
      </div>
      <div
        className={
          graves.length === 0
            ? "hidden"
            : "flex flex-col justify-center items-center my-4"
        }
      >
        <div>
          <p>
            Showing <b>{firstEntry}</b> to <b>{lastEntry}</b> of{" "}
            <b>{totalCount}</b> Entries
          </p>
        </div>
        <Pagination
          layout="navigation"
          currentPage={parseInt(currentPage)}
          totalPages={Math.ceil(totalCount / pageSize)} // Calculate total pages
          onPageChange={setCurrentPage}
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
        className={
          graves.length === 0
            ? "hidden"
            : "flex flex-col justify-center items-center my-4"
        }
      >
        <div>
          <p>
            Showing <b>{firstEntry}</b> to <b>{lastEntry}</b> of{" "}
            <b>{totalCount}</b> Entries
          </p>
        </div>
        <Pagination
          layout="navigation"
          currentPage={parseInt(currentPage)}
          totalPages={Math.ceil(totalCount / pageSize)} // Calculate total pages
          onPageChange={setCurrentPage}
          showIcons
        />
      </div>
    </>
  );
}
