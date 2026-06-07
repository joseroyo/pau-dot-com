import Link from "next/link";

export default function Navigation() {
  return (
    <nav>
      <Link href="/">Home</Link>
      <Link href="/music">Music</Link>
      <Link href="/login">Login</Link>
    </nav>
  );
}