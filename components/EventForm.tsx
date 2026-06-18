"use client";

import { useState } from "react";
import Button from "./Button";
import ImageUpload from "./ImageUpload";
import StarRating from "./StarRating";

export type EventSubmission = {
  lifeEvent: string;
  date: string;
  rating: number;
  description: string;
  photoUrl: string;
};

type EventFormProps = {
  onAddReview: (data: EventSubmission) => void;
};

export default function FriendForm({ onAddReview }: EventFormProps) {
  const [lifeEvent, setLifeEvent] = useState("");
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
  const [rating, setRating] = useState(0);
  const [description, setDescription] = useState("");
  const [photoUrl, setPhotoUrl] = useState("");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (lifeEvent === "") {
      alert("Please write the event's name/title");
      return;
    }

    if (rating === 0) {
      alert("Please pick a rating.");
      return;
    }

    onAddReview({ lifeEvent, date, rating, description, photoUrl });
    setLifeEvent("");
    setDate(new Date().toISOString().slice(0, 10));
    setRating(0);
    setDescription("");
    setPhotoUrl("");
  }

  return (
    <form className="flex flex-col justify-center" onSubmit={handleSubmit}>
      <section className="flex gap-5 justify-between">
        <ImageUpload value={photoUrl} onChange={setPhotoUrl} bucket="site-photos" />
        <section className="flex flex-col w-[50%]">
          <input
            type="text"
            value={lifeEvent}
            onChange={(e) => setLifeEvent(e.target.value)}
            placeholder="Add event..."
            className="w-[100%]"
          />
          <input
              type="date"
              value={date}
              className="focus:outline-0"
              onChange={(e) => setDate(e.target.value)}
            />
          <div>
            <StarRating value={rating} onChange={setRating} />
          </div>
          <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Write more details..."
              rows={4}
              className="pr-2"
            />
          <Button type="submit" className="mt-3">Save Life Event</Button>
        </section>
      </section>
    </form>
  );
}