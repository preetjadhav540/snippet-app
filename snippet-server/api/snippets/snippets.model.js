const mongoose = require("mongoose");

const SnippetSchema = new mongoose.Schema(
  {
    title: String,
    code_snippet: String,
    programming_language: String,
    created: {
      type: Date,
      default: Date.now,
    },
    user_id: { type: mongoose.Schema.Types.ObjectId, ref: "Users" },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

SnippetSchema.virtual("bookmarks", {
  ref: "Bookmarks",
  localField: "_id",
  foreignField: "snippet_id",
});

SnippetSchema.post("findOneAndDelete", async function (doc) {
  
  const Bookmark = mongoose.model("Bookmarks");
  try {
    await Bookmark.deleteMany({ snippet_id: { $in: doc._id } });
    console.log("Successfully deleted associated bookmark from snippet");
  } catch (error) {
    console.log("Error deleting associated bookmark from snippet");
  }
});

const Snippets = mongoose.model("Snippets", SnippetSchema);
module.exports = Snippets;
