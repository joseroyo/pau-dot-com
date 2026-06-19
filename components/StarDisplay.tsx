type StarDisplayProps = {
  value: number;
};

function getStarState(starNumber: number, rating: number): "empty" | "half" | "full" {
  if (rating >= starNumber) return "full";
  if (rating >= starNumber - 0.5) return "half";
  return "empty";
}

export default function StarDisplay({ value }: StarDisplayProps) {
  return (
    <div className="flex gap-1" aria-label={`Rated ${value} out of 5`}>
      {[1, 2, 3, 4, 5].map((starNumber) => {
        const state = getStarState(starNumber, value);

        return (
          <span
            key={starNumber}
            className="relative text-[25px] leading-none inline-block"
          >
            <span className="text-lowlight">★</span>
            <span
                className="absolute top-0 left-0 text-pink-strong overflow-hidden"
                style={{
                width: state === "full" ? "100%" : state === "half" ? "50%" : "0%",
                }}
            >
                ★
            </span>
          </span>
        );
      })}
    </div>
  );
}