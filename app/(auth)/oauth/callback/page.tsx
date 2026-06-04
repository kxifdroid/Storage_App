import { completeOAuthSignIn } from "@/app/lib/action/user.action";
import { redirect } from "next/navigation";

const OAuthCallback = async ({ searchParams }: SearchParamProps) => {
  const params = await searchParams;
  const userId = params?.userId;
  const secret = params?.secret;

  if (typeof userId !== "string" || typeof secret !== "string") {
    redirect("/sign-in?oauth=failed");
  }

  await completeOAuthSignIn({ userId, secret });

  redirect("/");
};

export default OAuthCallback;
