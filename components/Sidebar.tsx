"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { avatarPlaceholderUrl, navItems } from "@/constants";

import { cn } from "@/lib/utils";
import ProfileModal from "@/components/ProfileModal";
import ContactModal from "@/components/ContactModal";

interface Props {
  fullName: string;
  email: string;
  avatar?: string;
  accountId?: string;
  $id?: string; // user document id
}

const Sidebar = ({ fullName, email, avatar, $id }: Props) => {
  const pathname = usePathname();
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isContactOpen, setIsContactOpen] = useState(false);

  return (
    <aside className="sidebar">
      <Link href="/">
        <Image
          src="/assets/icons/logo-full-brand.svg"
          alt="logo"
          width={160}
          height={50}
          className="hidden h-auto lg:block"
        />
        <Image
          src="/assets/icons/logo-brand.svg"
          alt="logo"
          width={52}
          height={52}
          className="lg:hidden"
        />
      </Link>
      <nav className="sidebar-nav">
        <ul className="flex flex-1 flex-col gap-6">
          {navItems.map(({ url, name, icon }) => (
            <Link key={name} href={url} className="lg:w-full">
              <li
                className={cn(
                  "sidebar-nav-item",
                  pathname === url && "shad-active",
                )}
              >
                <Image
                  src={icon}
                  alt={name}
                  width={24}
                  height={24}
                  className={cn(
                    "nav-icon",
                    pathname === url && "nav-icon-active",
                  )}
                />
                <p className="hidden lg:block">{name}</p>
              </li>
            </Link>
          ))}
        </ul>
      </nav>
      <Image
        src="/assets/images/files-2.png"
        alt="logo"
        width={506}
        height={418}
        className="w-full"
      />
      <div className="sidebar-user-info">
        <button
          onClick={() => setIsProfileOpen(true)}
          className="flex items-center gap-3"
          aria-label="Open profile"
        >
          <Image
            src={avatar || avatarPlaceholderUrl}
            alt="Avatar"
            width={44}
            height={44}
            className="sidebar-user-avatar"
          />
          <div className="hidden lg:block text-left">
            <p className="subtitle-2 capitalize">{fullName}</p>
            <p className="caption">{email}</p>
          </div>
        </button>

        <div className="mt-3 lg:mt-0">
          <button
            onClick={() => setIsContactOpen(true)}
            className="text-sm text-brand underline"
          >
            Contact Developer
          </button>
        </div>
      </div>

      <ProfileModal
        open={isProfileOpen}
        onOpenChange={setIsProfileOpen}
        defaultFullName={fullName}
        avatar={avatar}
        userDocId={$id}
      />

      <ContactModal open={isContactOpen} onOpenChange={setIsContactOpen} />
    </aside>
  );
};
export default Sidebar;
