import React, { useEffect } from "react"
import PropTypes from "prop-types"
import { connect } from "react-redux"
import { getPosts } from "../../actions/post"
import CategoryItem from "./CategoryItem"
import Spinner from "../layout/Spinner"

const Categories = ({ getPosts, post: { posts, loading } }) => {
  useEffect(() => {
    getPosts()
  }, [getPosts])

  return loading ? (
    <Spinner />
  ) : (
    <>
      <h1 className='large text-primary'>Select category</h1>
      <div className='dash-buttons'>
        {posts.map(category => (
          <CategoryItem key={category._id} posts={category} categoryId={category._id} />
        ))}
      </div>
    </>
  )
}

Categories.propTypes = {
  getPosts: PropTypes.func.isRequired,
  post: PropTypes.object.isRequired
}

const mapStateToProps = state => ({
  post: state.post
})

export default connect(mapStateToProps, { getPosts })(Categories)
