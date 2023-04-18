const asyncHandler = require("../utils/asyncHandler");
const ErrorResponse = require("../utils/ErrorResponse");
const Tweet = require("../models/Tweet");

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
  res.status(200).json({ success: true, data: tweet });
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
    return next(new ErrorResponse("Tweet already liked", 400));
  }
  tweet.likes.push(req.user._id);
  await tweet.save();
  res.status(200).json({ success: true, data: tweet });
});
