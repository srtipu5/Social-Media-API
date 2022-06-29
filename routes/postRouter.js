const router = require("express").Router();
const Post = require("../models/postModel.js");
const User = require("../models/userModel.js");

// post create
router.post("/", async (req, res) => {
  const newPost = new Post(req.body);
  try {
    const post = await newPost.save();
    res.status(200).json({
      data: post,
      message: "New post has been successfully created.",
    });
  } catch (err) {
    res.status(500).json(err);
  }
});

// post update
router.put("/:id", async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (post.userId === req.body.userId) {
      const updatePost = await post.updateOne({ $set: req.body });
      res.status(200).json({
        data: updatePost,
        message: "Post has been successfully updated.",
      });
    } else {
      res.status(403).json("You can only update your own post.");
    }
  } catch (err) {
    res.status(500).json(err);
  }
});

// post delete
router.delete("/:id", async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (post.userId === req.body.userId) {
      const deletePost = await post.deleteOne();
      res.status(200).json({
        data: deletePost,
        message: "Post has been successfully deleted.",
      });
    } else {
      res.status(403).json("You can only delete your own post.");
    }
  } catch (err) {
    res.status(500).json(err);
  }
});

// get a single post
router.get("/:id", async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (post) {
      res.status(200).json({
        data: post,
        message: "Post has been successfully found.",
      });
    } else {
      res.status(404).json("Post has been not found.");
    }
  } catch (err) {
    res.status(500).json(err);
  }
});

// like or dislike a post
router.delete("/:id/like", async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    // user not like post yet
    if (!post.likes.includes(req.body.userId)) {
      await post.updateOne({ $push: { likes: req.body.userId } });
      res.status(200).json("The post has been successfully liked.");
    } else {
      await post.updateOne({ $pull: { likes: req.body.userId } });
      res.status(200).json("The post has been successfully disliked.");
    }
  } catch (err) {
    res.status(500).json(err);
  }
});

// get user all timeline post
router.get("/timeline/:userId", async (req, res) => {
  try {
    const postsArray = [];
    // check user
    const user = await User.findById(req.params.userId);
    if (user) {
      // user own posts
      const userPosts = await Post.find({ userId: user._id });
      // user friends or following person posts
      const friendsPosts = await Promise.all(
        user.followings.map((friendId) => {
          return Post.find({ userId: friendId });
        })
      );
      // all post togeather
      postsArray = [...userPosts, ...friendsPosts];

      // pass response based on posts
      if (postsArray.length > 0) {
        res.status(200).json(postsArray);
      } else {
        res.status(404).json("There have no posts !!");
      }
    } else {
      res.status(404).json("User not found !!");
    }
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;
