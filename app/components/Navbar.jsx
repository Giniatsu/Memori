import Link from "next/link";
import LogoutButton from "./LogoutButton";

export default function Navbar({user}) {
  return (
    <nav>
      <h1>GraveFinder</h1>
      <Link href="/">Home</Link>
      <Link href="/search" className="mr-auto">Search</Link>
      {user && <span>Hello, {user.email}</span>}
      <LogoutButton />
    </nav>
  );
}
