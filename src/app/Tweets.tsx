"use client";

import React from "react";
import Likes from "~/app/Likes";

import { experimental_useOptimistic as useOptimistic } from "react";

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
