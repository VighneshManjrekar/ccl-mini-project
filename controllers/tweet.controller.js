const asyncHandler = require("../utils/asyncHandler");
const ErrorResponse = require("../utils/ErrorResponse");
const Tweet = require("../models/Tweet");
const Comment = require("../models/Comment");

// @desc    Create tweet
// @route   POST api/v1/tweet
// @access  Private
exports.createTweet = asyncHandler(async (req, res, next) => {
  const { text } = req.body;
  const tweet = await Tweet.create({
    text,
    owner: req.user._id,
  });
  res.status(201).json({ success: true, data: tweet });
});

// @desc    Get all tweets
// @route   GET api/v1/tweet
// @access  Private
exports.getTweets = asyncHandler(async (req, res, next) => {
  const tweets = await Tweet.find().populate("owner", "name profile");
  res.status(200).json({ success: true, data: tweets });
});

// @desc    Get single tweet
// @route   GET api/v1/tweet/:id
// @access  Private
exports.getTweet = asyncHandler(async (req, res, next) => {
  const tweet = await Tweet.findById(req.params.id).populate(
    "owner",
    "name profile"
  );
  if (!tweet) {
    return next(new ErrorResponse("Tweet not found", 404));
  }
  const cmnts = await Comment.find({ tweet: req.params.id }).populate(
    "owner",
    "name profile"
  );
  res.status(200).json({ success: true, data: tweet, cmnts });
});

// @desc    delete tweet
// @route   DELETE api/v1/tweet/:id
// @access  Private
exports.deleteTweet = asyncHandler(async (req, res, next) => {
  const tweet = await Tweet.findById(req.params.id);
  if (!tweet) {
    return next(new ErrorResponse("Tweet not found", 404));
  }
  if (tweet.owner.toString() !== req.user._id.toString()) {
    return next(new ErrorResponse("Not authorized", 401));
  }
  await tweet.remove();
  res.status(200).json({ success: true, data: {} });
});

// @desc    Like tweet
// @route   PUT api/v1/tweet/:id/like
// @access  Private
exports.likeTweet = asyncHandler(async (req, res, next) => {
  const tweet = await Tweet.findById(req.params.id);
  if (!tweet) {
    return next(new ErrorResponse("Tweet not found", 404));
  }
  if (tweet.likes.includes(req.user._id)) {
    // if already liked, unlike it
    tweet.likes = tweet.likes.filter(
      (id) => id.toString() !== req.user._id.toString()
    );
    const updatedTweet = await tweet.save();
    return res.status(200).json({ success: true, data: updatedTweet });
  }
  tweet.likes.push(req.user._id);
  const updatedTweet = await tweet.save();
  res.status(200).json({ success: true, data: updatedTweet });
});

// @desc    Retweet tweet
// @route   PUT api/v1/tweet/:id/retweet
// @access  Private
exports.retweetTweet = asyncHandler(async (req, res, next) => {
  const tweet = await Tweet.findById(req.params.id);
  if (!tweet) {
    return next(new ErrorResponse("Tweet not found", 404));
  }
  if (tweet.retweets.includes(req.user._id)) {
    // if already retweeted, unretweet it
    tweet.retweets = tweet.retweets.filter(
      (id) => id.toString() !== req.user._id.toString()
    );
    const updatedTweet = await tweet.save();
    return res.status(200).json({ success: true, data: updatedTweet });
  }
  tweet.retweets.push(req.user._id);
  const updatedTweet = await tweet.save();
  res.status(200).json({ success: true, data: updatedTweet });
});

// @desc    Create comment
// @route   POST api/v1/tweet/:id/comment
// @access  Private
exports.createComment = asyncHandler(async (req, res, next) => {
  const tweet = await Tweet.findById(req.params.id);
  if (!tweet) {
    return next(new ErrorResponse("Tweet not found", 404));
  }
  const { text } = req.body;
  const comment = await Comment.create({
    text,
    owner: req.user._id,
    tweet: req.params.id,
  });
  res.status(201).json({ success: true, data: comment });
});

// @desc    delete comment
// @route   DELETE api/v1/tweet/:id/comment/:commentId
// @access  Private
exports.deleteComment = asyncHandler(async (req, res, next) => {
  const tweet = await Tweet.findById(req.params.id);
  if (!tweet) {
    return next(new ErrorResponse("Tweet not found", 404));
  }
  const comment = await Comment.findById(req.params.commentId);
  if (!comment) {
    return next(new ErrorResponse("Comment not found", 404));
  }
  if (comment.owner.toString() !== req.user._id.toString()) {
    return next(
      new ErrorResponse("Only owner of the comment can delete the comment", 401)
    );
  }
  await Comment.findByIdAndDelete(req.params.commentId);
  res.status(200).json({ success: true, data: {} });
});

// @desc    Like comment
// @route   PUT api/v1/tweet/:id/comment/:commentId/like
// @access  Private
exports.likeComment = asyncHandler(async (req, res, next) => {
  const tweet = await Tweet.findById(req.params.id);
  if (!tweet) {
    return next(new ErrorResponse("Tweet not found", 404));
  }
  const comment = await Comment.findById(req.params.commentId);
  if (!comment) {
    return next(new ErrorResponse("Comment not found", 404));
  }
  if (comment.likes.includes(req.user._id)) {
    // if already liked, unlike it
    comment.likes = comment.likes.filter(
      (id) => id.toString() !== req.user._id.toString()
    );
    const updatedComment = await comment.save();
    return res.status(200).json({ success: true, data: updatedComment });
  }
  comment.likes.push(req.user._id);
  const updatedComment = await comment.save();
  res.status(200).json({ success: true, data: updatedComment });
});
