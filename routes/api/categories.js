const express = require('express')
const { check, validationResult } = require('express-validator')
const post = require('./posts')
const auth = require('../../middleware/auth')
const Post = require('../../modules/Posts')
const Category = require('../../modules/Posts')
const User = require('../../modules/User')

const router = express.Router()
// @route    POST api/categories
// @dec      Create new category
// @acces    private only admin
router.post(
  '/',
  [
    auth,
    [
      check('name', 'Name is required')
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
      if (!user.admin) {
        return res
          .status(403)
          .json({ errors: [{ msg: 'User not authorized' }] })
      }
      let category = await Post.findOne({ name: req.body.name })
      if (category) {
        return res
          .status(400)
          .json({ errors: [{ msg: 'Category already exists' }] })
      }

      const newCategorie = new Category({
        name: req.body.name
      })
      category = await newCategorie.save()
      res.json(category)
    } catch (error) {
      res.status(500).send('Server error')
    }
  }
)

// @route    GET api/categories
// @dec      Get all categories
// @acces    public
router.get('/', async (req, res) => {
  try {
    const categories = await Category.find().sort({ date: -1 })
    res.json(categories)
  } catch (err) {
    res.status(500).send('Server error')
  }
})

// @route    GET api/categories/:categoryid
// @dec      Get category by id
// @acces    public
router.get('/:categoryid', async (req, res) => {
  try {
    const category = await Category.findById(req.params.categoryid)
    res.json(category)
  } catch (err) {
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Category not found' })
    }
    res.status(500).send('Server error')
  }
})

// @route    UPDATE api/categories/:categoryid
// @dec      Update category
// @acces    private only admin
router.put(
  '/:categoryid',
  [
    auth,
    [
      check('name', 'Name is required')
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
      if (!user.admin) {
        return res
          .status(403)
          .json({ errors: [{ msg: 'User not authorized' }] })
      }
      const category = await Category.findByIdAndUpdate(
        req.params.categoryid,
        req.body,
        {
          new: true
        }
      )
      res.json(category)
    } catch (err) {
      if (err.kind === 'ObjectId') {
        return res.status(404).json({ msg: 'Category not found' })
      }
      res.status(500).send('Server error')
    }
  }
)

// @route    DELETE api/categories/:categoryid
// @dec      Delete category
// @acces    private only admin
router.delete('/:categoryid', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password')
    if (!user.admin) {
      return res.status(403).json({ errors: [{ msg: 'User not authorized' }] })
    }
    const category = await Category.findById(req.params.categoryid)
    if (!category) {
      return res.status(404).json({ msg: 'Category not found' })
    }

    await category.remove()

    res.json({ msg: 'Category removed' })
  } catch (err) {
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Category not found' })
    }
    res.status(500).send('Server error')
  }
})

router.use('/', post)

module.exports = router
