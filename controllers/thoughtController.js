const { Thought, Reaction, User } = require("../models");

module.exports = {
  // Get All Thoughts
  async getAllThoughts(req, res) {
    try {
      const thoughts = await Thought.find();
      res.json(thoughts);
    } catch (err) {
      res.status(500).json({
        error: "Could Not Find Any Thoughts. Please Try Again",
      });
    }
  },

  // Get A Thought By ID
  async getThoughtById(req, res) {
    try {
      const thought = await Thought.findOne({
        _id: req.params.thoughtId,
      }).select("-__v");
      if (!thought) {
        return res.status(404).json({
          error: "Could Not Find A Thought With That ID. Please Try Again",
        });
      }
      res.json(thought);
    } catch (err) {
      console.error(err);
      res.status(500).json(err);
    }
  },

  // Create Thought
  async createThought(req, res) {
    try {
      const thought = await Thought.create(req.body);
      const userId = req.body.userId;
      const user = await User.findById(userId);
      if (!user) {
        return res.status(404).json({
          error: "Could Not Find This User. Please Try Again",
        });
      }
      user.thoughts.push(thought._id);
      await user.save();
      res.json(thought);
    } catch (err) {
      console.log(err);
      return res.status(500).json(err);
    }
  },
  // Delete Thought
  async deleteThought(req, res) {
    try {
      const thought = await Thought.findByIdAndDelete(req.params.thoughtId);

      if (!thought) {
        return res.status(404).json({
          error: "Could Not Find A Thought With That ID. Please Try Again",
        });
      }
      res.json({ message: "Successfully Deleted Thought" });
    } catch (err) {
      res.status(500).json(err);
    }
  },

  // Update Thought
  async updateThought(req, res) {
    try {
      const thought = await Thought.findByIdAndUpdate(
        { _id: req.params.thoughtId },
        { $set: req.body },
        { runValidators: true, new: true }
      );
      if (!thought) {
        return res.status(404).json({
          error: "Could Not Find A Thought With That ID. Please Try Again",
        });
      }
      res.json(thought);
    } catch (err) {
      console.error(err);
      res.status(500).json(err);
    }
  },

  // Create Reaction
  async createReaction(req, res) {
    try {
      const thought = await Thought.findOneAndUpdate(
        { _id: req.params.thoughtId },
        { $addToSet: { reactions: req.body } },
        { new: true }
      );
      if (!thought) {
        return res.status(404).json({
          error: "Could Not Find A Thought With That ID. Please Try Again",
        });
      }
      res.json(thought);
    } catch (err) {
      res.status(500).json(err);
    }
  },

  // Delete Reaction
  async deleteReaction(req, res) {
    try {
      const thought = await Thought.findOneAndUpdate(
        { _id: req.params.thoughtId },
        { $pull: { reactions: { reactionId: req.params.reactionId } } },
        { new: true }
      );
      if (!thought) {
        return res
          .status(404)
          .json({
            message: "Could Not Find A Reaction With That ID. Please Try Again",
          });
      }
      res.json(thought);
    } catch (err) {
      res.status(500).json(err);
    }
  },
};
