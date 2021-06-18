import React, { useEffect, useRef, useCallback, useState } from "react";

function Body() {
  const [update, setUpdate] = useState(1);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [nextPage, setNextPage] = useState("");

  useEffect(() => {
    setLoading(true);
    fetch("https://www.reddit.com/r/aww.json?limit=25" + nextPage)
      .then((response) => response.json())
      .then((data) => {
        setPosts((prevPosts) => {
          return [...prevPosts, ...data.data.children];
        });
        setNextPage("&&after=" + data.data.after);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  }, [update]);

  const observer = useRef();
  const lastObj = useCallback(
    (node) => {
      if (loading) return;
      if (observer.current) observer.current.disconnect();
      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting) {
          setUpdate((prev) => {
            return prev + 1;
          });
        }
      });
      if (node) observer.current.observe(node);
    },
    [loading]
  );

  console.log(posts);
  console.log(nextPage);
  console.log(update);
  return (
    <div>
      {posts?.map((post, ind) => {
        const {
          title,
          author,
          id,
          thumbnail,
          subreddit_name_prefixed,
          crosspost_parent_list,
          url,
        } = post.data;
        let currentCrosspostParent = crosspost_parent_list;
        // if (currentCrosspostParent) {
        //   debugger;
        // }
        while (currentCrosspostParent?.crosspost_parent_list) {
          currentCrosspostParent =
            currentCrosspostParent[0].currentCrosspostParent;
        }
        let originalSubreddit = currentCrosspostParent
          ? currentCrosspostParent[0].subreddit_name_prefixed
          : subreddit_name_prefixed;
        if (posts.length === ind + 1) {
          return (
            <div ref={lastObj} key={id}>
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
        } else {
          return (
            <div key={id}>
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
      })}
      <div>{loading && "loading..."}</div>
    </div>
  );
}

export default Body;
