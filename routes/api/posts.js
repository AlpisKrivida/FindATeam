const express = require('express')
const { check, validationResult } = require('express-validator')
const auth = require('../../middleware/auth')
const Comment = require('./comment')
const Post = require('../../modules/Posts')
const User = require('../../modules/User')

const router = express.Router()

// @route    post api/categories/:categoryid/posts
// @dec      create new post
// @acces    private user
router.post(
  '/:categoryid/posts',
  [
    auth,
    [
      check('text', 'Text is required')
        .not()
        .isEmpty()
    ]
  ],
  async (req, res) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() })
    }
    try {
      const user = await User.findById(req.user.id).select('-password')
      const category = await Post.findById(req.params.categoryid)
      if (!category) {
        return res.status(404).json({ msg: 'Category does not exist' })
      }

      const newPost = {
        text: req.body.text,
        name: user.name,
        avatar: user.avatar,
        user: req.user.id
      }

      category.posts.unshift(newPost)

      await category.save()

      res.json(category)
    } catch (err) {
      res.status(500).send('server error')
    }
  }
)

// @route    get api/categories/:categoryid/posts
// @dec      get all posts from category
// @acces    public
router.get('/:categoryid/posts', async (req, res) => {
  try {
    const category = await Post.findById(req.params.categoryid)
    if (!category) {
      return res.status(404).json({ msg: 'category does not exist' })
    }
    const post = await category.posts
    if (!post) {
      return res.status(404).json({ msg: 'Post not found' })
    }
    res.json(post)
  } catch (err) {
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Post not found' })
    }
    res.status(500).send('Server error')
  }
})

// @route    get api/categories/:categoryid/posts/:postid
// @dec      get post by id
// @acces    public
router.get('/:categoryid/posts/:postid', async (req, res) => {
  try {
    const category = await Post.findById(req.params.categoryid)
    if (!category) {
      return res.status(404).json({ msg: 'Category does not exist' })
    }

    const post = await category.posts.find(m => m.id === req.params.postid)
    if (!post) {
      return res.status(404).json({ msg: 'Post not found' })
    }

    res.json(post)
  } catch (err) {
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Post not found' })
    }
    res.status(500).send('Server error')
  }
})

// @route    delete api/categories/:categoryid/posts/:postid
// @dec      delete a post
// @acces    private user
router.delete('/:categoryid/posts/:postid', auth, async (req, res) => {
  try {
    const category = await Post.findById(req.params.categoryid)
    if (!category) {
      return res.status(404).json({ msg: 'Category does not exist' })
    }

    const post = await category.posts.find(m => m.id === req.params.postid)
    if (!post) {
      return res.status(404).json({ msg: 'Post not found' })
    }

    const user = await User.findById(req.user.id).select('-password')
    // check user
    if (post.user.toString() !== req.user.id && !user.admin) {
      return res.status(403).json({ msg: 'User not authorized' })
    }

    const removeIndex = category.posts
      .map(p => p.id)
      .indexOf(req.params.postid)

    category.posts.splice(removeIndex, 1)

    await category.save()

    res.json({ msg: 'Post removed' })
  } catch (err) {
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Post not found' })
    }
    res.status(500).send('Server error')
  }
})

// @route    UPDATE api/categories/:categoryid/posts/:postid
// @dec      Update event information
// @acces    private user
router.put(
  '/:categoryid/posts/:postid',
  [
    auth,
    [
      check('text', 'Text is required')
        .not()
        .isEmpty()
    ]
  ],
  async (req, res) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() })
    }
    try {
      const category = await Post.findById(req.params.categoryid)
      if (!category) {
        return res.status(404).json({ msg: 'Category does not exist' })
      }

      const post = await category.posts.find(m => m.id === req.params.postid)
      if (!post) {
        return res.status(404).json({ msg: 'Post not found' })
      }

      const user = await User.findById(req.user.id).select('-password')
      // check user
      if (post.user.toString() !== req.user.id && !user.admin) {
        return res.status(403).json({ msg: 'User not authorized' })
      }

      const newPost = await Post.findOneAndUpdate(
        { _id: req.params.categoryid },
        { $set: { 'posts.$[post].text': req.body.text } },
        {
          arrayFilters: [{ 'post._id': req.params.postid }],
          new: true
        }
      )

      await category.save()

      res.json(newPost)
    } catch (err) {
      if (err.kind === 'ObjectId') {
        return res.status(404).json({ msg: 'Event not found' })
      }
      res.status(500).send('Server error')
    }
  }
)

router.use('/', Comment)

module.exports = router
