"use client";
import SubmitButton from "@/app/components/SubmitButton";
import {
  Button,
  Card,
  Label,
  TextInput,
  Textarea
} from "flowbite-react";
import { useEffect, useState, useMemo } from "react";
import { usePlacesWidget } from "react-google-autocomplete";
import { IoMdLocate } from "react-icons/io";
import { format } from "date-fns";
import CemeteryField from "./CemeteryField";

import { useGeolocated } from "react-geolocated";
import ImageUploadField from "./ImageUploadField";

export default function Form({
  data,
  action,
  isModal,
}) {
  const {
    coords: deviceCoords,
    isGeolocationAvailable,
    isGeolocationEnabled,
    getPosition,
  } = useGeolocated({
    positionOptions: {
      enableHighAccuracy: true
    },
    userDecisionTimeout: 5000
  });
  
  const [birth, setBirth] = useState(data?.birth ?? "");
  const [death, setDeath] = useState(data?.death ?? "");
  const [age, setAge] = useState(0);

  const [location, setLocation] = useState(data?.cemeteryLocationName ?? "");
  const [hasLocation, setHasLocation] = useState(false);
  const [cemetery, setCemetery] = useState(data?.cemeteryName ?? "");

  const [imagesValid, setImagesValid] = useState(true);

  const [gettingLocation, setGettingLocation] = useState(false);
  const [locationCoordinates, setLocationCoordinates] = useState(data?.locationCoordinates ?? [0, 0]);
  const [cemeteryLocationCoordinates, setCemeteryLocationCoordinates] = useState(data?.cemeteryLocationCoordinates ?? [0, 0]);
  const supabasePointGeo = useMemo(() => {
    return `POINT(${locationCoordinates[0]} ${locationCoordinates[1]})`;
  }, [locationCoordinates]);

  const supabasePointGeoCemetery = useMemo(() => {
    return `POINT(${cemeteryLocationCoordinates[0]} ${cemeteryLocationCoordinates[1]})`;
  }, [cemeteryLocationCoordinates]);

  useEffect(() => {
    let deathTmp = new Date()
    let birthTmp = new Date()
    if (death) {
      deathTmp = new Date(death)
    }
    if (birth) {
      birthTmp = new Date(birth)
    }

    const diff = Math.abs(deathTmp - birthTmp) 
    const years = Math.floor(diff / (1000 * 60 * 60 * 24 * 365.25));
    setAge(years);
  }, [birth, death]);

  const { ref } = usePlacesWidget({
    apiKey: process.env.NEXT_PUBLIC_GOOGLE_MAP_API_KEY,
    onPlaceSelected: (place) => {
      const coords = [place?.geometry.location.lng() ?? 0, place?.geometry.location.lat() ?? 0];
      setCemeteryLocationCoordinates(coords);
      setLocation(place?.formatted_address ?? '');
      setHasLocation(true);
    },
  });

  const updateLocation = (e) => {
    console.log('Triggering getPosition()')
    setGettingLocation(true)
    getPosition()
  }

  useEffect(() => {
    if (deviceCoords && gettingLocation) {
      setLocationCoordinates([deviceCoords?.longitude, deviceCoords?.latitude])
      setGettingLocation(false)
    }
  }, [deviceCoords])

  return (
    <div className={isModal ? "" : "flex items-center justify-center my-4"}>
      <Card className={isModal ? "border-none shadow-none" : "w-4/5 max-w-sm mb-16"}>
        <form action={action} className="grid grid-cols-2 gap-4">
          <input
            type="hidden"
            value={supabasePointGeoCemetery}
            name="cemeterycoordinates"
          />
          <div className="max-w-md" id="fileUpload">
            <ImageUploadField
              id="file"
              name="grave_images"
              existingImages={data?.existingImages ?? []}
              onValid={setImagesValid}
            /> 
          </div>
          <div className="relative z-0 w-full col-span-2 group">
            <TextInput
              ref={ref}
              type="text"
              name="cemeterylocation"
              id="cemetery_location"
              className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
              placeholder="Search for a cemetery location (City, State, Country)"
              defaultValue={data?.cemeteryLocationName ?? ""}
              onChange={(e) => {
                setHasLocation(false);
              }}
              required
            />
            <Label
              htmlFor="cemetery_location"
              className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
            >
              Cemetery Location
            </Label>
          </div>
          {(hasLocation || data?.cemeteryLocationName) && (
            <div className="relative z-0 w-full col-span-2 group">
              <CemeteryField
                hasLocation={hasLocation}
                location={location}
                cemetery={cemetery}
                setCemetery={setCemetery}
              />
            </div>
          )}
          <div className="relative z-0 block w-full group">
            <TextInput
              type="text"
              name="firstname"
              id="first_name"
              className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
              placeholder=" "
              defaultValue={data?.firstName ?? ""}
              required
            />
            <Label
              htmlFor="first_name"
              className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
            >
              First name
            </Label>
          </div>
          <div className="relative z-0 w-full group">
            <TextInput
              type="text"
              name="lastname"
              id="last_name"
              className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
              placeholder=" "
              defaultValue={data?.lastName ?? ""}
              required
            />
            <Label
              htmlFor="last_name"
              className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
            >
              Last name
            </Label>
          </div>
          <div className="relative z-0 w-full col-span-2 group">
            <TextInput
              type="text"
              name="aliases"
              id="aliases"
              className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
              defaultValue={data?.aliases ?? ""}
              placeholder=" "
            />
            <Label
              htmlFor="aliases"
              className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
            >
              Aliases
            </Label>
          </div>
          <div className="relative z-0 w-full col-span-2 group">
            <TextInput
              type="text"
              name="age"
              id="age"
              className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
              placeholder=" "
              value={age}
              readOnly
            />
            <Label
              htmlFor="age"
              className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
            >
              Age
            </Label>
          </div>
          <div className="col-span-2">
            <div className="relative z-30 w-full mb-6 group">
              <TextInput
                type="date"
                name="birth"
                id="birthpicker"
                title="Birth"
                className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                placeholder=""
                defaultValue={data?.birth ? format(new Date(data?.birth), "yyyy-MM-dd") : ""}
                onChange={(e) => {
                  setBirth(e.target.value);
                }}
              />
              <Label
                htmlFor="birthpicker"
                className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-8 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
              >
                Birth
              </Label>
            </div>
            <div className="relative z-20 w-full mb-6 group">
              <TextInput
                type="date"
                name="death"
                id="deathpicker"
                title="Death"
                className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                placeholder=""
                defaultValue={data?.death ? format(new Date(data?.death), "yyyy-MM-dd") : ""}
                onChange={(e) => {
                  setDeath(e.target.value);
                }}
              />
              <Label
                htmlFor="deathpicker"
                className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-8 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
              >
                Death
              </Label>
            </div>
            <div className="relative z-0 w-full col-span-2 mb-6 group">
              <Label
                htmlFor="comment"
                value="Grave Notes"
                className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-8 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
              />
              <Textarea
                id="comment"
                type="text"
                placeholder="Leave a note..."
                rows={4}
                name="notes"
                defaultValue={data?.notes ?? ""}
                className="block w-full text-sm"
              />
            </div>
            <div className="relative z-0 w-full group">
              <div className="flex flex-row">
                <TextInput
                  type="text"
                  name="location"
                  id="location"
                  className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                  placeholder=" "
                  value={supabasePointGeo}
                  readOnly
                  required
                />
                <Button color="light" className="m-2" onClick={updateLocation} disabled={!isGeolocationAvailable || !isGeolocationEnabled || gettingLocation}>
                  <IoMdLocate className="w-6 h-6" />
                </Button>
              </div>
              <Label
                htmlFor="location"
                className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
              >
                Add Location Longitude and Latitude
              </Label>
            </div>
          </div>
          {imagesValid && (
            <div className="z-0">
              <SubmitButton />
            </div>
          )}
        </form>
      </Card>
    </div>
  );
}
