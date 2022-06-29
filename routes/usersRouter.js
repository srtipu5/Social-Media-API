const router = require("express").Router();
const User = require("../models/userModel.js");

// update user
router.put("/:id", async (req, res) => {
  if (req.body.userId === req.params.id || req.body.isAdmin) {
    try {
      if (req.body.password) {
        // password hash
        const salt = await bcrypt.genSalt(10);
        req.body.password = await bcrypt.hash(req.body.password, salt);
      }
      const user = await User.findByIdAndUpdate(req.params.id, {
        $set: req.body,
      });
      res.status(200).json({
        data: user,
        message: "User has been updated successfully.",
      });
    } catch (err) {
      res.status(500).json(err);
    }
  } else {
    res.status(403).json("You are only eligible to update your own account.");
  }
});

//delete user
router.delete("/:id", async (req, res) => {
  if (req.body.userId === req.params.id || req.body.isAdmin) {
    try {
      const user = await User.findByIdAndDelete(req.params.id);
      if (user) {
        res.status(200).json({
          data: user,
          message: "User has been deleted successfully.",
        });
      } else {
        res.status(404).json({
          message: "User not found.",
        });
      }
    } catch (err) {
      res.status(500).json(err);
    }
  } else {
    res.status(403).json("You are only eligible to delete your own account.");
  }
});

// get a single user
router.get("/:id", async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (user) {
      res.status(200).json({
        data: user,
        message: "User has been found successfully.",
      });
    } else {
      res.status(404).json({
        message: "User not found.",
      });
    }
  } catch (err) {
    res.status(500).json(err);
  }
});

// follow a user
router.put("/:id/follow", async (req, res) => {
  // check main user and search users are same or not
  if (req.body.userId !== req.params.id) {
    try {
      // main user details
      const currentUser = await User.findById(req.body.userId);
      // search user details
      const user = await User.findById(req.params.id);
      // not a follower
      if (!user.followers.includes(req.body.userId)) {
        await user.updateOne({ $push: { followers: req.body.userId } });
        await currentUser.updateOne({ $push: { followings: req.params.id } });
        res.status(200).json("You have been successfully followed this user.");
      } else {
        // already follower
        res.status(403).json("Already you followed this user.");
      }
    } catch (err) {}
  } else {
    res.status(403).json("You can not follow yourself.");
  }
});

// unfollow a user
router.put("/:id/unfollow", async (req, res) => {
    // check main user and search users are same or not
    if (req.body.userId !== req.params.id) {
      try {
        // main user details
        const currentUser = await User.findById(req.body.userId);
        // search user details
        const user = await User.findById(req.params.id);
        // if following
        if (user.followers.includes(req.body.userId)) {
          await user.updateOne({ $pull: { followers: req.body.userId } });
          await currentUser.updateOne({ $pull: { followings: req.params.id } });
          res.status(200).json("You have been successfully unfollowed this user.");
        } else {
          // not following
          res.status(403).json("You are not following this user.So you can not unfoolow this user.");
        }
      } catch (err) {}
    } else {
      res.status(403).json("You can not unfollow yourself.");
    }
  });

module.exports = router;
