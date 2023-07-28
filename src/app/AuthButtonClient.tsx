"use client";

import {
  Session,
  createClientComponentClient,
} from "@supabase/auth-helpers-nextjs";
import { useRouter } from "next/navigation";
import React from "react";

type AuthButtonProps = {
  session: Session | null;
};

const AuthButtonClient = ({ session }: AuthButtonProps) => {
  const supabase = createClientComponentClient<Database>({});
  const router = useRouter();

  const handleSignIn = async () => {
    await supabase.auth.signInWithOAuth({
      provider: "github",
      options: {
        redirectTo: "http://localhost:3000/auth/callback",
      },
    });
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.refresh();
  };

  if (session) {
    return <button onClick={handleSignOut}>Logout</button>;
  }

  return <button onClick={handleSignIn}>Login</button>;
};

export default AuthButtonClient;
