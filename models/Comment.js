// create mongoose comment schema for twitter clone
const mongoose = require("mongoose");

const CmntSchema = new mongoose.Schema({
  text: {
    type: String,
    maxlength: 300,
  },
  likes: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  ],
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  tweet: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Tweet",
  },
});

module.exports = mongoose.model("Comment", CmntSchema);
