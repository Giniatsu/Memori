'use client';

import { Button, Checkbox, Label, Modal, TextInput } from 'flowbite-react';
import { useState } from 'react';
import Form from '../components/Form';

export default function UpdateModalForm({action, graveInfo}) {
  const [openModal, setOpenModal] = useState("");
  const props = { openModal, setOpenModal };
  
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
        <Modal.Body className='p-0'>
          <Form
            isModal
            action={action}
            data={
              {
                existingImages: graveInfo.existingImages,
                birth: graveInfo.birth,
                death: graveInfo.death,
                locationCoordinates: [graveInfo.longitude, graveInfo.latitude],
                cemeteryId: graveInfo.cemetery_id,
                cemeteryLocationCoordinates: [graveInfo.cemetery_location_longitude, graveInfo.cemetery_location_latitude],
                cemeteryLocationName: graveInfo.cemetery_location_name,
                cemeteryName: graveInfo.cemetery_name,
                firstName: graveInfo.firstname,
                lastName: graveInfo.lastname,
                aliases: graveInfo.aliases,
                notes: graveInfo.notes,
              }
            }
          />
        </Modal.Body>
      </Modal>
    </>
  );
}
