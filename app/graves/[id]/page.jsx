import React from "react";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { notFound } from "next/navigation";
import { utcToZonedTime, format } from "date-fns-tz";

// component
import DeleteButton from "./DeleteButton";
import UpdateModalForm from "./UpdateModalForm";
import Link from "next/link";
import GraveImage from "../contributions/GraveImage";

import { updateGrave } from "../actions";
import Card from "../components/GraveCard";
import Avatar from "../components/UserAvatar";
import Button from "../components/LocateButton";
import { GiHastyGrave } from "react-icons/gi";
import ViewRatings from "./ViewRatings";

export async function generateMetadata({ params }) {
  const supabase = createServerComponentClient({ cookies });
  const { data: grave } = await supabase
    .from("graves")
    .select()
    .eq("id", params.id)
    .single();

  return {
    title: `GraveFinder | ${
      grave.firstname + " " + grave.lastname || "Ticket not found"
    }`,
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
      cemetery_location_name text,
      cemetery_location_latitude double precision,
      cemetery_location_longitude double precision,
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
      SELECT g.id AS grave_id, c.id AS cemetery_id, c.name AS cemetery_name, c.location_name AS cemetery_location_name, ST_Y(c.location::geometry) AS cemetery_location_latitude, ST_X(c.location::geometry) AS cemetery_location_longitude, g.firstname, g.lastname, g.aliases, g.age, g.birth, g.death, g.location AS grave_location, ST_Y(g.location::geometry) AS latitude, ST_X(g.location::geometry) AS longitude, g.user_email, g.notes
      FROM graves g
      JOIN cemetery c ON g.cemetery = c.id;
    END;
    $$ language plpgsql;

    ```
  */
  /* new get_graves function
      BEGIN
  RETURN QUERY
  SELECT g.id AS grave_id, c.id AS cemetery_id, c.name AS cemetery_name, c.location_name AS cemetery_location_name, ST_Y(c.location::geometry) AS cemetery_location_latitude, ST_X(c.location::geometry) AS cemetery_location_longitude, g.firstname, g.lastname, g.aliases, g.age, g.birth, g.death, g.location AS grave_location, ST_Y(g.location::geometry) AS latitude, ST_X(g.location::geometry) AS longitude, g.user_email, g.notes, g.created_at
  FROM graves g
  JOIN cemetery c ON g.cemetery = c.id;
END;
 */
  const supabase = createServerComponentClient({ cookies });
  const { data, error } = await supabase
    .rpc("get_graves")
    .eq("grave_id", id)
    .single();

  console.log(error);
  if (!data) {
    notFound();
  }

  return data;
}

async function getRatings(graveId) {
  const supabase = createServerComponentClient({ cookies });
  const { data, error } = await supabase
    .from("ratings")
    .select(
      `
      *,
      user_id ( id, username, full_name, avatar_url )
    `
    )
    .eq("grave_id", graveId);

  console.log(error);

  return data;
}
const AVATAR_URL =
  "https://plmqhcualnnsirfqjcsj.supabase.co/storage/v1/object/public/avatars/";
const BASE_URL =
  "https://plmqhcualnnsirfqjcsj.supabase.co/storage/v1/object/public/grave_images/";

async function getImages(grave_id) {
  const supabase = createServerComponentClient({ cookies });

  const { data: dbData, error: dbError } = await supabase
    .from("images")
    .select(
      `
      *
    `
    )
    .eq("grave", grave_id);

  if (dbError) {
    console.log(dbError.message);
  }

  if (!dbData || dbData.length === 0) {
    return null;
  }

  return dbData.map((data) => BASE_URL + data.file_name);
}

export default async function GraveDetails({ params }) {
  const grave = await getGrave(params.id);
  const images = await getImages(params.id);
  const ratings = await getRatings(params.id);

  const supabase = createServerComponentClient({ cookies });
  const { data } = await supabase.auth.getSession();
  const updateGravewithID = updateGrave.bind(null, params.id);

  return (
    <main>
      <div className="grid grid-cols-1 md:grid-cols-2 mb-16 md:mb-0">
        {" "}
        <GraveImage grave_id={params.id} multiple />
        <div className="flex flex-col">
          {" "}
          <Button
            color="gray"
            as={Link}
            href={`/map?grave_id=${params.id}`}
            className="whitespace-nowrap hover:text-cyan-700 hover:bg-gray-100 m-2"
          >
            <GiHastyGrave className="mr-2 h-4 w-4" />
            Locate Grave
          </Button>
          {data.session?.user?.email === grave.user_email && (
            <div className="flex gap-2 mb-2 mx-2">
              {" "}
              <UpdateModalForm
                action={updateGravewithID}
                graveInfo={{
                  ...grave,
                  id: params.id,
                  existingImages: images,
                }}
              />
              <DeleteButton id={grave.grave_id} />
            </div>
          )}
          <div className="text-left mx-4">
            <h1 className="font-bold text-2xl">Grave Details</h1>
            <h1 className="font-light text-xs">
              <b>Added by: </b>
              {grave.user_email}
              <br />
              <b>Created at: </b>
              {format(
                utcToZonedTime(new Date(grave.created_at), "Asia/Manila"),
                "MMMM dd, yyyy",
                { timeZone: "Asia/Manila" }
              )}
            </h1>
            <h2 className="font-medium text-lg">
              <b>Name: </b>
              {grave.firstname} {grave.lastname}
            </h2>
            <h3 className="font-normal text-base">
              <b>Age: </b>
              {grave.age}
              <br />
              <b>Birth: </b>
              {grave.birth}
              <br />
              <b>Death: </b>
              {grave.death}
            </h3>
            <h4 className="font-normal text-base">
              <b>Aliases: </b>
              <br />
              {grave.aliases}
            </h4>
            <h5 className="font-normal text-base">
              <b>Location: </b>
              {grave.latitude}, {grave.longitude}
              <br />
              <b>Cemetery: </b>
              {grave.cemetery_name}
              <br />
              <b>Notes: </b>
              {grave.notes}
            </h5>
          </div>
          <div className="fixed bottom-20 right-4">
            <ViewRatings ratings={ratings} />
          </div>
        </div>
      </div>
    </main>
  );
}
