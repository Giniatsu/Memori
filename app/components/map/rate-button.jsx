'use client'

import React, { useState } from 'react';

import { useGeolocated } from "react-geolocated";

import * as turf from "@turf/turf";
import { THRESHOLD_DISTANCE_METERS } from './variables';
import { Button, Checkbox, Label, Modal, Textarea} from 'flowbite-react';
import StarRating from './star-rating';
import SubmitButton from '../SubmitButton';
import { addGraveRating } from '@/app/graves/actions';

const RateButton = ({ dst, graveId }) => {
  const [openModal, setOpenModal] = useState("");
  const props = { openModal, setOpenModal };

  const [rating, setRating] = useState(0);
  const onRating = (r) => {
    setRating(r)
  }

  const addGraveRatingWithID = addGraveRating.bind(null, graveId);

  const {
    coords
  } = useGeolocated({
      positionOptions: {
        enableHighAccuracy: true
      },
      watchPosition: true,
      userDecisionTimeout: 5000
  });

  const distanceInMeters = React.useMemo(() => {
    return turf.distance(
      [coords?.longitude, coords?.latitude],
      [dst.lng, dst.lat],
      { units: "meters" }
    ).toFixed(2)
  }, [coords, dst])

  if (distanceInMeters < THRESHOLD_DISTANCE_METERS) {
    return <></>
  }

  return (
    <>
      <Button color="dark" onClick={() => props.setOpenModal("form-elements")}> 
        End Tracking
      </Button>
      <Modal
        show={props.openModal === "form-elements"}
        size="md"
        popup
        onClose={() => props.setOpenModal(undefined)}
      >
        <Modal.Header />
        <Modal.Body>
          <form action={addGraveRatingWithID}>
            <div className="mb-1 block">
              <Label value="Accuracy rating" />
            </div>
            <StarRating name="rating" id="star" value={rating} onChange={onRating} maxStars={5} />
            <div className="mb-2 mt-2 block">
              <Label htmlFor="comment" value="Comments" />
            </div>
            <Textarea id="comment" name="comment" placeholder="Leave a comment..." rows={4} />
            <SubmitButton />
          </form>
        </Modal.Body>
      </Modal>
    </>
  );
};

export default RateButton;

