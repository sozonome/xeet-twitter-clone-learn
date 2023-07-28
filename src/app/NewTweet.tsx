import { User, createServerActionClient } from "@supabase/auth-helpers-nextjs";
import React from "react";
import { cookies } from "next/headers";
import Image from "next/image";

type NewTweetProps = {
  user: User;
};

const NewTweet = ({ user }: NewTweetProps) => {
  const addTweet = async (formData: FormData) => {
    "use server";
    const title = String(formData.get("title"));

    const supabase = createServerActionClient<Database>({
      cookies,
    });
    await supabase.from("tweets").insert({ title, user_id: user.id });
  };

  return (
    <form action={addTweet} className="border border-gray-800 border-t-0">
      <div className="flex py-8 px-4">
        <div className="h-12 w-12">
          <Image
            alt="user avatar"
            src={user.user_metadata.avatar_url}
            width={48}
            height={48}
            className="rounded-full"
          />
        </div>
        <input
          name="title"
          className="bg-inherit flex-1 ml-2 text-2xl leading-loose placeholder-gray-500 px-2"
          placeholder="What's up?!"
        />
      </div>
    </form>
  );
};

export default NewTweet;
