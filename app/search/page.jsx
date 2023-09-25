"use client"

import { Button, Card, Datepicker, Label, Select, TextInput } from "flowbite-react";
import Link from "next/link";
import { FaSearchLocation } from "react-icons/fa";

export default function Search() {
  return (
    <div className="flex justify-center items-center my-4">
      <Card className="w-4/5 max-w-sm">
        <form className="grid grid-cols-2 gap-4">
          <div className="max-w-md col-span-2" id="select">
            <div className="mb-2 block">
              <Label htmlFor="cemeteries" value="Select your cemetery" />
            </div>
            <Select id="cemeteries" required>
              <option>Cemetery 1</option>
              <option>Cemetery 2</option>
              <option>Cemetery 3</option>
              <option>Cemetery 4</option>
            </Select>
          </div>
          <div class="relative z-0 w-full group block">
            <TextInput
              type="text"
              name="first_name"
              id="first_name"
              className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
              placeholder=" "
              required
            />
            <Label
              htmlfor="first_name"
              className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
            >
              First name
            </Label>
          </div>
          <div class="relative z-0 w-full group">
            <TextInput
              type="text"
              name="last_name"
              id="last_name"
              className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
              placeholder=" "
              required
            />
            <Label
              htmlfor="last_name"
              className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
            >
              Last name
            </Label>
          </div>
          <div class="relative z-0 w-full group col-span-2">
            <TextInput
              type="text"
              name="aliases"
              id="aliases"
              className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
              placeholder=" "
              required
            />
            <Label
              htmlfor="aliases"
              className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
            >
              Aliases
            </Label>
          </div>
          <div class="relative z-0 w-full group col-span-2">
            <TextInput
              type="text"
              name="agerange"
              id="floating_last_name"
              className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
              placeholder=" "
              required
            />
            <Label
              htmlfor="agerange"
              className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
            >
              Age Range
            </Label>
          </div>
          <div className="col-span-2">
            <div class="relative z-0 w-full mb-6 group">
              <Datepicker id="birthpicker" title="Birth" />
              <Label
                htmlfor="birthpicker"
                className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-8 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
              >
                Birth
              </Label>
            </div>
            <div class="relative z-0 w-full mb-6 group">
              <Datepicker id="deathpicker" title="Death" />
              <Label
                htmlfor="deathpicker"
                className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-8 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
              >
                Death
              </Label>
            </div>
            <div class="relative z-0 w-full mb-2 group">
              <Datepicker id="internmentpicker" title="Internment" />
              <Label
                htmlfor="internmentpicker"
                className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-8 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
              >
                Internment
              </Label>
            </div>
          </div>
            <Link href="">
              <Button>
                <FaSearchLocation className="mr-2 h-5 w-5" />
                <p>Search</p>
              </Button>
            </Link>
        </form>
      </Card>
    </div>
  );
}
