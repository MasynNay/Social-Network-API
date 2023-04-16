const router = require('express').Router();

const {
  getAllThoughts,
  getThoughtById,
  createThought,
  updateThought,
  deleteThought,
  createReaction,
  deleteReaction
} = require('../../controllers/thoughtController');

// GET & POST at /api/thoughts
router.route('/').get(getAllThoughts).post(createThought);

// GET, PUT, & DELETE at /api/thoughts/:id
router
  .route("/:id")
  .get(getThoughtById)
  .put(updateThought)
  .delete(deleteThought);

// New Reaction Route
router.route("/:thoughtId/reactions").post(createReaction);

// Delete Reaction Route
router.route("/:thoughtId/reactions/:reactionId").delete(deleteReaction);

module.exports = router;