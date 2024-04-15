'use client'

import React, { useState } from 'react';

import { useRouter } from 'next/navigation';

import { useGeolocated } from "react-geolocated";

import * as turf from "@turf/turf";
import { THRESHOLD_DISTANCE_METERS } from './variables';
import { Button, Label, Modal, Textarea} from 'flowbite-react';
import StarRating from './star-rating';
import { addGraveRating } from '@/app/graves/actions';
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import RateSubmitBtn from './rate-submit';

const RateButton = ({ dst, graveId }) => {
  const supabase = createClientComponentClient();
  const router = useRouter()
  const [openRatingModal, setOpenRatingModal] = useState("");
  const [openEndModal, setOpenEndModal] = useState("");

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

  const [user, setUser] = React.useState(null)

  React.useEffect(() => {
    const session = supabase.auth.getUser()
    session.then((val) => {
      setUser(val.data?.user ?? null)
    })
  }, [supabase])

  if (distanceInMeters > THRESHOLD_DISTANCE_METERS) {
    return <></>
  }

  return (
    <>
      <Button color="dark" onClick={() => setOpenEndModal("form-elements")}> 
        End Tracking
      </Button>
      
      <Modal
        show={openEndModal === "form-elements"}
        size="md"
        popup
        onClose={() => setOpenEndModal(undefined)}
      >
        <Modal.Header />
        <Modal.Body>
          <h3>You have found the grave!</h3>
        </Modal.Body>
        <Modal.Footer>
          <Button color="dark" onClick={() => {user
            ? router.push(`/graves/${graveId}`)
            : router.push(`/graves/${graveId}/search_result`);}}>
            Back to Grave page
          </Button>
          { user ? (
            <Button color="dark" onClick={() => { setOpenEndModal(undefined); setOpenRatingModal("form-elements"); }}>
              Rate & Comment
            </Button>
          ) : (
            <Button color="dark" onClick={() => { setOpenEndModal(undefined); setOpenRatingModal("form-elements"); }}>
              Rate Accuracy
            </Button>
          ) }
        </Modal.Footer>
      </Modal>

      <Modal
        show={openRatingModal === "form-elements"}
        size="md"
        popup
        onClose={() => { setOpenRatingModal(undefined); setOpenEndModal("form-elements"); }}
      >
        <Modal.Header />
        <Modal.Body>
          <form action={addGraveRatingWithID}>
            <div className="mb-1 block">
              <Label value="Accuracy rating" />
            </div>
            <StarRating name="rating" id="star" value={rating} onChange={onRating} maxStars={5} />
            { user && (
              <>
                <div className="mb-2 mt-2 block">
                  <Label htmlFor="comment" value="Comments" />
                </div>
                <Textarea id="comment" name="comment" placeholder="Leave a comment..." rows={4} />
              </>
            ) }
            <RateSubmitBtn />
          </form>
        </Modal.Body>
      </Modal>
    </>
  );
};

export default RateButton;

