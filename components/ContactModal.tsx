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
import { toast } from "sonner";

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

const ContactModal = ({ open, onOpenChange }: Props) => {
  const [message, setMessage] = useState("");
  const [isSending, setIsSending] = useState(false);

  const handleSubmit = async () => {
    if (!message.trim()) return toast.error("Please enter a message");
    setIsSending(true);

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message }),
      });

      if (!res.ok) throw new Error("Failed to send feedback");

      toast.success("Thanks for your feedback");
      setMessage("");
      onOpenChange(false);
    } catch (error) {
      console.error(error);
      toast.error(
        "Could not send message. You can also email kasifiit@gmail.com",
      );
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div>
      <AlertDialog open={open} onOpenChange={onOpenChange}>
        <AlertDialogContent className="shad-alert-dialog max-w-md">
          <AlertDialogHeader>
            <AlertDialogTitle>Contact Developer</AlertDialogTitle>
          </AlertDialogHeader>

          <div className="p-4">
            <label className="text-sm">Message</label>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows={6}
              className="w-full p-2 border rounded"
            />
          </div>

          <AlertDialogFooter>
            <div className="flex gap-2 w-full">
              <Button
                variant="outline"
                onClick={() => onOpenChange(false)}
                disabled={isSending}
              >
                Cancel
              </Button>
              <Button
                onClick={handleSubmit}
                className="ml-auto"
                disabled={isSending}
              >
                {isSending ? "Sending..." : "Send"}
              </Button>
            </div>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default ContactModal;
