"use client";

import Link from "next/link";
import { FC, useState } from "react";
import { IoHomeOutline, IoPowerSharp, IoSettingsOutline } from "react-icons/io5";
import { TbUsers } from "react-icons/tb";
import { MdOutlineIncompleteCircle, MdOutlinePending, MdOutlinePerson } from "react-icons/md";
import { FaList } from "react-icons/fa";
import { signOut } from "next-auth/react";
import { usePathname } from "next/navigation";
import React from "react";
import { MdOutlineEmail } from "react-icons/md";

const Sidebar: FC = () => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const pathname = usePathname();

  const handleToggle = (): void => {
    setIsOpen(prev => !prev);
  };

  return (
    <div className="h-max pb-14 shadow-xl px-14">
      <h3 className="flex justify-center font-semibold m-2 text-2xl">
        Dashboard
      </h3>
      <ul className="flex flex-col items-center text-[15px] text-left space-y-10 mt-10">
        <Link href="/admin">
          <li className={`${pathname == '/admin' ? 'text-violet-600' : 'text-black'}  flex items-center text-left hover:text-violet-600 cursor-pointer font-semibold`}>
            <IoHomeOutline className="text-2xl mr-2" />
            Home
          </li>
        </Link>
        <Link href="/admin/postlist">
          <li className={`${pathname == '/admin/postlist' ? 'text-violet-600' : 'text-black'}  flex items-center text-left hover:text-violet-600 cursor-pointer font-semibold`}>
            <FaList className="text-2xl mr-2" />
            Posts
          </li>
        </Link>
        <Link href="/admin/users">
          <li className={`${pathname == '/admin/users' ? 'text-violet-600' : 'text-black'}  flex items-center text-left hover:text-violet-600 cursor-pointer font-semibold`}>
            <TbUsers className="text-2xl mr-2" />
            Users
          </li>
        </Link>

        <Link href="/admin/contact">
          <li className={`${pathname == '/admin/contact' ? 'text-violet-600' : 'text-black'}  flex items-center text-left hover:text-violet-600 cursor-pointer font-semibold`}>
            <MdOutlineEmail className="text-2xl mr-2" />
            Contact
          </li>
        </Link>
        <Link href="/admin/profile">
          <li className={`${pathname == '/admin/profile' ? 'text-violet-600' : 'text-black'}  flex items-center text-left hover:text-violet-600 cursor-pointer font-semibold`}>
            <MdOutlinePerson className="text-2xl mr-2" />
            Profile
          </li>
        </Link>
        <div className="relative">
          <li
            onClick={handleToggle}
            className={`flex items-center text-left hover:text-violet-600 cursor-pointer font-semibold`}
          >
            <IoPowerSharp className="text-2xl mr-2" />
            Logout
          </li>
          {isOpen && (
            <div className="absolute p-[10px] bg-indigo-400 top-[-10px] z-50 shadow-xl h-[145px] w-[300px]">
              <span className="flex items-center justify-center p-2 text-xl text-white">
                Are you sure you want to logout?
              </span>
              <div className="flex gap-3">
                <button
                  onClick={handleToggle}
                  className="cursor-pointer"
                >
                  Close
                </button>
                <button
                  onClick={() => signOut()}
                  className="bg-red-500 text-white p-2 rounded"
                >
                  Log Out
                </button>
              </div>
            </div>
          )}
        </div>
      </ul>
    </div>
  );
};

export default Sidebar;
