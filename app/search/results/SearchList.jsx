import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import Link from "next/link";
import SearchImage from "./SearchImage";
import { Pagination } from "flowbite-react";
import GraveListSkeleton from "../../graves/components/GraveListSkeleton";
import { useSearchParams, usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

async function getGraves(query, page = 1, pageSize = 5) {
  const supabase = createClientComponentClient();

  // base query
  let supabase_query = supabase
    .from("graves")
    .select(
      `
      *,
      cemetery ( * )
    `
    )
    .range((page - 1) * pageSize, page * pageSize - 1); // Calculate offset based on page and pageSize

  // Add conditions based on the query object
  if (query.cemeterylocation) {
    supabase_query = supabase_query.eq(
      "cemetery.location_name",
      query.cemeterylocation.trim()
    );
  }

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

  if (query.aliases) {
    supabase_query = supabase_query.ilike(
      "aliases",
      `%${query.aliases.trim()}%`
    );
  }

  if (query.birth) {
    supabase_query = supabase_query.eq("birth", `${query.birth.trim()}`);
  }

  if (query.death) {
    supabase_query = supabase_query.eq("death", `${query.death.trim()}`);
  }

  if (query.ageMin) {
    supabase_query = supabase_query.gte("age", parseInt(query.ageMin.trim()));
  }

  if (query.ageMax) {
    supabase_query = supabase_query.lte("age", parseInt(query.ageMax.trim()));
  }

  if (query.age) {
    supabase_query = supabase_query.eq("age", parseInt(query.age.trim()));
  }

  const { data, error } = await supabase_query;
  if (error) {
    console.log(error.message);
  }

  return data;
}

async function getGravesTotalCount(query) {
  const supabase = createClientComponentClient();

  // Build the count query
  let countQuery = supabase
    .from("graves")
    .select("id", { count: "exact", head: true });

  // Add conditions based on the query object
  if (query.cemetery) {
    countQuery = countQuery.eq("cemetery", query.cemetery.trim());
  }

  if (query.firstName) {
    countQuery = countQuery.ilike("firstname", `%${query.firstName.trim()}%`);
  }

  if (query.lastName) {
    countQuery = countQuery.ilike("lastname", `%${query.lastName.trim()}%`);
  }

  if (query.aliases) {
    countQuery = countQuery.ilike("aliases", `%${query.aliases.trim()}%`);
  }

  if (query.birth) {
    countQuery = countQuery.eq("birth", `${query.birth.trim()}`);
  }

  if (query.death) {
    countQuery = countQuery.eq("death", `${query.death.trim()}`);
  }

  if (query.ageMin) {
    countQuery = countQuery.gte("age", parseInt(query.ageMin.trim()));
  }

  if (query.ageMax) {
    countQuery = countQuery.lte("age", parseInt(query.ageMax.trim()));
  }

  if (query.age) {
    countQuery = countQuery.eq("age", parseInt(query.age.trim()));
  }

  const { count, error } = await countQuery;
  if (error) {
    console.log(error.message);
  }

  return count;
}

export default function SearchList() {
  const searchParams = useSearchParams();
  const [graves, setGraves] = useState([]);
  const [loading, setLoading] = useState(false);
  const [totalCount, setTotalCount] = useState(0); // State to hold the total count
  const pageSize = 10; // You can adjust the page size as needed

  const pathname = usePathname();
  const { push } = useRouter();

  // get params from url (basically gamita lang tong name na element sa fields)
  // add more params here if needed, follow lang sa format/pattern
  const cemetery = searchParams.get("cemetery");
  const firstName = searchParams.get("first_name");
  const lastName = searchParams.get("last_name");
  const aliases = searchParams.get("aliases");
  const birth = searchParams.get("birth");
  const death = searchParams.get("death");
  const age = searchParams.get("age");
  const ageMin = searchParams.get("age_min");
  const ageMax = searchParams.get("age_max");
  const currentPage = searchParams.get("page") || 1;

  useEffect(() => {
    setLoading(true);
    // add more params here if needed, follow lang sa format/pattern
    getGraves(
      {
        cemetery,
        firstName,
        lastName,
        aliases,
        birth,
        death,
        age,
        ageMin,
        ageMax,
      },
      currentPage,
      pageSize
    ).then((data) => {
      setGraves(data);
      setLoading(false);
    });
  }, [
    cemetery,
    firstName,
    lastName,
    aliases,
    birth,
    death,
    age,
    ageMin,
    ageMax,
    currentPage,
    pageSize,
  ]);

  useEffect(() => {
    getGravesTotalCount({
      cemetery,
      firstName,
      lastName,
      aliases,
      birth,
      death,
      age,
      ageMin,
      ageMax,
    }).then((count) => {
      setTotalCount(count);
    });
  }, [
    cemetery,
    firstName,
    lastName,
    aliases,
    birth,
    death,
    age,
    ageMin,
    ageMax,
  ]);

  function setCurrentPage(page) {
    const params = new URLSearchParams(searchParams);
    params.set("page", page);
    push(`${pathname}?${params.toString()}`);
  }

  return (
    <>
      <div
        className={graves.length === 0 ? "hidden" : "flex justify-center my-4"}
      >
        <Pagination
          layout="navigation"
          currentPage={parseInt(currentPage)}
          totalPages={Math.ceil(totalCount / pageSize)}
          onPageChange={setCurrentPage}
          showIcons
        />
      </div>
      {loading ? (
        <GraveListSkeleton />
      ) : graves.length === 0 ? (
        <p className="text-center">No Graves</p>
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
                  href={`/graves/${grave.id}/search_result`}
                  className="flex"
                >
                  <SearchImage grave_id={grave.id} />
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
          currentPage={parseInt(currentPage)}
          totalPages={Math.ceil(totalCount / pageSize)}
          onPageChange={setCurrentPage}
          showIcons
        />
      </div>
    </>
  );
}
