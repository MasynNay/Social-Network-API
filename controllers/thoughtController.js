const { Thought, Reaction } = require("../models");

module.exports = {
  // Get All Thoughts
  async getAllThoughts(req, res) {
    try {
      const thoughts = await Thought.find();
      res.json(thoughts);
    } catch (err) {
      res.status(500).json({
        error: "Could not find any thoughts. Please try again",
      });
    }
  },

  // Get A Thought By ID
  async getThoughtById(req, res) {
    try {
      const thought = await Thought.findById(req.params.thoughtId).select(
        "-__v"
      );
      if (!thought) {
        return res.status(404).json({
          error: "Could not find a thought with that ID. Please try again",
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
      res.json(thought);
    } catch (err) {
      console.error(err);
      res.status(500).json(err);
    }
  },

  // Delete Thought
  async deleteThought(req, res) {
    try {
      const thought = await Thought.findByIdAndDelete(req.params.thoughtId);

      if (!thought) {
        return res.status(404).json({
          error: "Could not find a thought with that ID. Please try again",
        });
      }

      await Reaction.deleteMany({ _id: { $in: thought.reactions } });
      res.json({ message: "Thought and Reactions have been deleted" });
    } catch (err) {
      console.error(err);
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
          error: "Could not find a thought with that ID. Please try again",
        });
      }
      res.json(thought);
    } catch (err) {
      console.error(err);
      res.status(500).json(err);
    }
  },

  // Create a new reaction for a thought
  async createReaction(req, res) {
    try {
      const { thoughtId } = req.params;
      const { reactionBody } = req.body;
      const thought = await Thought.findById(thoughtId);
      if (!thought) {
        return res.status(404).json({
          error: "Could not find a thought with that ID. Please try again",
        });
      }
      thought.reactions.push({ reactionBody });
      await thought.save();
      res.json(thought);
    } catch (err) {
      res.status(500).json(err);
    }
  },

  // Delete A Reaction By ID From A Thought ID
  async deleteReaction(req, res) {
    try {
      const { thoughtId, reactionId } = req.params;
      const thought = await Thought.findById(thoughtId);
      if (!thought) {
        return res.status(404).json({
          error: "Could not find a thought with that ID. Please try again",
        });
      }
      const reactionIndex = thought.reactions.findIndex(
        (reaction) => reaction.id === reactionId
      );
      if (reactionIndex === -1) {
        return res.status(404).json({ error: "Could not find this reaction. Please try again" });
      }
      thought.reactions.splice(reactionIndex, 1);
      await thought.save();
      res.json(thought);
    } catch (err) {
      res.status(500).json;
    }
  },
};
