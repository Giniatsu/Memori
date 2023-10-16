import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";

import {
  Select,
  Label,
  Button,
  TextInput,
} from "flowbite-react";
import { useEffect, useState, useMemo } from "react";

const CemeteryField = ({
  location,
  cemetery,
  setCemetery,
  ...props
}) => {
  const [createMode, setCreateMode] = useState(false);

  const [loading, setLoading] = useState(true);
  const [cemeteries, setCemeteries] = useState([]);
  useEffect(() => {
    if (!location) {
      setCemeteries([]);
      return;
    }
    
    setLoading(true);
    const load = async () => {
      const supabase = createClientComponentClient();
  
      let { data: cemeteries, error } = await supabase
        .from('cemetery')
        .select('*')
        .eq('location_name', location)
      
      if (error) {
        console.log(error.message);
      }

      setCemeteries(cemeteries);
      console.log(cemeteries);
      setLoading(false);
    }
    load();
  }, [location]);

  if (loading) {
    return <p>Loading...</p>;
  }

  return (
    <>
      { !createMode && (
        <Select
          type="text"
          name="cemetery"
          id="cemetery"
          className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
          placeholder=" "
          onChange={e => {
            setCemetery(e.target.value);
          }}
          value={cemetery}
          required
        >
          {cemeteries.map(cemetery => (
            <option key={cemetery.id}>{cemetery.name}</option>
          ))}
        </Select>
      ) }
      { createMode && (
        <TextInput
          type="text"
          name="cemetery"
          id="cemetery"
          className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
          placeholder=" "
          onChange={e => {
            setCemetery(e.target.value);
          }}
          value={cemetery}
          required
        />
      ) }
      
      <Label
        htmlFor="cemetery"
        className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
      >
        Cemetery Name
      </Label>
      { !createMode && (
        <Button pill fullSized className="mb-4" onClick={() => setCreateMode(true)}>
          Add new cemetery
        </Button>
      ) }
      { createMode && (
        <Button pill color="blue" fullSized className="mb-4" onClick={() => setCreateMode(false)}>
          Search existing cemetery
        </Button>
      ) }
    </>
  );
};

export default CemeteryField;