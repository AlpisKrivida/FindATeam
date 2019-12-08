import React, { useEffect } from "react"
import PropTypes from "prop-types"
import { connect } from "react-redux"
import { getPosts } from "../../actions/post"
import PostItem from "./PostItem"
import Spinner from "../layout/Spinner"\

const Posts = ({ getPosts, post: { posts, loading } }) => {
  useEffect(() => {
    getPosts()
  }, [loading])

  return loading ? (
    <Spinner />
  ) : (
    <p>
      <h1 className='large text-primary'>Posts</h1>
      <p className='lead'>
        <i className='fas fa-user'></i> Welcome to the community
      </p>
      <div className='posts'>
        {posts.map(post =>
          post.posts.map(p => (
            <PostItem key={p._id} post={p} categoryId={post._id} />
          ))
        )}
      </div>
    </>
  )
}

Posts.prototype = {
  getPosts: PropTypes.func.isRequired,
  post: PropTypes.object.isRequired
}

const mapStateToProps = state => ({
  post: state.post
})

export default connect(mapStateToProps, { getPosts })(Posts)
