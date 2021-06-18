import { useEffect, useRef, useCallback, useState } from "react";

function PostCard(props) {
  const {
    stickied,
    id,
    author,
    originalSubreddit,
    title,
    thumbnail,
    lastObj,
  } = props;

  return (
    <div ref={lastObj} className={stickied ? "stickied" : "normal"} key={id}>
      Posted by {author}
      <br />
      {originalSubreddit}
      <br />
      <a href={`https://www.reddit.com/r/aww/comments/${id}/${title}`}>
        {title}
      </a>
      <br />
      {thumbnail && thumbnail !== "default" && <img src={thumbnail} />}
    </div>
  );
}

export default PostCard;
