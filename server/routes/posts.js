import express from "express";
import { getFeedPosts, getUserPosts, likePost , dislikePost,deletePost} from "../controllers/posts.js";
import { verifyToken } from "../middleware/auth.js";

const router = express.Router();

/* READ */
router.get("/", verifyToken, getFeedPosts);
router.get("/:userId/posts", verifyToken, getUserPosts);

/* UPDATE */
router.patch("/:id/like", verifyToken, likePost);

router.patch("/:id/dislike", verifyToken, dislikePost);

// Example route definition


router.delete('/:postId',verifyToken,deletePost);


export default router;
