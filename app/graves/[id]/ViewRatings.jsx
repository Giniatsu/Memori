"use client";
import { MdRateReview } from "react-icons/md";
import { useState } from "react";
import Sheet from "react-modal-sheet";
import { Button } from "flowbite-react";
const AVATAR_URL =
  "https://plmqhcualnnsirfqjcsj.supabase.co/storage/v1/object/public/avatars/";

const ViewRatings = ({ratingsInfo}) => {
  const [isRatingsOpen, setRatingsOpen] = useState(false);
  const averageRatings =
    ratings?.length ?? 0 > 0
      ? ratings.reduce(function (sum, value) {
          return sum + parseInt(value.rating);
        }, 0) / ratings.length
      : 0;
  return (
    <>
      <Button
        className="basis-1/2 whitespace-nowrap"
        color="gray"
        onClick={() => setRatingsOpen(true)}
      >
        <MdRateReview className="mr-2 h-4 w-4" />
        View Ratings
      </Button>
      <Sheet isOpen={isRatingsOpen} onClose={() => setRatingsOpen(false)}>
        <Sheet.Container className="px-4">
          <Sheet.Header />
          <Sheet.Content
            style={{
              paddingX: "2rem",
            }}
          >
            <Sheet.Scroller draggableAt="both">
                {/* Rating content here */}
            </Sheet.Scroller>
          </Sheet.Content>
        </Sheet.Container>
      </Sheet>
    </>
  );
};

export default ViewRatings;
