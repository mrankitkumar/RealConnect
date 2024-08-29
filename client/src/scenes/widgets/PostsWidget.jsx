import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setPosts } from "state";
import PostWidget from "./PostWidget";

const PostsWidget = ({ userId, isProfile = false }) => {
  const dispatch = useDispatch();
  const posts = useSelector((state) => state.posts);
  const token = useSelector((state) => state.token);

  
  const getPosts = async () => {
    try {
      const response = await fetch("http://localhost:3001/posts", {
        method: "GET",
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await response.json();
      
      // Perform operations on each post
      const postsWithOperations = data.map(post => {
        // Calculate number of likes and dislikes
        const likesCount = Object.values(post.likes || {}).filter(like => like).length+1;
        const dislikesCount = Object.values(post.dislikes || {}).filter(dislike => dislike).length+1;
  
       // Calculate sum of likes and dislikes
      const sum = likesCount + dislikesCount;

      // Update post object with sum
      return { ...post, sum };
    });

    // Sort posts based on sum in descending order
    // If sums are equal, sort by likes count
    postsWithOperations.sort((a, b) => {
      if (b.sum !== a.sum) {
        return b.sum - a.sum; // Higher sum first
      } else {
        return Object.values(b.likes || {}).filter(like => like).length - Object.values(a.likes || {}).filter(like => like).length;
      }
    });
  
      dispatch(setPosts({ posts: postsWithOperations }));
    } catch (error) {
      console.error("Error fetching posts:", error);
    }
  };
  

  const getUserPosts = async () => {
    const response = await fetch(
      `http://localhost:3001/posts/${userId}/posts`,
      {
        method: "GET",
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    const data = await response.json();
    dispatch(setPosts({ posts: data }));
  };

  useEffect(() => {
    if (isProfile) {
      getUserPosts();
    } else {
      getPosts();
    }
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <>
      {posts.map(
        ({
          _id,
          userId,
          firstName,
          lastName,
          description,
          location,
          picturePath,
          userPicturePath,
          likes,
          dislikes,
          comments,
        }) => (
          <PostWidget
            key={_id}
            postId={_id}
            postUserId={userId}
            name={`${firstName} ${lastName}`}
            description={description}
            location={location}
            picturePath={picturePath}
            userPicturePath={userPicturePath}
            likes={likes}
            dislikes={dislikes}
            comments={comments}
          />
        )
      )}
    </>
  );
};

export default PostsWidget;
