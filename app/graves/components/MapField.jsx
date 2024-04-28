import React, { useState } from "react";
import { Map as GoogleMap } from "@vis.gl/react-google-maps";
import { useGeolocated } from "react-geolocated";

import { Button, Modal, Alert, Spinner } from "flowbite-react";
import { HiInformationCircle } from "react-icons/hi";
import { CenterMarker } from "@/app/components/map/center-marker";
import { UserMarker } from "@/app/components/map/user-marker";

const MapField = ({ onSelect, defaultValue, ...props }) => {
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

  const [openModal, setOpenModal] = useState("");

  const [currentCenter, setCurrentCenter] = useState({ lng: 0, lat: 0 });

  const handleOnSelect = () => {
    setOpenModal("");
    if (onSelect && typeof onSelect === "function") {
      onSelect([currentCenter.lng, currentCenter.lat]);
    }
  };

  if (!isGeolocationAvailable) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Alert
          color="failure"
          icon={HiInformationCircle}
          className="m-4 text-justify"
        >
          <span className="font-bold">
            It seems your browser does not support Geolocation.
          </span>{" "}
          Please use a compatible browser such as Google Chrome.
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
          className="h-6 w-6 self-center"
        />
      </div>
    );
  }

  return (
    <>
      <Button
        color="light"
        size="sm"
        {...props}
        onClick={() => setOpenModal("form-elements")}
      >
        Manual Pin Location
      </Button>

      <Modal
        show={openModal === "form-elements"}
        size="7xl"
        popup
        onClose={() => setOpenModal(undefined)}
      >
        <Modal.Header />
        <Modal.Body className="w-full h-full">
          <GoogleMap
            tilt={0}
            style={{ height: "calc(100vh - 18rem)" }}
            mapId={"794c1a71b3e36d6f"}
            mapTypeId="satellite"
            zoom={21}
            center={{
              lat:
                defaultValue?.latitude === 0
                  ? coords?.latitude ?? 0
                  : defaultValue?.latitude ?? 0,
              lng:
                defaultValue?.longitude === 0
                  ? coords?.longitude ?? 0
                  : defaultValue?.longitude ?? 0,
            }}
            gestureHandling={"greedy"}
            disableDefaultUI={true}
          >
            <UserMarker />
            <CenterMarker setCenter={setCurrentCenter} />
          </GoogleMap>
        </Modal.Body>
        <Modal.Footer>
          <Button
            color="dark"
            onClick={() => {
              handleOnSelect();
            }}
          >
            Select location
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default MapField;
