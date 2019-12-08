const express = require('express')
const { check, validationResult } = require('express-validator')
const auth = require('../../middleware/auth')
const Post = require('../../modules/Posts')
const User = require('../../modules/User')

const router = express.Router()

// @route    post api/categories/:categoryid/posts/:postid/comment
// @dec      comment on a post
// @acces    private user
router.post(
  '/:categoryid/posts/:postid/comment',
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

      const newComment = {
        text: req.body.text,
        name: user.name,
        avatar: user.avatar,
        user: req.user.id
      }

      await category.posts
        .find(p => p.id === req.params.postid)
        .comments.unshift(newComment)

      await category.save()

      res.json(newComment)
    } catch (error) {
      res.status(500).send('Server Error')
    }
  }
)

// @route    post api/categories/:categoryid/posts/:postid/comment
// @dec      get all comments on the post
// @acces    public
router.get('/:categoryid/posts/:postid/comment', async (req, res) => {
  try {
    const category = await Post.findById(req.params.categoryid)
    if (!category) {
      return res.status(404).json({ msg: 'Category does not exist' })
    }

    const post = await category.posts.find(
      comment => comment.id === req.params.postid
    )
    if (!post) {
      return res.status(400).json({ msg: 'Post not found' })
    }

    res.json(post.comments)
  } catch (err) {
    if (err.kind === 'ObjectId') {
      return res.status(400).json({ msg: 'Post not found' })
    }
    res.status(500).send('Server error')
  }
})

// @route    get api/categories/:categoryid/posts/:postid/comment/:commentid
// @dec      get comment by id
// @acces    public
router.get(
  '/:categoryid/posts/:postid/comment/:commentid',
  async (req, res) => {
    try {
      const category = await Post.findById(req.params.categoryid)
      if (!category) {
        return res.status(404).json({ msg: 'Category does not exist' })
      }

      const post = await category.posts.find(p => p.id === req.params.postid)
      if (!post) {
        return res.status(404).json({ msg: 'Post not found' })
      }

      const comment = post.comments.find(x => x.id === req.params.commentid)
      if (!comment) {
        return res.status(404).json({ msg: 'Comment not found' })
      }

      res.json(comment)
    } catch (err) {
      if (err.kind === 'ObjectId') {
        return res.status(404).json({ msg: 'Post not found' })
      }
      res.status(500).send('Server error')
    }
  }
)

// @route    delete api/posts/comment/:id/:comment_id
// @dec      delete commenct
// @acces    private user
router.delete(
  '/:categoryid/posts/:postid/comment/:commentid',
  auth,
  async (req, res) => {
    try {
      const category = await Post.findById(req.params.categoryid)
      if (!category) {
        return res.status(404).json({ msg: 'Category does not exist' })
      }

      const post = await category.posts.find(p => p.id === req.params.postid)
      if (!post) {
        return res.status(404).json({ msg: 'Post does not exist' })
      }

      const user = await User.findById(req.user.id).select('-password')

      // pull out commnets
      const comment = post.comments.find(
        comment => comment.id === req.params.commentid
      )

      // make sure comment exists
      if (!comment) {
        return res.status(404).json({ msg: 'Comment does not exist' })
      }

      // check user
      if (comment.user.toString() !== req.user.id && !user.admin) {
        return res.status(403).json({ msg: 'User not authorized' })
      }

      const removeIndex = post.comments
        .map(c => c.id)
        .indexOf(req.params.commentid)

      category.posts
        .find(p => p.id === req.params.postid)
        .comments.splice(removeIndex, 1)

      await category.save()

      res.json({ msg: 'Comment removed' })
    } catch (err) {
      if (err.kind === 'ObjectId') {
        return res.status(404).json({ msg: 'Comment not found' })
      }
      res.status(500).send('Server error')
    }
  }
)

// @route    UPDATE api/posts/comment/:id/:comment_id
// @dec      Update comment
// @acces    private user
router.put(
  '/:categoryid/posts/:postid/comment/:commentid',
  auth,
  async (req, res) => {
    try {
      const category = await Post.findById(req.params.categoryid)
      if (!category) {
        return res.status(404).json({ msg: 'Category not found' })
      }
      const post = await category.posts.find(p => p.id === req.params.postid)
      const user = await User.findById(req.user.id).select('-password')

      if (!post) {
        return res.status(404).json({ msg: 'Post not found' })
      }

      // pull out commnets
      const comment = post.comments.find(
        comment => comment.id === req.params.commentid
      )

      // check user
      if (comment.user.toString() !== user.id && !user.admin) {
        return res.status(403).json({ msg: 'User not authorized' })
      }

      const newComment = await Post.findOneAndUpdate(
        { _id: req.params.categoryid },
        { $set: { 'posts.$[post].comments.$[comment].text': req.body.text } },
        {
          arrayFilters: [
            { 'post._id': req.params.postid },
            { 'comment._id': req.params.commentid }
          ],
          new: true
        }
      )

      await category.save()

      res.json(newComment)
    } catch (err) {
      if (err.kind === 'ObjectId') {
        return res.status(404).json({ msg: 'Comment not found' })
      }
      res.status(500).send('Server error')
    }
  }
)

module.exports = router
