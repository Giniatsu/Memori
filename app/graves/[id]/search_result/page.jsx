import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { notFound } from "next/navigation";

// component
import Link from "next/link";
import GraveImage from "../../contributions/GraveImage";

export const dynamicParams = true; // default val = true

export async function generateMetadata({ params }) {
  const supabase = createServerComponentClient({ cookies });
  const { data: grave } = await supabase
    .from("graves")
    .select()
    .eq("id", params.id)
    .single();

  return {
    title: `GraveFinder | ${grave.firstname + " " + grave.lastname || "Ticket not found"}`,
  };
}

async function getGrave(id) {
  const supabase = createServerComponentClient({ cookies });
  const { data, error } = await supabase
    .rpc("get_graves")
    .eq("grave_id", id)
    .single();

  console.log(error)
  if (!data) {
    notFound();
  }

  return data;
}

async function getRatings(graveId) {
  const supabase = createServerComponentClient({ cookies });
  const { data, error } = await supabase
    .from("ratings")
    .select('*')
    .eq("grave_id", graveId);

  console.log(error)

  return data;
}

export default async function GraveDetails({ params }) {
  const grave = await getGrave(params.id);
  const ratings = await getRatings(params.id);

  const averageRatings = (ratings?.length ?? 0 > 0) ? (ratings.reduce(function (sum, value) {
    return sum + parseInt(value.rating)
  }, 0) / ratings.length) : 0

  return (
    <main>
      <nav>
        <GraveImage grave_id={params.id} multiple />
        <Link href={`/map?grave_id=${params.id}`}>
          LOCATE GRAVE HERE (MAP)
        </Link>
        <h2>Grave Details</h2>
      </nav>
      <div className="card">
        {grave.grave_image}
        <h3>
          {grave.firstname} {grave.lastname}
        </h3>
        <h4>Alias: {grave.aliases}</h4>
        <small>Added by: {grave.user_email}</small>
        <h5>Birth:{grave.birth}</h5>
        <h5>Death:{grave.death}</h5>
        <span>Location: {grave.longitude}, {grave.latitude}</span>
        <div>Cemetery: {grave.cemetery_name}</div>
      </div>
      <div className="card">
        <h3>
          Ratings (Average: {averageRatings} stars):
        </h3>
        {ratings.map((rating) => rating.comment ? (
          <div key={rating.id} className="mb-2">
            - ({rating.rating} stars) {rating.comment} 
          </div>
        ) : <></>)}
      </div>
    </main>
  );
}
