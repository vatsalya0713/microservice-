import React, { useState } from 'react';
import { Star } from 'lucide-react';

export default function StarRating({ rating = 0, onChange, interactive = false }) {
  const [hoverRating, setHoverRating] = useState(0);

  const handleStarClick = (value) => {
    if (interactive && onChange) {
      onChange(value);
    }
  };

  const handleStarMouseEnter = (value) => {
    if (interactive) {
      setHoverRating(value);
    }
  };

  const handleStarMouseLeave = () => {
    if (interactive) {
      setHoverRating(0);
    }
  };

  return (
    <div className={`star-input-container ${!interactive ? 'rating-stars' : ''}`}>
      {[1, 2, 3, 4, 5].map((value) => {
        const isFilled = hoverRating > 0 ? value <= hoverRating : value <= rating;
        
        return (
          <button
            key={value}
            type="button"
            className={`star-btn ${isFilled ? 'active' : ''}`}
            onClick={() => handleStarClick(value)}
            onMouseEnter={() => handleStarMouseEnter(value)}
            onMouseLeave={handleStarMouseLeave}
            disabled={!interactive}
          >
            <Star
              size={interactive ? 28 : 16}
              fill={isFilled ? 'currentColor' : 'none'}
              strokeWidth={interactive ? 1.5 : 2}
            />
          </button>
        );
      })}
    </div>
  );
}
