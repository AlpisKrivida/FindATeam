import React, { useState } from 'react'
import PropTypes from 'prop-types'
import { addCategory } from '../../actions/post'
import { connect } from 'react-redux'
import CategoryTable from './CategoryTable'

const CategoryForm = ({ addCategory }) => {
  const [name, setName] = useState('')

  return (
    <>
      <div className='post-form'>
        <div className='bg-primary p'>
          <h3>Create new category</h3>
        </div>
        <form
          className='form my-1'
          onSubmit={e => {
            e.preventDefault()
            addCategory({ name })
            setName('')
          }}
        >
          <textarea
            name='text'
            cols='30'
            rows='5'
            placeholder='Category name'
            value={name}
            onChange={e => setName(e.target.value)}
            required
          />
          <input type='submit' className='btn btn-dark my-1' value='Submit' />
        </form>
      </div>
      <CategoryTable />
    </>
  )
}

CategoryForm.propTypes = {
  addCategory: PropTypes.func.isRequired
}

export default connect(null, { addCategory })(CategoryForm)
