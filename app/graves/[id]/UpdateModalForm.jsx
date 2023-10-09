'use client';

import { Button, Checkbox, Label, Modal, TextInput } from 'flowbite-react';
import { useState } from 'react';
import UpdateButton from './UpdateButton';
import { updateGrave } from '../actions';

export default function UpdateModalForm({id}) {
  const [openModal, setOpenModal] = useState("");
  const props = { openModal, setOpenModal };
  const updateGravewithID = updateGrave.bind(null, id);

  
  return (
    <>
      <Button onClick={() => props.setOpenModal("form-elements")}>
        Toggle modal
      </Button>
      <Modal
        show={props.openModal === "form-elements"}
        size="md"
        popup
        onClose={() => props.setOpenModal(undefined)}
      >
        <Modal.Header />
        <Modal.Body>
          <form action={updateGravewithID}>
            <input type="text" id="grave_images" name="grave_images" />
            {/* <input type="file" id="grave_image" name="grave_image" multiple /> */}
            <select id="cemetery" name="cemetery">
              <option>Cemetery 1</option>
              <option>Cemetery 2</option>
              <option>Cemetery 3</option>
              <option>Cemetery 4</option>
            </select>
            <input type="text" id="firstname" name="firstname" />
            <input type="text" id="lastname" name="lastname" />
            <input type="text" id="aliases" name="aliases" />
            <input type="text" id="age" name="age" />
            <input type="date" id="birth" name="birth" />
            <input type="date" id="death" name="death" />
            <input type="date" id="internment" name="internment" />
            <input type="text" id="location" name="location" />
            <UpdateButton />
          </form>
        </Modal.Body>
      </Modal>
    </>
  );
}