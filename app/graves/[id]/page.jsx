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
  /*
    Postgres query to build the get_graves() function:
    
    ```
      drop function get_graves();

      create
      or replace function get_graves () returns table (
        grave_id integer,
        cemetery_id bigint,
        cemetery_name text,
        grave_images text,
        firstname text,
        lastname text,
        aliases text,
        age integer,
        birth date,
        death date,
        grave_location geography,
        latitude double precision,
        longitude double precision,
        user_email text,
        notes text
      ) as $$
      BEGIN
        RETURN QUERY
        SELECT g.id AS grave_id, c.id AS cemetery_id, c.name AS cemetery_name, g.grave_images, g.firstname, g.lastname, g.aliases, g.age, g.birth, g.death, g.location AS grave_location, ST_X(g.location::geometry) AS latitude, ST_Y(g.location::geometry) AS longitude, g.user_email, g.notes
        FROM graves g
        JOIN cemetery c ON g.cemetery = c.id;
      END;
      $$ language plpgsql;
    ```
  */
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
        <span>Location: {grave.longitude}, {grave.latitude}</span>
        <div>Cemetery: {grave.cemetery_name}</div>
      </div>
    </main>
  );
}