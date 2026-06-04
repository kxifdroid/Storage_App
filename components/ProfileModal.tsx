"use client";

import React, { useState } from "react";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Image from "next/image";
import { avatarPlaceholderUrl } from "@/constants";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

import { getClientStorage } from "@/app/lib/appwrite/client";
import { createUploadJwt } from "@/app/lib/action/files.action";
import { constructFileUrl } from "@/app/lib/utils";
import { updateUserProfile } from "@/app/lib/action/user.action";
import { ID } from "appwrite";

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  defaultFullName: string;
  avatar?: string;
  userDocId?: string;
};

const ProfileModal = ({
  open,
  onOpenChange,
  defaultFullName,
  avatar,
}: Props) => {
  const router = useRouter();
  const [fullName, setFullName] = useState(defaultFullName || "");
  const [isSaving, setIsSaving] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    try {
      const jwt = await createUploadJwt();
      const storage = getClientStorage(jwt);
      const bucketFile = await storage.createFile(
        process.env.NEXT_PUBLIC_APPWRITE_BUCKET!,
        ID.unique(),
        file,
      );

      const avatarUrl = constructFileUrl(bucketFile.$id);

      // update profile with new avatar
      await updateUserProfile({ avatar: avatarUrl });
      toast.success("Avatar uploaded");
      onOpenChange(false);
      router.refresh();
    } catch (error) {
      console.error(error);
      toast.error("Failed to upload avatar");
    } finally {
      setIsUploading(false);
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await updateUserProfile({ fullName });
      toast.success("Profile updated");
      onOpenChange(false);
      router.refresh();
    } catch (error) {
      console.error(error);
      toast.error("Failed to update profile");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div>
      <AlertDialog open={open} onOpenChange={onOpenChange}>
        <AlertDialogContent className="shad-alert-dialog max-w-md">
          <AlertDialogHeader>
            <AlertDialogTitle>Edit Profile</AlertDialogTitle>
          </AlertDialogHeader>

          <div className="flex flex-col gap-4 p-4">
            <div className="flex items-center gap-4">
              <Image src={avatar || avatarPlaceholderUrl} alt="avatar" width={64} height={64} className="rounded-full" />
              <div>
                <label className="text-sm">Upload custom avatar</label>
                <input type="file" accept="image/*" onChange={handleFileChange} disabled={isUploading} />
              </div>
            </div>

            <div>
              <label className="text-sm">Full Name</label>
              <Input value={fullName} onChange={(e) => setFullName(e.target.value)} />
            </div>

            {/* Email editing removed: backend does not support changing email */}
          </div>

          <AlertDialogFooter>
            <div className="flex gap-2 w-full">
              <Button variant="outline" onClick={() => onOpenChange(false)} disabled={isSaving || isUploading}>
                Cancel
              </Button>
              <Button onClick={handleSave} className="ml-auto" disabled={isSaving || isUploading}>
                {isSaving ? "Saving..." : "Save"}
              </Button>
            </div>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default ProfileModal;
