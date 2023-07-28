"use client";

import React, { useEffect } from "react";
import Likes from "~/app/Likes";

import { experimental_useOptimistic as useOptimistic } from "react";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { useRouter } from "next/navigation";

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
        <div key={tweet.id}>
          <p>
            {tweet.author.name} {tweet.author.username}
          </p>
          <p>{tweet.title}</p>
          <Likes tweet={tweet} addOptimisticTweet={addOptimisticTweet} />
        </div>
      ))}
    </>
  );
};

export default Tweets;
