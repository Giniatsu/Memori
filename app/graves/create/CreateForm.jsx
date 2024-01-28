"use client";
import SubmitButton from "@/app/components/SubmitButton";
import { addGrave } from "../actions";
import {
  Button,
  Card,
  Datepicker,
  Label,
  Select,
  TextInput,
  FileInput,
  Textarea
} from "flowbite-react";
import { useEffect, useState, useMemo } from "react";
import { usePlacesWidget } from "react-google-autocomplete";
import { IoMdLocate } from "react-icons/io";
import CemeteryField from "./CemeteryField";

import { useGeolocated } from "react-geolocated";

export default function CreateForm() {
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
  
  const [birth, setBirth] = useState(new Date());
  const [death, setDeath] = useState(new Date());
  const [age, setAge] = useState(0);

  const [location, setLocation] = useState("");
  const [hasLocation, setHasLocation] = useState(false);
  const [cemetery, setCemetery] = useState("");

  const [locationCoordinates, setLocationCoordinates] = useState([0, 0]);
  const [cemeteryLocationCoordinates, setCemeteryLocationCoordinates] = useState([0, 0]);
  const supabasePointGeo = useMemo(() => {
    return `POINT(${locationCoordinates[0]} ${locationCoordinates[1]})`;
  }, [locationCoordinates]);

  const supabasePointGeoCemetery = useMemo(() => {
    return `POINT(${cemeteryLocationCoordinates[0]} ${cemeteryLocationCoordinates[1]})`;
  }, [cemeteryLocationCoordinates]);

  useEffect(() => {
    const diff = Math.abs(new Date(death) - new Date(birth));
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
    }
  });

  const updateLocation = (e) => {
    console.log('Triggering getPosition()')
    getPosition()
  }

  useEffect(() => {
    if (deviceCoords) {
      setLocationCoordinates([deviceCoords?.longitude, deviceCoords?.latitude])
    }
  }, [deviceCoords])

  return (
    <div className="flex items-center justify-center my-4">
      <Card className="w-4/5 max-w-sm mb-16">
        <form action={addGrave} className="grid grid-cols-2 gap-4">
          <input
            type="hidden"
            value={supabasePointGeoCemetery}
            name="cemeterycoordinates"
          />
          <div className="max-w-md" id="fileUpload">
            <div className="block mb-2">
              <Label htmlFor="file" value="Upload file" />
            </div>
            <FileInput
              helperText="A profile picture is useful to confirm your are logged into your account"
              id="file"
              name="grave_images"
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
          {hasLocation && (
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
                onChange={(e) => {
                  setBirth(e.target.value);
                }}
              />
              {/*
              <Datepicker
                name="birth"
                id="birthpicker"
                title="Birth"
                onSelectedDateChanged={date => { console.log(date) }}
              />
              */}
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
                onChange={(e) => {
                  setDeath(e.target.value);
                }}
              />
              {/*<Datepicker
                name="death"
                id="deathpicker"
                title="Death"
              />*/}
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
                <Button color="light" className="m-2" onClick={updateLocation} disabled={!isGeolocationAvailable || !isGeolocationEnabled}>
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
          <div className="z-0">
            <SubmitButton />
          </div>
        </form>
      </Card>
    </div>
  );
}
