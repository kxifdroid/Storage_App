"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import { Button } from "@/components/ui/button";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSet,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { createAccount, signInUser } from "@/app/lib/action/user.action";
import OtpModal from "@/components/OTPModal";

type FormType = "sign-in" | "sign-up";
type AuthResponse = {
  accountId: string;
};

const authFormSchema = (formType: FormType) => {
  return z.object({
    email: z.string().email("Enter a valid email address"),
    fullName:
      formType === "sign-up"
        ? z.string().min(2, "Full name must be at least 2 characters").max(50)
        : z.string().optional(),
  });
};

const AuthForm = ({ type }: { type: FormType }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [accountId, setAccountId] = useState<string | null>(null);

  const formSchema = authFormSchema(type);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      fullName: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsLoading(true);
    setErrorMessage("");
    setAccountId(null);

    try {
      const email = values.email.trim();
      const fullName = values.fullName?.trim() || "";

      const user: AuthResponse | undefined =
        type === "sign-up"
          ? await createAccount({
              fullName,
              email,
            })
          : await signInUser({ email });

      if (!user?.accountId) {
        throw new Error(
          type === "sign-up"
            ? "Account was not created. Please check your Appwrite users collection."
            : "Sign in failed. Please check the email address.",
        );
      }

      setAccountId(user.accountId);
    } catch (error) {
      const fallbackMessage =
        type === "sign-up"
          ? "Failed to create account. Please try again."
          : "Failed to sign in. Please try again.";

      setErrorMessage(
        error instanceof Error ? error.message : fallbackMessage,
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <form onSubmit={form.handleSubmit(onSubmit)} className="auth-form">
        <FieldSet>
          <FieldLegend className="form-title">
            {type === "sign-in" ? "Sign In" : "Sign Up"}
          </FieldLegend>

          <FieldGroup>
            {type === "sign-up" && (
              <Field data-invalid={!!form.formState.errors.fullName}>
                <div className="shad-form-item">
                  <FieldLabel htmlFor="fullName" className="shad-form-label">
                    Full Name
                  </FieldLabel>

                  <Input
                    id="fullName"
                    placeholder="Enter your full name"
                    className="shad-input"
                    aria-invalid={!!form.formState.errors.fullName}
                    {...form.register("fullName")}
                  />
                </div>

                <FieldError
                  className="shad-form-message"
                  errors={[form.formState.errors.fullName]}
                />
              </Field>
            )}

            <Field data-invalid={!!form.formState.errors.email}>
              <div className="shad-form-item">
                <FieldLabel htmlFor="email" className="shad-form-label">
                  Email
                </FieldLabel>

                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  className="shad-input"
                  aria-invalid={!!form.formState.errors.email}
                  {...form.register("email")}
                />
              </div>

              <FieldError
                className="shad-form-message"
                errors={[form.formState.errors.email]}
              />
            </Field>

            <Button
              type="submit"
              className="form-submit-button"
              disabled={isLoading}
            >
              {type === "sign-in" ? "Sign In" : "Sign Up"}

              {isLoading && (
                <Image
                  src="/assets/icons/loader.svg"
                  alt="loader"
                  width={24}
                  height={24}
                  className="ml-2 animate-spin"
                />
              )}
            </Button>

            {errorMessage && <p className="error-message">*{errorMessage}</p>}

            <div className="body-2 flex justify-center">
              <p className="text-light-100">
                {type === "sign-in"
                  ? "Don't have an account?"
                  : "Already have an account?"}
              </p>
              <Link
                href={type === "sign-in" ? "/sign-up" : "/sign-in"}
                className="ml-1 font-medium text-brand"
              >
                {" "}
                {type === "sign-in" ? "Sign Up" : "Sign In"}
              </Link>
            </div>
          </FieldGroup>
        </FieldSet>
      </form>


  {accountId && (<OtpModal email={form.getValues("email")} accountId={accountId} />)}
    </>
  );
};

export default AuthForm;
