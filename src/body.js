import React, { Component, useRef, useCallback } from "react";

class Body extends Component {
  state = { posts: [], loading: false, Page: 1 };

  // const observer = useRef();
  // const lastObj = useCallback(node =>{
  //   if(this.loading) return
  //   if (observer.current) this.observer.current.disconnect()
  //   observer.current= new IntersectionObserver(entries => {
  //     if (entries[0].isIntersecting) {
  //       this.setState({
  //         page = this.page + 1
  //       })
  //     }
  //   })
  //   if(node)observer.current.observe(node)
  // },[this.loading])

  componentDidMount() {
    fetch("https://www.reddit.com/r/aww.json?limit=25")
      .then((response) => response.json())
      .then((data) => {
        this.setState({
          posts: data.data.children,
        });
        console.log(this.state);
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  }
  render() {
    const { posts = [] } = this.state;
    return (
      <div>
        {posts?.map((post) => {
          const {
            title,
            author,
            id,
            thumbnail,
            subreddit_name_prefixed,
            crosspost_parent_list,
          } = post.data;
          let currentCrosspostParent = crosspost_parent_list;
          while (currentCrosspostParent?.crosspost_parent_list) {
            // originalSubreddit = currentCrosspostParent.subreddit_name_prefixed;
            currentCrosspostParent =
              currentCrosspostParent.currentCrosspostParent;
          }
          let originalSubreddit = currentCrosspostParent
            ? currentCrosspostParent.subreddit_name_prefixed
            : subreddit_name_prefixed;
          return (
            <div key={id}>
              Posted by {author}
              <br />
              {originalSubreddit}
              <br />
              {title}
              <br />
              {thumbnail && thumbnail !== "default" && <img src={thumbnail} />}
            </div>
          );
        })}
      </div>
    );
  }
}

export default Body;
