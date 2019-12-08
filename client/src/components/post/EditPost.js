import React, { useEffect, useState } from "react"
import PropTypes from "prop-types"
import { connect } from "react-redux"
import { getPost, updatePost } from "../../actions/post"

const EditPost = ({ getPost, updatePost, post: { post, postloading }, match }) => {
  const [text, setText] = useState({
    text: ""
  })

  const { categoryId, postId } = match.params

  useEffect(() => {
    getPost(categoryId, postId)

    setText({
      text: postloading ? "" : post.text
    })
  }, [postloading])

  const onSubmit = e => {
    e.preventDefault()
    updatePost(categoryId, postId, {text})
  }

  return (
    <div className='post-form'>
      <div className='bg-primary p'>
        <h3>Edit post</h3>
      </div>
      <form className='form my-1' onSubmit={e => onSubmit(e)}>
        <textarea
          name='text'
          cols='30'
          rows='5'
          placeholder='Create a post'
          value={text.text}
          onChange={e => setText(e.target.value)}
          required
        />
        <input type='submit' className='btn btn-dark my-1' value='Update' />
      </form>
    </div>
  )
}

EditPost.propTypes = {
  post: PropTypes.object.isRequired
}

const mapStateToProps = state => ({
  post: state.post
})

export default connect(mapStateToProps, { getPost, updatePost })(EditPost)
