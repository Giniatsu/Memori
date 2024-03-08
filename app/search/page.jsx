"use client";

import { useState, useEffect } from "react";
import {
  Button,
  Card,
  Label,
  Select,
  TextInput,
  Radio,
} from "flowbite-react";
import { FaSearchLocation } from "react-icons/fa";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { usePlacesWidget } from "react-google-autocomplete";
import { search } from "./actions";

import { useFormStatus } from "react-dom";

function SearchButton() {
  const { pending } = useFormStatus();

  return (
    <Button type="submit" disabled={pending}>
      <FaSearchLocation className="mr-2 h-4 w-4" />
      {pending && <span>Searching...</span>}
      {!pending && <span>Search</span>}
    </Button>
  );
}

export default function Search() {
  const [loading, setLoading] = useState(true);
  const [cemeteries, setCemeteries] = useState([]);
  const [ageMode, setAgeMode] = useState("range");

  const [location, setLocation] = useState("");
  const [hasLocation, setHasLocation] = useState(false);

  const { ref } = usePlacesWidget({
    apiKey: process.env.NEXT_PUBLIC_GOOGLE_MAP_API_KEY,
    onPlaceSelected: (place) => {
      setLocation(place?.formatted_address ?? '');
      setHasLocation(true);
    },
  });

  useEffect(() => {
    setLoading(true);
    const load = async () => {
      const supabase = createClientComponentClient();

      let { data: cemeteries, error } = await supabase
        .from("cemetery")
        .select("*");

      if (error) {
        console.log(error.message);
      }

      setCemeteries(cemeteries);
      console.log(cemeteries);
      setLoading(false);
    };
    load();
  }, []);

  return (
    <div className="flex items-center justify-center my-4">
      <Card className="w-4/5 max-w-sm mb-16">
        <form action={search} className="grid grid-cols-2 gap-4">
          <div className="relative z-0 w-full col-span-2 group">
            <div className="block">
              <Label htmlFor="cemetery_location" value="Cemetery Location" />
            </div>
            <TextInput
              ref={ref}
              type="text"
              name="cemeterylocation"
              id="cemetery_location"
              className="block pt-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
              placeholder="Search for a cemetery location (City, State, Country)"
              onChange={(e) => {
                setHasLocation(false);
              }}
            />
            {/* <Label
              htmlFor="cemetery_location"
              className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
            >
              Cemetery Location
            </Label> */}
          </div>
          <div className="max-w-md col-span-2" id="select">
            <div className="block mb-2">
              <Label htmlFor="cemeteries" value="Select your cemetery" />
            </div>
            <Select id="cemeteries" name="cemetery" className="mb-2">
              <option value="">Select your cemetery</option>
              {!loading &&
                cemeteries.map((cemetery) =>
                  hasLocation ? (
                    cemetery.location_name === location && (
                      <option key={cemetery.id} value={cemetery.id}>
                        {cemetery.name}
                      </option>
                    )
                  ) : (
                    <option key={cemetery.id} value={cemetery.id}>
                      {cemetery.name}
                    </option>
                  )
                )}
            </Select>
          </div>
          <div className="relative z-0 w-full group block">
            <TextInput
              type="text"
              name="first_name"
              id="first_name"
              className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
              placeholder=" "
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
              name="last_name"
              id="last_name"
              className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
              placeholder=" "
            />
            <Label
              htmlFor="last_name"
              className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
            >
              Last name
            </Label>
          </div>
          <div className="relative z-0 w-full group col-span-2">
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
          <div className="col-span-2">
            <fieldset className="flex flex-row gap-4 mb-6">
              <legend>Age Mode</legend>
              <div className="flex items-center gap-2">
                <Radio
                  id="rangeradio"
                  name="ageradio"
                  defaultChecked
                  checked={ageMode === "range"}
                  onChange={() => setAgeMode("range")}
                />
                <Label htmlFor="rangeradio">Range</Label>
              </div>
              <div className="flex items-center gap-2">
                <Radio
                  id="fixedradio"
                  name="ageradio"
                  checked={ageMode === "fixed"}
                  onChange={() => setAgeMode("fixed")}
                />
                <Label htmlFor="fixedradio">Fixed</Label>
              </div>
              <div className="flex items-center gap-2">
                <Radio
                  id="bdradio"
                  name="ageradio"
                  checked={ageMode === "birthdeath"}
                  onChange={() => setAgeMode("birthdeath")}
                />
                <Label htmlFor="bdradio">Birth&Death Date</Label>
              </div>
            </fieldset>
            {ageMode === "range" && (
              <div className="flex flex-row gap-4 mb-2">
                <div className="relative z-20 w-full group col-span-2">
                  <TextInput
                    type="number"
                    name="age_min"
                    id="age_min"
                    title="Age Min (Range)"
                  />
                  <Label
                    htmlFor="age_min"
                    className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-8 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
                  >
                    Age Min
                  </Label>
                </div>
                <div className="relative z-20 w-full group col-span-2">
                  <TextInput
                    type="number"
                    name="age_max"
                    id="age_max"
                    title="Age Max (Range)"
                  />
                  <Label
                    htmlFor="age_max"
                    className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-8 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
                  >
                    Age Max
                  </Label>
                </div>
              </div>
            )}
            {ageMode === "fixed" && (
              <div className="relative z-0 w-full group col-span-2">
                <TextInput
                  type="number"
                  name="age"
                  id="age"
                  className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                  placeholder=" "
                />
                <Label
                  htmlFor="age"
                  className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
                >
                  Age (Fixed)
                </Label>
              </div>
            )}
          </div>
          {ageMode === "birthdeath" && (
            <div className="col-span-2">
              <div className="relative z-30 w-full mb-6 group">
                <TextInput
                  type="date"
                  name="birth"
                  id="birthpicker"
                  title="Birth"
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
                />
                <Label
                  htmlFor="deathpicker"
                  className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-8 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
                >
                  Death
                </Label>
              </div>
            </div>
          )}
          <div className="z-0">
            <SearchButton />
          </div>
        </form>
      </Card>
    </div>
  );
}
