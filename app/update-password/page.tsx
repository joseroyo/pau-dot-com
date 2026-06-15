"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/components/AuthProvider";
import Button from "@/components/Button";
import Window from "@/components/Window";

export default function UpdatePassword() {
  const [password, setPassword] = useState("");
  const { isRecoveringPassword, isAuthLoading } = useAuth();
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const { error } = await supabase.auth.updateUser({ password });
    if (!error) {
      await supabase.auth.signOut();
      router.push("/login");
    }
  }

  if (isAuthLoading) return <p>Loading...</p>;

  if (!isRecoveringPassword) {
    return <h1 className="text-center">what are you doing here silly</h1>;
  }

  return (
    <Window title="Set New Password" className="w-[33%] self-center">
        <form onSubmit={handleSubmit} className="flex flex-col">
            <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
            />
            <Button type="submit" className="mt-3">Update</Button>
        </form>
    </Window>
  );
}