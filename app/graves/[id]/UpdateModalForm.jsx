"use client";

import { Button, Checkbox, Label, Modal, TextInput } from "flowbite-react";
import { useState } from "react";
import Form from "../components/Form";
import { RxUpdate } from "react-icons/rx";

export default function UpdateModalForm({ action, graveInfo }) {
  const [openModal, setOpenModal] = useState("");
  const props = { openModal, setOpenModal };

  return (
    <>
      <Button className="my-2 mx-2 whitespace-nowrap" color="gray" onClick={() => props.setOpenModal("form-elements")}>
        <RxUpdate className="mr-3 h-4 w-4" />
        Update Grave
      </Button>
      <Modal
        show={props.openModal === "form-elements"}
        size="md"
        popup
        onClose={() => props.setOpenModal(undefined)}
      >
        <Modal.Header />
        <Modal.Body className="p-0">
          <Form
            isModal
            action={action}
            onFinish={() => props.setOpenModal(undefined)}
            data={{
              existingImages: graveInfo.existingImages,
              birth: graveInfo.birth,
              death: graveInfo.death,
              locationCoordinates: [graveInfo.longitude, graveInfo.latitude],
              cemeteryId: graveInfo.cemetery_id,
              cemeteryLocationCoordinates: [
                graveInfo.cemetery_location_longitude,
                graveInfo.cemetery_location_latitude,
              ],
              cemeteryLocationName: graveInfo.cemetery_location_name,
              cemeteryName: graveInfo.cemetery_name,
              firstName: graveInfo.firstname,
              lastName: graveInfo.lastname,
              aliases: graveInfo.aliases,
              notes: graveInfo.notes,
            }}
          />
        </Modal.Body>
      </Modal>
    </>
  );
}
