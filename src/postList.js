import { useEffect, useRef, useCallback, useState } from "react";
import PostCard from "./postCard";

function PostList() {
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
          stickied,
        } = post.data;
        let currentCrosspostParent = crosspost_parent_list;
        while (currentCrosspostParent?.crosspost_parent_list) {
          currentCrosspostParent =
            currentCrosspostParent[0].currentCrosspostParent;
        }
        let originalSubreddit = currentCrosspostParent
          ? currentCrosspostParent[0].subreddit_name_prefixed
          : subreddit_name_prefixed;

        return (
          <PostCard
            key={id}
            lastObj={posts.length === ind + 1 ? lastObj : null}
            stickied={stickied}
            id={id}
            author={author}
            originalSubreddit={originalSubreddit}
            title={title}
            thumbnail={thumbnail}
          />
        );
      })}
      <div>{loading && "loading..."}</div>
    </div>
  );
}

export default PostList;
