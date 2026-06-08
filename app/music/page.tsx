"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import ReviewCard from "@/components/ReviewCard";
import ReviewForm from "@/components/ReviewForm";

type Review = {
  id: number;
  album: string;
  artist: string;
  date: string;
  rating: number;
  review: string;
  coverUrl: string;
};
type NewReview = Omit<Review, "id">;

export default function Music() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Load reviews from Supabase when the page mounts
  useEffect(() => {
    async function loadReviews() {
      const { data, error } = await supabase
        .from("reviews")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Failed to load reviews:", error);
        setIsLoading(false);
        return;
      }

      // Map DB columns (snake_case) to our component shape (camelCase)
      const mapped: Review[] = data.map((row) => ({
        id: row.id,
        album: row.album,
        artist: row.artist,
        coverUrl: row.cover_url,
        date: row.listened_on,
        rating: row.rating,
        review: row.review_text,
      }));

      setReviews(mapped);
      setIsLoading(false);
    }

    loadReviews();
  }, []);

  // Insert a new review into Supabase, then update local state
  async function addReview(newReview: NewReview) {
    const { data, error } = await supabase
      .from("reviews")
      .insert({
        album: newReview.album,
        artist: newReview.artist,
        cover_url: newReview.coverUrl,
        listened_on: newReview.date,
        rating: newReview.rating,
        review_text: newReview.review,
      })
      .select()
      .single();

    if (error) {
      console.error("Failed to save review:", error);
      alert("Could not save review. Check the console.");
      return;
    }

    // Add the newly-inserted row (with its real DB id) to local state
    const inserted: Review = {
      id: data.id,
      album: data.album,
      artist: data.artist,
      coverUrl: data.cover_url,
      date: data.listened_on,
      rating: data.rating,
      review: data.review_text,
    };

    setReviews([inserted, ...reviews]);
  }

  return (
    <main>
      <h1>Music Reviews</h1>
      <ReviewForm onAddReview={addReview} />

      {isLoading ? (
        <p>Loading reviews...</p>
      ) : reviews.length === 0 ? (
        <p>No reviews yet. Add one above!</p>
      ) : (
        reviews.map((r, index) => (
          <ReviewCard
            key={index}
            album={r.album}
            artist={r.artist}
            date={r.date}
            rating={r.rating}
            review={r.review}
            coverUrl={r.coverUrl}
          />
        ))
      )}
    </main>
  );
}