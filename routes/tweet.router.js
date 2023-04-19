const router = require("express").Router();

const {
  createTweet,
  getTweets,
  getTweet,
  deleteTweet,
  likeTweet,
  retweetTweet,
  createComment,
  deleteComment,
  likeComment,
} = require("../controllers/tweet.controller");

const { protect } = require("../middlewares/auth");

router.route("/").get(getTweets).post(protect, createTweet);
router.route("/:id").get(getTweet).delete(protect, deleteTweet);
router.put("/:id/like", protect, likeTweet);
router.put("/:id/retweet", protect, retweetTweet);
router.post("/:id/comment", protect, createComment);
router
  .route("/:id/comment/:commentId")
  .delete(protect, deleteComment)
  .put(protect, likeComment);

module.exports = router;
