"use client";

import { useState, useEffect } from "react";
import { MediaSearchResult } from "@/lib/media/types";

type MediaSearchProps = {
  search: (query: string) => Promise<MediaSearchResult[]>;
  placeholder?: string;
  onSelect: (item: MediaSearchResult) => void;
};

export default function MediaSearch({ search, placeholder = "Search...", onSelect }: MediaSearchProps) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<MediaSearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (query.trim() === "") {
      setResults([]);
      return;
    }

    const timeoutId = setTimeout(async () => {
      setIsLoading(true);
      try {
        const data = await search(query);
        setResults(data);
      } catch (error) {
        console.error("Search failed:", error);
        setResults([]);
      } finally {
        setIsLoading(false);
      }
    }, 400);

    return () => clearTimeout(timeoutId);
  }, [query, search]);

  return (
    <div className="w-[100%] sm:w-[50%]">
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder={placeholder}
        className="w-[100%]"
      />

      {isLoading && <p>Searching...</p>}

      {results.length > 0 && (
        <ul>
          {results.map((item) => (
            <li key={item.id} className="min-w-0 bg-lowlight">
              <button
                type="button"
                className="flex items-center cursor-pointer border-1 border-b-0 w-[100%] gap-2 first:border-t-0 last:border-b-1 hover:font-bold"
                onClick={() => {
                  onSelect(item);
                  setQuery("");
                  setResults([]);
                }}
              >
                {item.imageUrl && <img src={item.imageUrl} alt="" width={45} height={45} />}
                <span className="flex flex-col items-start min-w-0">
                  <span className="truncate text-left w-full text-[14px]">{item.title}</span>
                  {item.artist && <span className="truncate text-left w-full text-[14px]">{item.artist}</span>}
                </span>
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}