import React, { useState } from 'react';
import { Rating } from 'flowbite-react';

function StarRating({ id, name, onChange, value, maxStars }) {
  const [hoverValue, setHoverValue] = useState(0);

  const handleStarClick = (index) => {
    onChange(index + 1);
  };

  const handleStarHover = (index) => {
    setHoverValue(index + 1);
  };

  const handleMouseLeave = () => {
    setHoverValue(0);
  };

  return (
    <div className="flex flex-col gap-2">
      <input type="number" className="hidden" id={id} name={name} value={value} />
      <Rating size="md">
        {[...Array(maxStars)].map((_, index) => (
          <Rating.Star
            key={index}
            filled={index < (hoverValue || value)}
            onClick={() => handleStarClick(index)}
            onMouseEnter={() => handleStarHover(index)}
            onMouseLeave={handleMouseLeave}
          />
        ))}
      </Rating>
    </div>
  );
}

export default StarRating;

