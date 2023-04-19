const mongoose = require("mongoose");

const TweetSchema = new mongoose.Schema({
  text: {
    type: String,
    maxlength: 480,
  },
  likes: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  ],
  retweets: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  ],
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
});

TweetSchema.pre("remove", async function (next) {
  await this.model("Comment").deleteMany({ tweet: this._id });
  next();
});

module.exports = mongoose.model("Tweet", TweetSchema);
