import "./postCard.css";

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
    <div
      ref={lastObj}
      className={`post-card ${stickied ? "stickied" : "normal"}`}
      key={id}
    >
      <div>
        {thumbnail && thumbnail !== "default" && (
          <img alt={title} className="post-img" src={thumbnail} />
        )}
      </div>
      <div>
        <a
          className="post-title"
          href={`https://www.reddit.com/r/aww/comments/${id}/${title}`}
        >
          {title}
        </a>
        <p>Posted by {author}</p>
        <p>{originalSubreddit}</p>
      </div>
    </div>
  );
}

export default PostCard;
