// Import necessary dependencies and components

import React, { useEffect, useMemo, useState } from "react";
import { Map as GoogleMap } from "@vis.gl/react-google-maps";
import { useGeolocated } from "react-geolocated";
import Sheet from "react-modal-sheet";
import { useRouter } from "next/navigation";
import { GraveMarker } from "./map/grave-marker";
import { UserMarker } from "./map/user-marker";
import ImagesSheet from "./map/images-sheet";
import Distance from "./map/distance";
import DirectionPolyline from "./map/direction-polyline";
import { createClient } from "@supabase/supabase-js";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import RateButton from "./map/rate-button";
import { HiInformationCircle } from "react-icons/hi";
import { Button, Spinner, Alert } from "flowbite-react";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

const BASE_URL =
  "https://plmqhcualnnsirfqjcsj.supabase.co/storage/v1/object/public/grave_images/";

const Map = ({ graveId }) => {
  const supabaseauth = createClientComponentClient();
  const [user, setUser] = useState(null);
  const [graveTarget, setGraveTarget] = useState(null);
  const [isImagesOpen, setImagesOpen] = useState(false);
  const [autoZoomDisabled, setAutoZoomDisabled] = useState(false);
  const [images, setImages] = useState([]);

  const router = useRouter();

  const getGrave = async () => {
    const { data } = await supabase
      .rpc("get_graves")
      .eq("grave_id", graveId)
      .single();
    setGraveTarget(data);

    supabase
      .from("images")
      .select(
        `
        *
      `
      )
      .eq("grave", graveId)
      .then(({ data, error }) => {
        if (error) {
          console.log(error);
        } else {
          const urls = data.map((data) => BASE_URL + data.file_name);
          setImages(urls);
        }
      });
  };

  useEffect(() => {
    getGrave();
  }, []);

  useEffect(() => {
    const session = supabaseauth.auth.getUser();
    session.then((val) => {
      setUser(val.data?.user ?? null);
    });
  }, [supabaseauth])

  const dst = useMemo(() => {
    return {
      lat: parseFloat(graveTarget?.latitude ?? 0),
      lng: parseFloat(graveTarget?.longitude ?? 0),
    };
  }, [graveTarget]);

  const {
    coords,
    isGeolocationAvailable,
    isGeolocationEnabled,
    positionError,
  } = useGeolocated({
    positionOptions: {
      enableHighAccuracy: true,
    },
    watchLocationPermissionChange: true,
  });

  if (!isGeolocationAvailable) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Alert
          color="failure"
          icon={HiInformationCircle}
          className="m-4 text-justify"
        >
          <span className="font-bold">It seems your browser does not support Geolocation.</span> Please
          use a compatible browser such as Google Chrome.
        </Alert>
      </div>
    );
  }

  if (!isGeolocationEnabled) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Alert
          color="failure"
          icon={HiInformationCircle}
          className="m-4 text-justify"
        >
          <span className="font-bold">Gelocation is not enabled!</span> Please
          enable it to navigate a grave.
        </Alert>
      </div>
    );
  }

  if (positionError) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Alert
          color="failure"
          icon={HiInformationCircle}
          className="m-4 text-justify"
        >
          <span className="font-bold">{positionError.message}</span> Something
          went wrong!
        </Alert>
      </div>
    );
  }

  if (!coords) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Spinner
          color="success"
          aria-label="Center-aligned spinner example"
          className="h-52 w-52 self-center"
        />
      </div>
    );
  }

  return (
    <>
      <GoogleMap
        tilt={0}
        mapId={"794c1a71b3e36d6f"}
        mapTypeId="satellite"
        zoom={16}
        center={{
          lat: dst?.lat ?? 0,
          lng: dst?.lng ?? 0,
        }}
        gestureHandling={"greedy"}
        disableDefaultUI={true}
      >
        <UserMarker dst={dst} autoZoomDisabled={autoZoomDisabled} />
        <GraveMarker grave={graveTarget} coords={dst} />
        <DirectionPolyline dst={dst} />
      </GoogleMap>

      <Button
        color="dark"
        onClick={() => {!user || user.email !== graveTarget?.user_email
          ? router.push(`/graves/${graveId}/search_result`)
          : router.push(`/graves/${graveId}`);}}
        className="fixed top-2 left-2"
      >
        Back to Grave
      </Button>

      <div class="fixed bottom-2 right-2 ml-2 max-w-xs flex flex-col items-end space-y-2">
        <Button
          color="dark"
          onClick={() => {
            setAutoZoomDisabled((prev) => !prev);
          }}
        >
          {autoZoomDisabled ? "Turn on auto-center" : "Turn off auto-center"}
        </Button>
        <RateButton dst={dst} graveId={graveId} />
        <Button color="dark" onClick={() => setImagesOpen(true)}>
          View Images
        </Button>
        <Distance dst={dst} />
      </div>

      <Sheet
        isOpen={isImagesOpen}
        onClose={() => setImagesOpen(false)}
        snapPoints={[600, 400, 100, 0]}
        initialSnap={0}
        className="w-full md:w-1/2 md:absolute md:bottom-0 md:right-0"
      >
        <Sheet.Container className="px-4">
          <Sheet.Header />
          <Sheet.Content
            style={{
              paddingX: "2rem",
            }}
          >
            <Sheet.Scroller draggableAt="both">
              <ImagesSheet images={images} />
            </Sheet.Scroller>
          </Sheet.Content>
        </Sheet.Container>
      </Sheet>
    </>
  );
};

export default Map;
