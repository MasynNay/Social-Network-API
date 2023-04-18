const { ObjectId } = require("mongoose").Types;
const { User, Thought } = require("../models");

module.exports = {
  // Get all users
  async getUsers(req, res) {
    try {
      const users = await User.find();
      res.json({ users });
    } catch (error) {
      console.error(error);
      return res.status(500).json(err);
    }
  },

  // Get a single user by ID
  async getUserById(req, res) {
    try {
      const user = await User.findOne({ _id: req.params.userId })
        .select("-__v")
        .lean();
      if (!user) {
        return res
          .status(404)
          .json({
            message: "Could Not Find A User With That ID. Please Try Again",
          });
      }
      res.json({
        user,
      });
    } catch (err) {
      console.log(err);
      return res.status(500).json(err);
    }
  },

  // Create a new user
  async createUser(req, res) {
    try {
      const user = await User.create(req.body);
      res.status(201).json({ user });
    } catch (error) {
      console.error(error);
      return res.status(500).json(err);
    }
  },

  // Update a user by ID
  async updateUser(req, res) {
    try {
      const newUsername = req.body.username;
      const newEmail = req.body.email;
      const user = await User.findOneAndUpdate(
        { _id: req.params.userId },
        { username: newUsername, email: newEmail },
        { new: true }
      );
      if (!user) {
        return res
          .status(404)
          .json({
            error: "Could Not Find A User With That ID. Please Try Again",
          });
      }
      res.json({ user });
    } catch (error) {
      console.error(error);
      return res.status(500).json(err);
    }
  },

  // Delete a user and their thoughts
  async deleteUser(req, res) {
    try {
      const user = await User.findByIdAndDelete(req.params.userId);
      if (!user) {
        return res
          .status(404)
          .json({ error: "Could Not Find This User. Please Try Again" });
      }
      const thoughts = await Thought.deleteMany({ user: req.params.userId });
      res.json({
        message: "Successfully Deleted This User And Their Thoughts",
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json(err);
    }
  },

  // Add A Friend
  async addFriend(req, res) {
    try {
      const user = await User.findOneAndUpdate(
        { _id: req.params.userId },
        { $addToSet: { friends: req.params.friendId } },
        { new: true }
      );
      if (!user) {
        res
          .response(404)
          .json({ error: "Could Not Find This User. Please Try Again" });
        return;
      }
      res.status(200).json({ user, message: "Successfully Added A Friend" });
    } catch (error) {
      res.status(500).json(error);
    }
  },

  // Delete A Friend
  async deleteFriend(req, res) {
    try {
      const user = await User.findOneAndUpdate(
        { _id: req.params.userId },
        { $pull: { friends: req.params.friendId } },
        { new: true }
      );
      if (!user) {
        res
          .response(404)
          .json({ error: "Could Not Find This User. Please Try Again" });
        return;
      }
      res.status(200).json({ user, message: "Successfully Deleted A Friend" });
    } catch (error) {
      res.status(500).json(error);
    }
  },
};
