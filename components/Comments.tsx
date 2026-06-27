"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { useAuth } from "./AuthProvider";
import Button from "./Button";

type Comment = {
  id: number;
  name: string;
  text: string;
  createdAt: string;
};

type CommentsProps = {
  parentType: "reviews" | "friends" | "life_events";
  parentId: number;
};

export default function Comments({ parentType, parentId }: CommentsProps) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [count, setCount] = useState(0);
  const [isExpanded, setIsExpanded] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [name, setName] = useState("");
  const [text, setText] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    async function loadCount() {
      const { count } = await supabase
        .from("comments")
        .select("*", { count: "exact", head: true })
        .eq("parent_type", parentType)
        .eq("parent_id", parentId);
      setCount(count ?? 0);
    }
    loadCount();
  }, [parentType, parentId]);

  async function toggleExpanded() {
    if (!isExpanded && comments.length === 0) {
      setIsLoading(true);
      const { data, error } = await supabase
        .from("comments")
        .select("*")
        .eq("parent_type", parentType)
        .eq("parent_id", parentId)
        .order("created_at", { ascending: true });

      if (!error && data) {
        setComments(data.map((c) => ({
          id: c.id,
          name: c.name,
          text: c.text,
          createdAt: c.created_at,
        })));
      }
      setIsLoading(false);
    }
    setIsExpanded(!isExpanded);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim() || !text.trim()) return;

    setIsSubmitting(true);
    const { data, error } = await supabase
      .from("comments")
      .insert({ parent_type: parentType, parent_id: parentId, name, text })
      .select()
      .single();

    setIsSubmitting(false);

    if (error || !data) return;

    fetch("/api/notify-comment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, text, parentType, parentId }),
    }).catch(() => {});

    setComments([...comments, {
      id: data.id,
      name: data.name,
      text: data.text,
      createdAt: data.created_at,
    }]);
    setCount(count + 1);
    setName("");
    setText("");
  }

  async function handleDelete(id: number) {
    if (!confirm("Delete this comment?")) return;
    const { error } = await supabase.from("comments").delete().eq("id", id);
    if (!error) {
      setComments(comments.filter((c) => c.id !== id));
      setCount(count - 1);
    }
  }

  return (
    <div>
      <button
        type="button"
        onClick={toggleExpanded}
        className="text-pink-strong hover:underline"
      >
        {isExpanded && "Hide"} Comments {count > 0 && `(${count})`}
      </button>

      {isExpanded && (
        <div className="mt-3">
          {isLoading && <p>Loading...</p>}

          {!isLoading && comments.length === 0 && (
            <p>No comments yet, be the first!</p>
          )}

          <ul>
            {comments.map((c) => (
              <li key={c.id} className="mb-2">
                <strong>{c.name}:</strong> {c.text}
                {user && (
                  <button
                    type="button"
                    onClick={() => handleDelete(c.id)}
                    className="ml-2 text-red-500"
                  >
                    ×
                  </button>
                )}
              </li>
            ))}
          </ul>

          <form onSubmit={handleSubmit} className="mt-3 flex flex-col gap-2">
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Your name"
              maxLength={50}
              required
            />
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Your comment"
              maxLength={500}
              rows={2}
              required
            />
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Posting..." : "Post Comment"}
            </Button>
          </form>
        </div>
      )}
    </div>
  );
}