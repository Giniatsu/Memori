import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { notFound } from "next/navigation";

// component
import DeleteButton from "./DeleteButton";
import UpdateModalForm from "./UpdateModalForm";
import Link from "next/link";

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
  const { data } = await supabase
    .from("graves")
    .select(`
      *,
      cemetery ( * )
    `)
    .eq("id", id)
    .single();

  if (!data) {
    notFound();
  }

  return data;
}

export default async function GraveDetails({ params }) {
  const grave = await getGrave(params.id);
  const supabase = createServerComponentClient({ cookies });
  const { data } = await supabase.auth.getSession();

  // NEED TO REPLACE THIS WITH ACTUAL DATA FROM DATABASE
  // DI KO ALAM HOW TO GET THE ACTUAL COORDINATESFROM SUPABASE
  const test_lat = 7.076674;
  const test_lng = 125.597120;

  return (
    <main>
      <nav>
        <Link href={`/map?lat=${test_lat}&lng=${test_lng}`}>
          LOCATE GRAVE HERE (MAP)
        </Link>
        <h2>Grave Details</h2>
        <div className="ml-auto">
          {data.session.user.email === grave.user_email && (
            <>
              <DeleteButton id={grave.id} />
              <UpdateModalForm graveInfo={grave}/>
            </>
          )}
        </div>
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
        <h5>Internment:{grave.internment}</h5>
        <span>Location: {grave.location}</span>
        <div>Cemetery: {grave.cemetery.name}</div>
      </div>
    </main>
  );
}