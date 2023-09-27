"use client";

import { Avatar, Dropdown, Navbar } from "flowbite-react";

import Link from "next/link";
import LogoutButton from "./LogoutButton";
import Image from "next/image";

export default function Navigationbar({ user }) {
  if (user) {
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
                img="https://flowbite.com/docs/images/people/profile-picture-5.jpg"
                rounded
              />
            }
          >
            <Dropdown.Header>
              <span className="block truncate text-sm font-medium">
                {user && <span>Hello, {user.email}</span>}
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
                img="https://flowbite.com/docs/images/people/profile-picture-5.jpg"
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
  
    
    /* <nav>
      <div>
        <Link href="/">
          <Image
            className="mr-3"
            src="/app/samplelogo.jpg"
            alt=""
            width={50}
            height={50}
          />
          <span>GraveFinder</span>
        </Link>
        
        <Link href="/">Home</Link>
        <Link href="/search" className="mr-auto">
          Search
        </Link>
        {user && <span>Hello, {user.email}</span>}
        <LogoutButton />
      </div>
    </nav> */
  
}
