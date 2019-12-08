import React, { useEffect } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import Spinner from '../layout/Spinner'
import PostItem from '../posts/PostItem'
import { getPost } from '../../actions/post'
import CommentForm from './CommentForm'
import CommentItem from './CommentItem'

const Post = ({ getPost, post: { post, commentloading }, match }) => {

  const {
    categoryId,
    postId
  } = match.params

  useEffect(() => {
    getPost(categoryId, postId)
  }, [commentloading])

  return commentloading || post == null ? (
    <Spinner />
  ) : (
    <>
      <PostItem post={post} showActions={false}></PostItem>
      <CommentForm
        postId={postId}
        categoryId={categoryId}
      ></CommentForm>
      <div>
        {post.comments.map(comment => (
          <CommentItem
            key={comment._id}
            postId={postId}
            comment={comment}
            categoryId={categoryId}
          />
        ))}
      </div>
    </>
  )
}

Post.propTypes = {
  getPost: PropTypes.func.isRequired,
  post: PropTypes.object.isRequired
}

const mapStateToProps = state => ({
  post: state.post
})

export default connect(mapStateToProps, { getPost })(Post)
