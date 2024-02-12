"use client"

import { useState, useEffect } from "react";
import { Button, Card, Datepicker, Label, Select, TextInput } from "flowbite-react";
import { FaSearchLocation } from "react-icons/fa";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { search } from "./actions";

import { useFormStatus } from "react-dom";

function SearchButton() {
  const { pending } = useFormStatus();

  return (
    <Button type="submit" disabled={pending}>
      <FaSearchLocation className="w-5 h-5 mr-2" />
      {pending && <span>Searching...</span>}
      {!pending && <span>Search</span>}
    </Button>
  );
}

export default function Search() {

  const [loading, setLoading] = useState(true);
  const [cemeteries, setCemeteries] = useState([]);

  useEffect(() => {
    setLoading(true);
    const load = async () => {
      const supabase = createClientComponentClient();
  
      let { data: cemeteries, error } = await supabase
        .from('cemetery')
        .select('*')
      
      if (error) {
        console.log(error.message);
      }

      setCemeteries(cemeteries);
      console.log(cemeteries);
      setLoading(false);
    }
    load();
  }, []);

  return (
    <div className="flex items-center justify-center my-4">
      <Card className="w-4/5 max-w-sm mb-16">
        <form action={search} className="grid grid-cols-2 gap-4">
          <div className="max-w-md col-span-2" id="select">
            <div className="block mb-2">
              <Label htmlFor="cemeteries" value="Select your cemetery" />
            </div>
            <Select id="cemeteries" name="cemetery">
              <option value="">Select your cemetery</option>
              { !loading && (
                cemeteries.map(cemetery => (
                  <option key={cemetery.id} value={cemetery.id}>{cemetery.name}</option>
                ))
              ) }
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
          <div className="relative z-0 w-full group col-span-2">
            <TextInput
              type="text"
              name="agerange"
              id="floating_last_name"
              className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
              placeholder=" "
            />
            <Label
              htmlFor="agerange"
              className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
            >
              Age Range
            </Label>
          </div>
          <div className="relative z-20 w-full mb-6 group">
            <TextInput type="number" name="age" id="age" title="Age (Exact)" />
            <Label
              htmlFor="age"
              className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-8 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
            >
              Age
            </Label>
          </div>
          <div className="relative z-20 w-full mb-6 group">
            <TextInput type="number" name="age_min" id="age_min" title="Age Min (Range)" />
            <Label
              htmlFor="age_min"
              className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-8 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
            >
              Age Min
            </Label>
          </div>
          <div className="relative z-20 w-full mb-6 group">
            <TextInput type="number" name="age_max" id="age_max" title="Age Max (Range)" />
            <Label
              htmlFor="age_max"
              className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-8 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
            >
              Age Max
            </Label>
          </div>
          <div className="col-span-2">
            <div className="relative z-30 w-full mb-6 group">
              <TextInput type="date" name="birth" id="birthpicker" title="Birth" />
              <Label
                htmlFor="birthpicker"
                className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-8 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
              >
                Birth
              </Label>
            </div>
            <div className="relative z-20 w-full mb-6 group">
              <TextInput type="date" name="death" id="deathpicker" title="Death" />
              <Label
                htmlFor="deathpicker"
                className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-8 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
              >
                Death
              </Label>
            </div>
            
            {/*<div className="relative z-10 w-full mb-2 group">
              <Datepicker name="internment" id="internmentpicker" title="Internment" />
              <Label
                htmlfor="internmentpicker"
                className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-8 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
              >
                Internment
              </Label>
            </div>*/}
          </div>
          <div className="z-0">
            <SearchButton />
          </div>
        </form>
      </Card>
    </div>
  );
}
