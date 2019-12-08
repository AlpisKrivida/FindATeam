import React, { useEffect } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { getPosts, deleteCategory } from '../../actions/post'
import { Link } from 'react-router-dom'
import Spinner from '../layout/Spinner'

const CategoryTable = ({
  getPosts,
  deleteCategory,
  post: { posts, cattable }
}) => {
  useEffect(() => {
    getPosts()
  }, [cattable])

  return cattable ? (
    <Spinner />
  ) : (
    <div>
      <h1 className='lead'>Categories</h1>
      <table id='cattable'>
        <tbody>
          <tr>
            <th>CATEGORY NAME</th>
            <th>EDIT CATEGORY</th>
            <th>DELETE CATEGORY</th>
          </tr>
          {posts.map(category => (
            <tr key={category._id}>
              <td>{category.name}</td>
              <td>
                <Link to={`/edit-category/${category._id}`}>Edit</Link>
              </td>
              <td>
                <button
                  onClick={e => deleteCategory(category._id)}
                  type='button'
                  className='btn btn-danger'
                >
                  <i className='fas fa-times'></i>
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

CategoryTable.propTypes = {
  getPosts: PropTypes.func.isRequired,
  post: PropTypes.object.isRequired
}

const mapStateToProps = state => ({
  post: state.post
})

export default connect(mapStateToProps, { getPosts, deleteCategory })(
  CategoryTable
)
