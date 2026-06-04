"use client"
import React, { useState, useEffect } from "react";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,

} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { sendEmailOTP, verifySecret } from "@/app/lib/action/user.action";
import { useRouter } from "next/navigation";

const OtpModal = ({accountId, email}: {accountId: string; email : string}) => {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(true);
  const [currentAccountId, setCurrentAccountId] = useState(accountId);
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState<"success" | "error" | "">("");

  // Auto-submit when OTP is complete (6 digits)
  useEffect(() => {
    if (password.length === 6 && !isLoading && !isResending) {
      handleSubmit();
    }
  }, [password]);

  const handleSubmit = async (e?: React.MouseEvent<HTMLButtonElement>) => {
    if (e) e.preventDefault();

    if (password.length !== 6) {
      setMessage("Enter the 6-digit code from your email.");
      setMessageType("error");
      return;
    }

    setIsLoading(true);
    setMessage("");
    setMessageType("");

    try {
      const sessionId = await verifySecret({
        accountId: currentAccountId,
        password,
      });
      if (sessionId) router.push("/");
    } catch (error) {
      console.log("Failed to verify OTP", error);
      setPassword("");
      setMessage("Invalid or expired OTP. Please check the code and try again.");
      setMessageType("error");
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendOtp = async () => {
    setIsResending(true);
    setMessage("");
    setMessageType("");

    try {
      const newAccountId = await sendEmailOTP({ email });
      if (!newAccountId) throw new Error("Failed to resend OTP");

      setCurrentAccountId(newAccountId);
      setPassword("");
      setMessage(`A new OTP has been sent to ${email}.`);
      setMessageType("success");
    } catch (error) {
      console.log("Failed to resend OTP", error);
      setMessage("Could not resend OTP. Please try again.");
      setMessageType("error");
    } finally {
      setIsResending(false);
    }
  };

  return (
    <div>
      <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
        <AlertDialogContent className="shad-alert-dialog">
          <AlertDialogHeader className="relative flex justify-center">
            <AlertDialogTitle className="h2 text-center">
              Enter Your OTP
              <img
                src="/assets/icons/close-dark.svg"
                alt="close"
                width={20}
                height={20}
                onClick={() => setIsOpen(false)}
                className="otp-close-button"
              />
            </AlertDialogTitle>
            <AlertDialogDescription className="subtitle-2 text-center text-light-100">
              We&apos;ve sent a code to{" "}
              <span className="pl-1 text-brand">{email}</span>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <InputOTP maxLength={6} value={password} onChange={setPassword}>
            <InputOTPGroup className="shad-otp">
              <InputOTPSlot index={0} className="shad-otp-slot" />
              <InputOTPSlot index={1} className="shad-otp-slot" />
              <InputOTPSlot index={2} className="shad-otp-slot" />
              <InputOTPSlot index={3} className="shad-otp-slot" />
              <InputOTPSlot index={4} className="shad-otp-slot" />
              <InputOTPSlot index={5} className="shad-otp-slot" />
            </InputOTPGroup>
          </InputOTP>
          {message && (
            <p
              className={`subtitle-2 text-center ${
                messageType === "success" ? "text-brand" : "text-red"
              }`}
            >
              {message}
            </p>
          )}
          <AlertDialogFooter>
            <div className="flex w-full flex-col gap-4">
              <Button
                onClick={handleSubmit}
                className="shad-submit-btn h-12"
                type="button"
                disabled={isLoading || isResending}
              >
                Submit
                {isLoading && (
                  <img
                    src="/assets/icons/loader.svg"
                    alt="loader"
                    width={24}
                    height={24}
                    className="ml-2 animate-spin"
                  />
                )}
              </Button>
              <div className="subtitle-2 mt-2 text-center text-light-100">
                Didn&apos;t get a code?
                <Button
                  type="button"
                  variant="link"
                  className="pl-1 text-brand"
                  onClick={handleResendOtp}
                  disabled={isLoading || isResending}
                >
                  {isResending ? "Resending..." : "Click to resend"}
                </Button>
              </div>
            </div>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};
export default OtpModal;
