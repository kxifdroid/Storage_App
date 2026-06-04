"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import FileUploader from "@/components/FileUploader";
import Search from "@/components/Search";
import { signOutUser } from "@/app/lib/action/user.action";

const Header = ({userId, accountId} : {userId: string; accountId : string}) => {
  const [isLogoutDialogOpen, setIsLogoutDialogOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogoutConfirm = async () => {
    setIsLoggingOut(true);
    try {
      await signOutUser();
    } catch (error) {
      console.error("Logout failed:", error);
      setIsLoggingOut(false);
      setIsLogoutDialogOpen(false);
    }
  };

  return (
    <header className="header">
      <Search />
      <div className="header-wrapper">
        <FileUploader ownerId={userId}  accountId={accountId} />
        <Button
          onClick={() => setIsLogoutDialogOpen(true)}
          className="sign-out-button"
          disabled={isLoggingOut}
        >
          <Image
            src="/assets/icons/logout.svg"
            alt="logout"
            width={24}
            height={24}
            className="w-6"
          />
        </Button>

        <AlertDialog open={isLogoutDialogOpen} onOpenChange={setIsLogoutDialogOpen}>
          <AlertDialogContent className="shad-alert-dialog">
            <AlertDialogHeader>
              <AlertDialogTitle>Confirm Logout</AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure you want to log out? You will need to sign in again to access your files.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel disabled={isLoggingOut}>
                Cancel
              </AlertDialogCancel>
              <AlertDialogAction
                onClick={handleLogoutConfirm}
                disabled={isLoggingOut}
                className="bg-red-600 hover:bg-red-700"
              >
                {isLoggingOut ? "Logging out..." : "Logout"}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </header>
  );
};
export default Header;
