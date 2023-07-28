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
        redirectTo: `${location.origin}/auth/callback`,
      },
    });
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.refresh();
  };

  if (session) {
    return (
      <button className="text-xs text-gray-400" onClick={handleSignOut}>
        Logout
      </button>
    );
  }

  return (
    <button className="text-xs text-gray-400" onClick={handleSignIn}>
      Login
    </button>
  );
};

export default AuthButtonClient;
