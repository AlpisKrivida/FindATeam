import React, { useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import { updateComment, getComment } from '../../actions/post'
import { connect } from 'react-redux'

const EditComment = ({
  updateComment,
  getComment,
  post: { comment, loading },
  match
}) => {
  const { categoryId, postId, commentId } = match.params

  const [text, setText] = useState({
    text: ''
  })

  useEffect(() => {
    getComment(categoryId, postId, commentId)

    setText({
      text: loading ? '' : comment.text
    })
  }, [loading])

  const onSubmit = e => {
    e.preventDefault()
    updateComment(categoryId, postId, commentId, { text })
  }

  return (
    <div className='post-form'>
      <div className='bg-primary p'>
        <h3>Edit comment</h3>
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

EditComment.propTypes = {
  post: PropTypes.object.isRequired
}

const mapStateToProps = state => ({
  post: state.post
})

export default connect(mapStateToProps, { updateComment, getComment })(
  EditComment
)
