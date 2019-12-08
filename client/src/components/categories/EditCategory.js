import React, { useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { getCategory, updateCategory } from '../../actions/post'

const EditComment = ({
  getCategory,
  updateCategory,
  post: { category, postloading },
  match
}) => {
  const [name, setName] = useState({
    text: ''
  })

  const { categoryId } = match.params

  useEffect(() => {
    getCategory(categoryId)

    setName({
      text: postloading ? '' : category.name
    })
  }, [postloading])
  const { text } = name

  const onSubmit = e => {
    e.preventDefault()
    updateCategory(categoryId, { name })
  }

  return (
    <div className='post-form'>
      <div className='bg-primary p'>
        <h3>Edit category</h3>
      </div>
      <form className='form my-1' onSubmit={e => onSubmit(e)}>
        <textarea
          name='text'
          cols='30'
          rows='5'
          placeholder='Create a post'
          value={text}
          onChange={e => setName(e.target.value)}
          required
        />
        <input type='submit' className='btn btn-dark my-1' value='Update' />
      </form>
    </div>
  )
}

EditComment.propTypes = {}

const mapStateToProps = state => ({
  post: state.post
})

export default connect(mapStateToProps, { getCategory, updateCategory })(
  EditComment
)
