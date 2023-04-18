const router = require('express').Router();

const {
  getUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
  addFriend,
  deleteFriend
} = require('../../controllers/userController');

// GET & POST at api/users
router.route('/').get(getUsers).post(createUser);

// GET, PUT, & DELETE at api/users/:id
router.route('/:userId').get(getUserById).put(updateUser).delete(deleteUser);

// New Friend and Delete Friend Route
router.route('/:userId/friends/:friendId').post(addFriend).delete(deleteFriend);

module.exports = router;