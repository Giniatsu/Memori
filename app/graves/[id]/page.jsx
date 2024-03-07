import React from "react";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { notFound } from "next/navigation";

// component
import DeleteButton from "./DeleteButton";
import UpdateModalForm from "./UpdateModalForm";
import Link from "next/link";
import GraveImage from "../contributions/GraveImage";

import { updateGrave } from "../actions";
import Card from "../components/GraveCard";
import Avatar from "../components/UserAvatar";
import Button from '../components/LocateButton';
import { GiHastyGrave } from "react-icons/gi";

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

  const averageRatings =
    ratings?.length ?? 0 > 0
      ? ratings.reduce(function (sum, value) {
          return sum + parseInt(value.rating);
        }, 0) / ratings.length
      : 0;

  return (
    <main>
      <div className="grid grid-cols-2">
        <div className="h-56 sm:h-64 xl:h-80 2xl:h-96">
          <GraveImage grave_id={params.id} multiple />
        </div>
        <div>
          <div className="inline-flex" role="group">
            <Button color="gray">
              <GiHastyGrave className="mr-3 h-4 w-4" />
              <Link href={`/map?grave_id=${params.id}`}>
                LOCATE GRAVE HERE (MAP)
              </Link>
            </Button>
            <DeleteButton id={grave.grave_id} />
          </div>
        </div>
        {/* <Link href={`/map?grave_id=${params.id}`}>LOCATE GRAVE HERE (MAP)</Link>
        {data.session?.user?.email === grave.user_email && (
          <>
            <DeleteButton id={grave.grave_id} />
            <UpdateModalForm
              action={updateGravewithID}
              graveInfo={{ ...grave, id: params.id, existingImages: images }}
            />
          </>
        )}
        <div className="card">
          <h2>Grave Details</h2>
          <h3>
            {grave.firstname} {grave.lastname}
          </h3>
          <h4>Alias: {grave.aliases}</h4>
          <small>Added by: {grave.user_email}</small>
          <h5>Birth:{grave.birth}</h5>
          <h5>Death:{grave.death}</h5>
          <h5>
            Location: {grave.longitude}, {grave.latitude}
          </h5>
          <h5>Cemetery: {grave.cemetery_name}</h5>
          <h3>Ratings (Average: {averageRatings} stars):</h3>
          {ratings?.map((rating) =>
            rating.user_id?.id ? (
              <div key={rating.id} className="mb-2">
                <Avatar
                  img={AVATAR_URL + `${rating.user_id?.avatar_url}`}
                />{" "}
                {rating.user_id?.username} - ({rating.rating} stars){" "}
                {rating.comment}
              </div>
            ) : (
              <></>
            )
          )}
        </div> */}
      </div>
      {/* <Card className="max-w-sm" horizontal>
        <GraveImage grave_id={params.id} multiple />
        <div>
          <h5 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
            Noteworthy technology acquisitions 2021
          </h5>
        </div>
      </Card> */}
    </main>
  );
}
