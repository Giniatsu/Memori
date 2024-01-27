import React, {useMemo} from 'react';
import * as turf from "@turf/turf";

export const UserArrow = ({ src, dst }) => {
  // Function to calculate the initial bearing between two points on Earth
  const calculateBearing = useMemo(() => {
    if (dst && 'lng' in dst && 'lat' in dst) {
      const from = turf.point([src.lng, src.lat]);
      const to = turf.point([dst.lng, dst.lat]);
      const options = { units: "degrees" };
      return turf.bearing(from, to, options);
    }
    return 90
  }, [src, dst])

  const transform = useMemo(() => {
    return `rotate(${calculateBearing})`
  }, [calculateBearing])

  return (
    <svg
      height="30"
      width="30"
      viewBox="0 0 24 24"
      transform={transform}
      style={{ transformOrigin: '50% 50%' }}
    >
      <polygon points="12 2 19.55 21 12 17 4.45 21 12 2" fill="#3182bd" />
    </svg>
  );
};