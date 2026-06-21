"use client"

import { getItunesArtwork } from "@/lib/itunes";
import { useState } from "react";
import StarRating from "./StarRating";
import StarDisplay from "./StarDisplay";

type ReviewCardProps = {
  id: number;
  title: string;
  artist?: string;
  imageUrl: string;
  date: string;
  rating: number;
  review: string;
  onDelete?: (id: number) => void;
  onUpdate?: (id: number, newReview: string, newRating: number) => void;
};

export default function ReviewCard({ id, title, artist, date, rating, review, imageUrl, onDelete, onUpdate }: ReviewCardProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedText, setEditedText] = useState(review);
  const [editedRating, setEditedRating] = useState(rating);
  const [isExpanded, setIsExpanded] = useState(false);
  const isLongReview = review.length > 280;

  function handleDelete() {
    if (!onDelete) return;
    const confirmed = confirm(`Delete your review of "${title}"?`);
    if (confirmed) {
      onDelete(id);
    }
  }

  function handleSave() {
    if ((editedText === review) && (editedRating === rating)) {
      setIsEditing(false);
      return;
    }

    const confirmed = confirm("Ready to save these changes?");
    if (!confirmed) return;

    onUpdate?.(id, editedText, editedRating);
    setIsEditing(false);
  }

  function handleCancel() {
    setEditedText(review);
    setEditedRating(rating);
    setIsEditing(false);
  }

  return (
    <article className="flex gap-4 relative">
      <img src={getItunesArtwork(imageUrl, 600)} alt={`${imageUrl} cover`} className="w-[100px] h-[auto] absolute sm:w-[200px] sm:h-[100%] sm:relative md:w-[100px] md:h-[auto] md:absolute lg:w-[150px] lg:h-[100%] lg:relative xl:w-[200px]" width={200} height={200} />
      <div className="w-[100%]">
        {onUpdate && (
          <button type="button" onClick={() => setIsEditing(true)} className="absolute right-0 text-primary hover:underline">Edit</button>
        )}
        <div className="pl-[115px] sm:pl-0 md:pl-[115px] lg:pl-0">
          <h3 className="line-clamp-2">{title}</h3>
          <p>{artist}</p>
          <p>Date logged: {date}</p>
          {isEditing ? (
            <div>
              <StarRating value={editedRating} onChange={setEditedRating} />
            </div>
          ) : (
            <StarDisplay value={rating} />
          )}
        </div>
        <div className="mt-[5px] sm:mt-0 md:mt-[5px] lg:mt-0">
          {isEditing ? (
            <div className="flex flex-col mt-1">
              <textarea
                value={editedText}
                onChange={(e) => setEditedText(e.target.value)}
                rows={5}
                className="pr-2"
              />
              <article className="flex justify-between mt-3">
                <button type="button" onClick={handleCancel} className="hover:underline">Cancel</button>
                <button type="button" onClick={handleSave} className="hover:underline">Save</button>
              </article>
            </div>
          ) : (
            <p className={!isExpanded && isLongReview ? "line-clamp-3 sm:line-clamp-5" : ""}>
              {review}
            </p>
          )}
          {isLongReview && !isEditing && (
            <button type="button" onClick={() => setIsExpanded(!isExpanded)} className="text-pink-strong underline">
              {isExpanded ? "Read less" : "Read more"}
            </button>
          )}
        </div>
      </div>
      {onDelete && (
        <button type="button" className="absolute right-[-23px] top-[-59px] border-0 px-4 py-2 cursor-pointer" onClick={handleDelete}>x</button>
      )}
    </article>
  );
}