const express = require('express');
const router = express.Router();
const posts = require('../data/posts');
const postController = require('../controllers/postController');

// INDEX
router.get('/', postController.index);

// SHOW
router.get('/:id', postController.show);

// STORE
router.post('/', postController.store);


// UPDATE
router.put('/:id', postController.update);

// MODIFY
router.patch('/:id', postController.modify);

// DESTROY
router.delete('/:id', postController.destroy);

module.exports = router;