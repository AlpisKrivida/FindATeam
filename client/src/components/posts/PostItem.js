import React from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'
import Moment from 'react-moment'
import { connect } from 'react-redux'
import { deletePost } from '../../actions/post'

const PostItem = ({
  auth,
  post: { _id, text, name, avatar, user, comments, date },
  showActions,
  categoryId,
  deletePost
}) => (
  <div className='post bg-white p-1 my-1'>
    <div>
      <img className='round-img' src={avatar} alt='' />
      <h4>{name}</h4>
    </div>
    <div>
      <p className='my-1'>{text}</p>
      <p className='post-date'>
        Posted on <Moment format='YYYY/MM/DD'>{date}</Moment>
      </p>
      {showActions && !auth.loading && (
        <>
          {auth.isAuthenticated && (
            <Link
              to={`/categories/${categoryId}/posts/${_id}`}
              className='btn btn-primary'
            >
              Discussion{' '}
              {comments.length > 0 && (
                <span className='comment-count'>{comments.length}</span>
              )}
            </Link>
          )}
          {auth.user &&
            !auth.loading &&
            (user === auth.user._id || auth.user.admin) && (
              <>
                <Link
                  to={`/categories/${categoryId}/edit-post/${_id}`}
                  className='btn btn-primary'
                >
                  Edit post
                </Link>
                <button
                  onClick={e => deletePost(_id, categoryId)}
                  type='button'
                  className='btn btn-danger'
                >
                  <i className='fas fa-times'></i>
                </button>
              </>
            )}
        </>
      )}
    </div>
  </div>
)

PostItem.defaultProps = {
  showActions: true
}

PostItem.propTypes = {
  post: PropTypes.object.isRequired,
  auth: PropTypes.object.isRequired,
  deletePost: PropTypes.func.isRequired
}

const mapStateToProps = state => ({
  auth: state.auth
})

export default connect(mapStateToProps, { deletePost })(PostItem)
