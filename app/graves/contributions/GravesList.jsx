import { useState, useEffect } from "react";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import Link from "next/link";
import GraveImage from "./GraveImage";
import { Pagination, Rating } from "flowbite-react";
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

// Average Rating
async function getAverageRating(graveId) {
  const supabase = createClientComponentClient();

  try {
    const { data: ratingData, error } = await supabase
      .from("ratings")
      .select("rating")
      .eq("grave_id", graveId);

    if (error) {
      console.log("Error fetching ratings:", error.message);
      return null;
    }

    const ratings = ratingData.map((row) => row.rating);
    const averageRating =
      ratings.length > 0
        ? Math.round(
            (ratings.reduce((sum, rating) => sum + rating, 0) /
              ratings.length) *
              100
          ) / 100
        : 0;

    return averageRating;
  } catch (error) {
    console.log("Error calculating average rating:", error.message);
    return null;
  }
}

export default function GravesList() {
  const searchParams = useSearchParams();
  const [graves, setGraves] = useState([]);
  const [totalCount, setTotalCount] = useState(0); // State to hold the total count
  const [loading, setLoading] = useState(false);
  const pageSize = 10; // You can adjust the page size as needed
  const [averageRatings, setAverageRatings] = useState([]);
  const pathname = usePathname();
  const { push } = useRouter();

  const cemetery = searchParams.get("cemetery");
  const firstName = searchParams.get("first_name");
  const lastName = searchParams.get("last_name");
  const currentPage = searchParams.get("page") || 1;

  // Better useEffect to lessen burden on the database, than mixing the 2 useEffects below
  useEffect(() => {
    setLoading(true);
    getGraves(
      {
        cemetery,
        firstName,
        lastName,
      },
      currentPage,
      pageSize
    ).then((data) => {
      setGraves(data);
      setLoading(false);
    });
  }, [cemetery, firstName, lastName, currentPage, pageSize]);

  useEffect(() => {
    getGravesTotalCount({
      cemetery,
      firstName,
      lastName,
    }).then((count) => {
      setTotalCount(count);
    });
  }, [cemetery, firstName, lastName]);

  useEffect(() => {
    const fetchAverageRatings = async () => {
      const ratings = await Promise.all(
        graves.map(async (grave) => {
          const averageRating = await getAverageRating(grave.id);
          return { graveId: grave.id, averageRating };
        })
      );
      setAverageRatings(ratings);
    };

    fetchAverageRatings();
  }, [graves]);

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
                    <p className="mb-3 font-semibold text-gray-700">
                      Grave Accuracy:
                      <Rating>
                        {Array(5)
                          .fill()
                          .map((_, index) => (
                            <Rating.Star
                              key={index}
                              filled={
                                index + 1 <=
                                averageRatings.find(
                                  (rating) => rating.graveId === grave.id
                                )?.averageRating
                              }
                            />
                          ))}
                      </Rating>
                      {/* {averageRatings.find(
                        (rating) => rating.graveId === grave.id
                      )?.averageRating ?? "No Ratings Yet"}{" "}
                      / 5 */}
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
