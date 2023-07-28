"use client";

import React, { useEffect } from "react";
import Likes from "~/app/Likes";

import { experimental_useOptimistic as useOptimistic } from "react";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { useRouter } from "next/navigation";
import Image from "next/image";

type TweetsProps = {
  tweets: Array<TweetWithAuthor>;
};

const Tweets = ({ tweets }: TweetsProps) => {
  const [optimisticTweets, addOptimisticTweet] = useOptimistic<
    Array<TweetWithAuthor>,
    TweetWithAuthor
  >(tweets, (currentOptimisticTweet, newTweet) => {
    const newOptimisticTweets = [...currentOptimisticTweet];
    const index = newOptimisticTweets.findIndex(
      (tweet) => tweet.id === newTweet.id
    );
    newOptimisticTweets[index] = newTweet;
    return newOptimisticTweets;
  });

  const router = useRouter();

  const supabase = createClientComponentClient();

  useEffect(() => {
    const channel = supabase
      .channel("realtime tweets")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "tweets" },
        (payload) => {
          router.refresh();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [router, supabase]);

  return (
    <>
      {optimisticTweets?.map((tweet) => (
        <div
          key={tweet.id}
          className="border border-gray-800 border-t-0 px-4 py-8 flex gap-2"
        >
          <div className="h-12 w-12">
            <Image
              className="rounded-full"
              src={tweet.author.avatar_url}
              alt="tweet user avatar"
              width={48}
              height={48}
            />
          </div>
          <div className="">
            <p>
              <span className="font-bold">{tweet.author.name}</span>
              <span className="text-sm ml-2 text-gray-400">
                {tweet.author.username}
              </span>
            </p>
            <p>{tweet.title}</p>
            <Likes tweet={tweet} addOptimisticTweet={addOptimisticTweet} />
          </div>
        </div>
      ))}
    </>
  );
};

export default Tweets;
