"use client";

import { Avatar, Dropdown, Navbar } from "flowbite-react";

import Link from "next/link";
import LogoutButton from "./LogoutButton";
import Image from "next/image";

export default function Navigationbar({ user, profile }) {
  if (user) {
    return (
      <Navbar fluid className="bg-vintage-army">
        <Navbar.Brand href="/">
          {/* <Image
          className="mr-3"
          src={avatarUrl}
          alt=""
          width={50}
          height={50}
        /> */}
          <span className="self-center whitespace-nowrap text-xl font-semibold dark:text-white">
            GraveFinder
          </span>
        </Navbar.Brand>
        <div className="flex md:order-2">
          <Dropdown
            inline
            label={
              <Avatar
                alt="User settings"
                rounded
                img={`https://plmqhcualnnsirfqjcsj.supabase.co/storage/v1/object/public/avatars/${profile.avatar_url}`}
              />
              /*  <Image
                  src={avatarUrl}
                  alt="Avatar"
                  width={50}
                  height={50}
                /> */
            }
          >
            <Dropdown.Header>
              <span className="block truncate text-sm font-medium">
                <span>Hello, {profile.username}</span>
              </span>
            </Dropdown.Header>
            <Dropdown.Item>Settings</Dropdown.Item>
            <Dropdown.Divider />
            <Dropdown.Item>
              <LogoutButton />
            </Dropdown.Item>
          </Dropdown>
          <Navbar.Toggle />
        </div>
        <Navbar.Collapse>
          <Navbar.Link active href="/">
            Home
          </Navbar.Link>
          <Navbar.Link href="/search">Search</Navbar.Link>
        </Navbar.Collapse>
      </Navbar>
    );
  }
  if(!user){
    return (
      <Navbar fluid className="bg-vintage-army">
        <Navbar.Brand href="/">
          {/* <Image
            className="mr-3"
            src="/"
            alt=""
            width={50}
            height={50}
          /> */}
          <span className="self-center whitespace-nowrap text-xl font-semibold dark:text-white">
            GraveFinder
          </span>
        </Navbar.Brand>
        <div className="flex md:order-2">
          <Dropdown
            inline
            label={
              <Avatar
                alt="User settings"
                rounded
              />
            }
          >
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
          <Navbar.Link active href="/">
            Home
          </Navbar.Link>
        </Navbar.Collapse>
      </Navbar>
    );
  }
}
