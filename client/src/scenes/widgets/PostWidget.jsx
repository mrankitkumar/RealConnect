import {
  ChatBubbleOutlineOutlined,
  FavoriteBorderOutlined,
  FavoriteOutlined,
  AddHomeWorkOutlined,
  ShareOutlined,
  ThumbUpOutlined,
  ThumbDownOutlined,
  DeleteOutline, // Import the delete icon
} from "@mui/icons-material";
import { Box, Divider, IconButton, Typography, useTheme } from "@mui/material";
import FlexBetween from "components/FlexBetween";
import Friend from "components/Friend";
import WidgetWrapper from "components/WidgetWrapper";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import { setPost } from "state";


const PostWidget = ({
  postId,
  postUserId,
  name,
  description,
  location,
  picturePath,
  userPicturePath,
  likes,
  dislikes,
  comments,
}) => {
  const [isComments, setIsComments] = useState(false);
  const [isDeleteClicked, setIsDeleteClicked] = useState(false); 
  const dispatch = useDispatch();
  const token = useSelector((state) => state.token);
  const loggedInUserId = useSelector((state) => state.user._id);
  const isAdmin = (loggedInUserId=="662f9ad93498965020d94bd8")?true:false;
  const isLiked = Boolean(likes[loggedInUserId]);
  const likeCount = Object.keys(likes).length;

  const isDisliked = Boolean(dislikes[loggedInUserId]);
  const dislikeCount = Object.keys(dislikes).length;

  const { palette } = useTheme();
  const main = palette.neutral.main;
  const primary = palette.primary.main;

  const patchLike = async () => {
    const response = await fetch(`http://localhost:3001/posts/${postId}/like`, {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ userId: loggedInUserId }),
    });
    const updatedPost = await response.json();
    dispatch(setPost({ post: updatedPost }));
  };

  const patchDislike = async () => {
    const response = await fetch(`http://localhost:3001/posts/${postId}/dislike`, {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ userId: loggedInUserId }),
    });
    const updatedPost = await response.json();
    dispatch(setPost({ post: updatedPost }));
  };

  const deletePost = async () => {
    const response = await fetch(`http://localhost:3001/posts/${postId}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    if (response.ok) {
      const updatedPost = await response.json();
    dispatch(setPost({ post: updatedPost }));
    window.location.reload();
      console.log("Post deleted successfully");
    } else {
      console.error("Failed to delete post");
    }

  };

  const handleLike = () => {
    if (isLiked && !isDisliked) {
      // Already liked, do nothing
    } else if (!isLiked && !isDisliked) {
      patchLike(); // Like the post
    } else if (!isLiked && isDisliked) {
      patchLike(); // Like the post and remove dislike
      patchDislike();
    } else if (isLiked && isDisliked) {
      patchDislike(); // Remove dislike
    }
  };

  const handleDislike = () => {
    if (!isLiked && isDisliked) {
      // Already disliked, do nothing
    } else if (!isLiked && !isDisliked) {
      patchDislike(); // Dislike the post
    } else if (isLiked && !isDisliked) {
      patchDislike(); // Dislike the post and remove like
      patchLike();
    } else if (isLiked && isDisliked) {
      patchLike(); // Remove like
    }
  };

  return (
    <WidgetWrapper m="2rem 0">
      <Friend
        friendId={postUserId}
        name={name}
        subtitle={location}
        userPicturePath={userPicturePath}
      />
      <Typography color={main} sx={{ mt: "1rem" }}>
        {description}
      </Typography>
      {picturePath && (
        <img
          width="100%"
          height="auto"
          src={`http://localhost:3001/assets/${picturePath}`}
          alt="post"
          style={{ borderRadius: "0.75rem", marginTop: "0.75rem" }}
        />
      )}
      <FlexBetween mt="0.25rem">
        <FlexBetween gap="1rem">
          <FlexBetween gap="0.3rem">
            <IconButton onClick={handleLike}>
              {isLiked ? (
                <ThumbUpOutlined sx={{ color: primary }} />
              ) : (
                <ThumbUpOutlined />
              )}
            </IconButton>
            <Typography>{likeCount}</Typography>
          </FlexBetween>
          <FlexBetween gap="0.3rem">
            <IconButton onClick={handleDislike}>
              {isDisliked ? (
                <ThumbDownOutlined sx={{ color: primary }} />
              ) : (
                <ThumbDownOutlined />
              )}
            </IconButton>
            <Typography>{dislikeCount}</Typography>
          </FlexBetween>

          <FlexBetween gap="0.3rem">
            <IconButton onClick={() => setIsComments(!isComments)}>
              <ChatBubbleOutlineOutlined />
            </IconButton>
            <Typography>{comments.length}</Typography>
          </FlexBetween>
        </FlexBetween>
        
      <IconButton onClick={deletePost} onMouseDown={() => setIsDeleteClicked(true)} onMouseUp={() => setIsDeleteClicked(false)}>
        {isAdmin? ( 
          <DeleteOutline sx={{ color: isDeleteClicked ? 'red' : 'inherit' }} />
        ):(
          <abc/>
        )
        } {/* Change color when clicked */}
      </IconButton>
      </FlexBetween>
      {isComments && (
        <Box mt="0.5rem">
          {comments.map((comment, i) => (
            <Box key={`${name}-${i}`}>
              <Divider />
              <Typography sx={{ color: main, m: "0.5rem 0", pl: "1rem" }}>
                {comment}
              </Typography>
            </Box>
          ))}
          <Divider />
        </Box>
      )}
    </WidgetWrapper>
  );
};

export default PostWidget;
