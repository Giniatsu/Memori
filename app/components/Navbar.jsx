"use client";
import { Avatar, Dropdown, Navbar, Flowbite } from "flowbite-react";
import Image from "next/image";
import Link from "next/link";
import LogoutButton from "./LogoutButton";
import { useRouter, usePathname } from "next/navigation";

const customTheme = {
  link: {
    active: {
      on: "bg-blue-600 text-white dark:text-white md:bg-transparent md:text-blue-600",
      off: "text-gray-200 hover:text-white",
    },
  },
};

export default function Navigationbar({ user, profile }) {
  const router = useRouter();
  const pathname = usePathname();
  if (user) {
    return (
      <Navbar fluid className="bg-green-700">
        <Navbar.Brand href="/">
          <Image
            className="mr-1 rounded-full"
            src="/MeMori.png"
            alt=""
            width={50}
            height={50}
          />
          <span className="self-center whitespace-nowrap text-xl font-semibold text-white">
            MeMori
          </span>
        </Navbar.Brand>
        <div className="flex md:order-2">
          <Dropdown
            inline
            label={
              <>
                {profile.avatar_url ? (
                  <Avatar
                    rounded
                    img={`https://plmqhcualnnsirfqjcsj.supabase.co/storage/v1/object/public/avatars/${profile.avatar_url}`}
                  />
                ) : (
                  <Avatar rounded />
                )}
              </>
            }
          >
            <Dropdown.Header>
              <span className="block truncate text-sm font-medium">
                <span>Hello, {profile.username}</span>
              </span>
            </Dropdown.Header>
            <Dropdown.Item href="/account">Profile</Dropdown.Item>
            <Dropdown.Divider />
            <Dropdown.Item>
              <LogoutButton />
            </Dropdown.Item>
          </Dropdown>
          <Navbar.Toggle />
        </div>
        <Navbar.Collapse>
          <Navbar.Link
            /* active={pathname === "/"} */
            href="/"
            className={pathname === "/" ? "text-white" : "text-gray-950"}
          >
            Home
          </Navbar.Link>
          <Navbar.Link
            /* active={pathname === "/search"} */
            href="/search"
            className={pathname === "/search" ? "text-white" : "text-gray-950"}
          >
            Search
          </Navbar.Link>
          {/* <Navbar.Link href="/activity">Activity</Navbar.Link> */}
        </Navbar.Collapse>
      </Navbar>
    );
  }
  if (!user) {
    return (
      <Navbar fluid className="bg-green-700">
        <Navbar.Brand href="/">
          <Image
            className="mr-1 rounded-full"
            src="/MeMori.png"
            alt=""
            width={50}
            height={50}
          />
          <span className="self-center whitespace-nowrap text-xl font-semibold text-white">
            MeMori
          </span>
        </Navbar.Brand>
        <div className="flex md:order-2">
          <Dropdown inline label={<Avatar rounded />}>
            <Dropdown.Item>
              <Link href="/signup">Sign Up</Link>
            </Dropdown.Item>
            <Dropdown.Item>
              <Link href="/login">Log in</Link>
            </Dropdown.Item>
          </Dropdown>
          <Navbar.Toggle />
        </div>
        <Navbar.Collapse>
          <Navbar.Link
            /* active={pathname === "/"} */
            href="/"
            className={pathname === "/" ? "text-white" : "text-gray-950"}
          >
            Home
          </Navbar.Link>
          <Navbar.Link
            /* active={pathname === "/search"} */
            className={pathname === "/search" ? "text-white" : "text-gray-950"}
            href="/search"
          >
            Search
          </Navbar.Link>
        </Navbar.Collapse>
      </Navbar>
    );
  }
}
