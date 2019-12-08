const express = require('express')
const request = require('request')
const config = require('config')
const { check, validationResult } = require('express-validator')
const auth = require('../../middleware/auth')
const Profile = require('../../modules/Profile')
const User = require('../../modules/User')

const router = express.Router()

// @route    get api/profile/me
// @dec      get current users profile
// @acces    private
router.get('/me', auth, async (req, res) => {
  try {
    const profile = await Profile.findOne({
      user: req.user.id
    }).populate('user', ['name', 'avatar'])

    if (!profile) {
      return res.status(400).json({ msg: 'There is no profile for this user' })
    }

    res.json(profile)
  } catch (err) {
    res.status(500).send('Server error')
  }
})

// @route    post api/profiler
// @dec      going to create or update user profile
// @acces    private
router.post(
  '/',
  auth,
  async (req, res) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() })
    }

    const {
      location,
      bio,
      youtube,
      facebook,
      twitter,
      instagram,
      linkedin
    } = req.body

    // Build profilde object
    const profileFields = {}
    profileFields.user = req.user.id
    if (location) profileFields.location = location
    if (bio) profileFields.bio = bio

    // Build social object
    profileFields.social = {}
    if (youtube) profileFields.social.youtube = youtube
    if (twitter) profileFields.social.twitter = twitter
    if (facebook) profileFields.social.facebook = facebook
    if (linkedin) profileFields.social.linkedin = linkedin
    if (instagram) profileFields.social.instagram = instagram

    try {
      let profile = await Profile.findOne({ user: req.user.id })

      if (profile) {
        // UPDATE
        profile = await Profile.findOneAndUpdate(
          { user: req.user.id },
          { $set: profileFields },
          {
            new: true
          }
        )
        return res.json(profile)
      }

      // Create
      profile = new Profile(profileFields)

      await profile.save()
      res.json(profile)
    } catch (err) {
      res.status(500).send('Server Error')
    }
  }
)

// @route    get api/profile
// @dec      get all profiles
// @acces    public
router.get('/', async (req, res) => {
  try {
    const profiles = await Profile.find().populate('user', ['name', 'avatar'])
    res.json(profiles)
  } catch (err) {
    res.status(500).send('Server Error')
  }
})

// @route    get api/profile/user/:user_id
// @dec      get profile by user id
// @acces    public
router.get('/user/:user_id', async (req, res) => {
  try {
    const profile = await Profile.findOne({
      user: req.params.user_id
    }).populate('user', ['name', 'avatar'])
    if (!profile) return res.status(400).json({ msg: 'Profile not found' })

    res.json(profile)
  } catch (err) {
    if (err.kind === 'ObjectId') {
      return res.status(400).json({ msg: 'Profile not found' })
    }
    res.status(500).send('Server Error')
  }
})

// @route    delete api/profile
// @dec      delete profile and user and post
// @acces    private
router.delete('/', auth, async (req, res) => {
  try {
    // Remove profile
    await Profile.findOneAndRemove({ user: req.user.id })
    // remove user
    await User.findOneAndRemove({ _id: req.user.id })
    res.json({ msg: 'User deleted' })
  } catch (err) {
    res.status(500).send('Server Error')
  }
})

module.exports = router
