import Button from "./Button";
import { getItunesArtwork } from "@/lib/itunes";

type ReviewCardProps = {
  id: number,
  album: string;
  artist: string;
  date: string;
  rating: number;
  review: string;
  coverUrl: string;
  onDelete?: (id: number) => void;
};

export default function ReviewCard({ id, album, artist, date, rating, review, coverUrl, onDelete }: ReviewCardProps) {
  function handleDelete() {
    if (!onDelete) return;
    const confirmed = confirm(`Delete your review of "${album}"?`);
    if (confirmed) {
      onDelete(id);
    }
  }

  return (
    <article className="border-2 flex mb-4 gap-4 relative bg-white">
      <img src={getItunesArtwork(coverUrl, 600)} alt={`${album} cover`} width={200} height={200} />
      <div className="py-4">
        <h3>{album}</h3>
        <p>{artist}</p>
        <p>Listened on: {date}</p>
        <p>
          {"★".repeat(rating)}
          <span className="text-gray-300">{"★".repeat(5 - rating)}</span>
        </p>
        <p>{review}</p>
      </div>
      {onDelete && (
        <Button type="button" variant="secondary" className="absolute right-0 border-0" onClick={handleDelete}>x</Button>
      )}
    </article>
  );
}