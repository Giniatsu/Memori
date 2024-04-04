import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { notFound } from "next/navigation";
import { utcToZonedTime, format } from "date-fns-tz";

// component
import Link from "next/link";
import GraveImage from "../../contributions/GraveImage";
import Button from "../../components/LocateButton";
import { GiHastyGrave } from "react-icons/gi";
import ViewRatings from "../ViewRatings";

export const dynamicParams = true; // default val = true

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

export default async function GraveDetails({ params }) {
  const grave = await getGrave(params.id);
  const ratings = await getRatings(params.id);

  const averageRatings =
    ratings?.length ?? 0 > 0
      ? ratings.reduce(function (sum, value) {
          return sum + parseInt(value.rating);
        }, 0) / ratings.length
      : 0;

  return (
    <main>
      <div className="grid grid-cols-1 md:grid-cols-2 mb-16 md:mb-0">
        <GraveImage grave_id={params.id} multiple />
        <div className="flex flex-col">
          <Button
            color="gray"
            as={Link}
            href={`/map?grave_id=${params.id}`}
            className="whitespace-nowrap hover:text-cyan-700 hover:bg-gray-100 m-2"
          >
            <GiHastyGrave className="mr-2 h-4 w-4" />
            Locate Grave
          </Button>
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
              {grave.birth ? format(new Date(grave.birth), "MMMM dd, yyyy") : ""}
              <br />
              <b>Death: </b>
              {grave.death ? format(new Date(grave.death), "MMMM dd, yyyy") : ""}
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
