'use client';

import { Button, Checkbox, Label, Modal, TextInput } from 'flowbite-react';
import { useState } from 'react';
import UpdateButton from './UpdateButton';
import { updateGrave } from '../actions';

export default function UpdateModalForm({graveInfo}) {
  const [openModal, setOpenModal] = useState("");
  const props = { openModal, setOpenModal };
  const updateGravewithID = updateGrave.bind(null, graveInfo.id);

  
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
            {/* <input type="text" id="grave_images" name="grave_images" /> */}
            <input type="file" id="grave_image" name="grave_images" multiple />
            <select id="cemetery" name="cemetery" value={graveInfo.cemetery}>
              <option>Cemetery 1</option>
              <option>Cemetery 2</option>
              <option>Cemetery 3</option>
              <option>Cemetery 4</option>
            </select>
            <input
              type="text"
              id="firstname"
              name="firstname"
              value={graveInfo.firstname}
            />
            <input
              type="text"
              id="lastname"
              name="lastname"
              value={graveInfo.lastname}
            />
            <input
              type="text"
              id="aliases"
              name="aliases"
              value={graveInfo.aliases}
            />
            <input type="text" id="age" name="age" value={graveInfo.age} />
            <input
              type="date"
              id="birth"
              name="birth"
              value={graveInfo.birth}
            />
            <input
              type="date"
              id="death"
              name="death"
              value={graveInfo.death}
            />
            <input
              type="date"
              id="internment"
              name="internment"
              value={graveInfo.internment}
            />
            <input
              type="text"
              id="location"
              name="location"
              value={graveInfo.location}
            />
            <UpdateButton />
          </form>
        </Modal.Body>
      </Modal>
    </>
  );
}