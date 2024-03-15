import { useState, useEffect } from "react";
import { search } from "../actions";
import { TextInput, Select, Label, Button, Spinner } from "flowbite-react";
import { FaSearchLocation } from "react-icons/fa";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { useFormStatus } from "react-dom";

function SearchButton() {
  const { pending } = useFormStatus();

  return (
    <Button type="submit" disabled={pending} >
      {pending && (
        <>
          <Spinner aria-label="Spinner button example" size="sm" />
          <span className="pl-2">Searching...</span>
        </>
      )}
      {!pending && (
        <>
          <FaSearchLocation className="mr-2 h-4 w-4" />
          <span>Search</span>
        </>
      )}
    </Button>
  );
}

const EntriesSearch = () => {
  const [loading, setLoading] = useState(true);
  const [cemeteries, setCemeteries] = useState([]);

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
    <form
      action={search}
      className="flex flex-col justify-center gap-2 mx-10 md:flex-row md:items-end"
    >
      <div className="flex flex-row gap-2 md:basis-1/2">
        <div className="basis-1/2">
          <div className="block">
            <Label htmlFor="first_name" value="First Name" />
          </div>
          <TextInput
            id="first_name"
            type="text"
            name="first_name"
            placeholder=""
          />
        </div>
        <div className="basis-1/2">
          <div className="block">
            <Label htmlFor="last_name" value="Last Name" />
          </div>
          <TextInput
            id="last_name"
            type="text"
            name="last_name"
            placeholder=""
          />
        </div>
      </div>
      <div className="md:basis-1/4">
        <div className="block">
          <Label htmlFor="cemeteries" value="Select your cemetery" />
        </div>
        <Select id="cemeteries" name="cemetery">
          <option value="">Select your cemetery</option>
          {!loading &&
            cemeteries.map((cemetery) => (
              <option key={cemetery.id} value={cemetery.id}>
                {cemetery.name}
              </option>
            ))}
        </Select>
      </div>
      <div className="self-center md:self-end">
        <SearchButton />
      </div>
    </form>
  );
};

export default EntriesSearch;
