"use client";
import { Avatar, Dropdown, Navbar } from "flowbite-react";
import Image from 'next/image'
import Link from "next/link";
import LogoutButton from "./LogoutButton";
import { useRouter, usePathname } from "next/navigation";

export default function Navigationbar({ user, profile }) {
  const router = useRouter();
  const pathname = usePathname();
  if (user) {
    return (
      <Navbar fluid className="bg-vintage-army">
        <Navbar.Brand href="/">
          <Image
            className="mr-1 rounded-full"
            src='/Memori.jpg'
            alt=""
            width={50}
            height={50}
          />
          <span className="self-center whitespace-nowrap text-xl font-semibold dark:text-white">
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
          <Navbar.Link active={pathname === "/"} href="/">
            Home
          </Navbar.Link>
          <Navbar.Link active={pathname === "/search"} href="/search">
            Search
          </Navbar.Link>
          {/* <Navbar.Link href="/activity">Activity</Navbar.Link> */}
        </Navbar.Collapse>
      </Navbar>
    );
  }
  if(!user){
    return (
      <Navbar fluid className="bg-vintage-army">
        <Navbar.Brand href="/">
          <Image
            className="mr-1 rounded-full"
            src="/Memori.jpg"
            alt=""
            width={50}
            height={50}
          />
          <span className="self-center whitespace-nowrap text-xl font-semibold dark:text-white">
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
          <Navbar.Link active={pathname === "/"} href="/">
            Home
          </Navbar.Link>
          <Navbar.Link active={pathname === "/search"} href="/search">
            Search
          </Navbar.Link>
        </Navbar.Collapse>
      </Navbar>
    );
  }
}
