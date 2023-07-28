import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import React from "react";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import GithubButton from "~/app/login/GithubButton";

export const dynamic = "force-dynamic";

const LoginPage = async () => {
  const supabase = createServerComponentClient<Database>({ cookies });
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (session) {
    redirect("/");
  }

  return (
    <div className="flex-1 flex justify-center items-center">
      <GithubButton />
    </div>
  );
};

export default LoginPage;
