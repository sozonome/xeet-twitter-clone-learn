import { createServerActionClient } from "@supabase/auth-helpers-nextjs";
import React from "react";
import { cookies } from "next/headers";

const NewTweet = () => {
  const addTweet = async (formData: FormData) => {
    "use server";
    const title = String(formData.get("title"));

    const supabase = createServerActionClient<Database>({
      cookies,
    });
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (user) {
      await supabase.from("tweets").insert({ title, user_id: user.id });
      
    }
  };

  return (
    <form action={addTweet}>
      <input name="title" className="bg-inherit" />
    </form>
  );
};

export default NewTweet;
