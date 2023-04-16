const { ObjectId } = require('mongoose').Types;
const { User, Thought } = require('../models');

module.exports = {
  // Get all users
  async getUsers(req, res) {
    try {
      const users = await User.find();
      res.json({ users });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Server error' });
    }
  },

  // Get a single user by ID
  async getUserById(req, res) {
    try {
      const user = await User.findById(req.params.userId).lean();
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }
      res.json({ user });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Server error' });
    }
  },

  // Create a new user
  async createUser(req, res) {
    try {
      const user = await User.create(req.body);
      res.status(201).json({ user });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Server error' });
    }
  },

  // Update a user by ID
  async updateUser(req, res) {
    try {
      const { newUsername, newEmail } = req.body;
      const user = await User.findByIdAndUpdate(
        req.params.userId,
        { username: newUsername, email: newEmail },
        { new: true }
      );
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }
      res.json({ user });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Server error' });
    }
  },

  // Delete a user and their thoughts
  async deleteUser(req, res) {
    try {
      const user = await User.findByIdAndDelete(req.params.userId);
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }
      const thoughts = await Thought.deleteMany({ user: req.params.userId });
      res.json({ message: 'User and their thoughts deleted successfully' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Server error' });
    }
  },

// Add A Friend 
  async addFriend(req, res) {
    try {
      const user = await User.findOneAndUpdate(
        { _id: req.params.userId },
        { $addToSet: { friends: req.params.friendId } },
        { new: true }
      )
      if (!user) {
       res.response(404).json({ error: 'User not found' })
       return
      }
      res.status(200).json({ user, message: 'Congratulations, you have added a friend!' })
      } catch (error) {
     res.status(500).json(error)
  }
},

// Delete A Friend
  async deleteFriend(req, res) {
    try {
      const user = await User.findOneAndUpdate(
        { _id: req.params.userId },
        { $pull: { friends: req.params.friendId } },
        { new: true }
      )
      if (!user) {
       res.response(404).json({ error: 'User not found' })
       return
      }
      res.status(200).json({ user, message: 'You have deleted a friend!' })
      } catch (error) {
     res.status(500).json(error)
  }
}
};

