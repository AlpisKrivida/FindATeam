import React, { useEffect } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { getCategory, getPosts, getPost } from '../../actions/post'
import PostItem from '../posts/PostItem'
import Spinner from '../layout/Spinner'
import PostForm from '../posts/PostForm'

const CategoryPost = ({
  getCategory,
  getPosts,
  auth: { isAuthenticated },
  post: { category, catloading },
  match
}) => {
  useEffect(() => {
    getPosts()
    getCategory(categoryId)
  }, [catloading])

  const {
    categoryId
  } = match.params

  return catloading ? (
    <Spinner />
  ) : (
    <>
      <h1 className='large text-primary'>{`${category.name} posts`}</h1>
      {isAuthenticated && <PostForm categoryId={categoryId} />}
      <div className='posts'>
        {category.posts.map(post => (
          <PostItem key={post._id} post={post} categoryId={category._id} />
        ))}
      </div>
    </>
  )
}

CategoryPost.propTypes = {
  getCategory: PropTypes.func.isRequired,
  post: PropTypes.object.isRequired
}

const mapStateToProps = state => ({
  post: state.post,
  auth: state.auth
})

export default connect(mapStateToProps, { getCategory, getPosts, getPost })(
  CategoryPost
)
