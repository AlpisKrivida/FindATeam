import axios from 'axios'
import { setAlert } from './alert'
import {
  GET_POSTS,
  POST_ERROR,
  DELETE_POST,
  ADD_POST,
  GET_POST,
  ADD_COMMENT,
  REMOVE_COMMENT,
  GET_CATEGORY,
  CATEGORY_ERROR,
  UPDATE_POST,
  GET_COMMENT,
  UPDATE_COMMENT,
  ADD_CATEGORY,
  UPDATE_CATEGORY,
  DELETE_CATEGORY
} from './types'

// GET posts
export const getPosts = () => async dispatch => {
  try {
    const res = await axios.get('/api/categories')

    dispatch({
      type: GET_POSTS,
      payload: res.data
    })
  } catch (err) {
    dispatch({
      type: POST_ERROR,
      payload: { msg: err.response.statusText, status: err.response.status }
    })
  }
}

// Add category
export const addCategory = formData => async dispatch => {
  const config = {
    headers: {
      'Content-Type': 'application/json'
    }
  }

  try {
    await axios.post(`/api/categories`, formData, config)

    const res = await axios.get(`/api/categories/`)

    dispatch({
      type: ADD_CATEGORY,
      payload: res.data
    })

    dispatch(setAlert('Category created', 'success'))
  } catch (err) {
    dispatch({
      type: POST_ERROR,
      payload: { msg: err.response.statusText, status: err.response.status }
    })
  }
}

//Delete Category
export const deleteCategory = categoryId => async dispatch => {
  try {
    await axios.delete(`/api/categories/${categoryId}`)
    const res = await axios.get(`/api/categories/`)

    dispatch({
      type: DELETE_CATEGORY,
      payload: res.data
    })

    dispatch(setAlert('Category removed', 'success'))
  } catch (err) {
    dispatch({
      type: POST_ERROR,
      payload: { msg: err.response.statusText, status: err.response.status }
    })
  }
}

//Update Category
export const updateCategory = (categoryId, formData) => async dispatch => {
  const config = {
    headers: {
      'Content-Type': 'application/json'
    }
  }
  try {
    const res = await axios.put(
      `/api/categories/${categoryId}`,
      formData,
      config
    )

    dispatch({
      type: UPDATE_CATEGORY,
      payload: res.data
    })
    dispatch(setAlert('Category updated', 'success'))
  } catch (err) {
    dispatch({
      type: POST_ERROR,
      payload: { msg: err.response.statusText, status: err.response.status }
    })
  }
}

//Update post
export const updatePost = (categoryId, postId, formData) => async dispatch => {
  const config = {
    headers: {
      'Content-Type': 'application/json'
    }
  }
  try {
    const res = await axios.put(
      `/api/categories/${categoryId}/posts/${postId}`,
      formData,
      config
    )

    const data = res.data.posts.find(p => p._id === postId)

    dispatch({
      type: UPDATE_POST,
      payload: data
    })
    dispatch(setAlert('Post updated', 'success'))
  } catch (err) {
    dispatch({
      type: POST_ERROR,
      payload: { msg: err.response.statusText, status: err.response.status }
    })
  }
}

//Get comment
export const getComment = (categoryId, postId, commentId) => async dispatch => {
  try {
    const res = await axios.get(
      `/api/categories/${categoryId}/posts/${postId}/comment/${commentId}`
    )

    dispatch({
      type: GET_COMMENT,
      payload: res.data
    })
  } catch (err) {
    dispatch({
      type: CATEGORY_ERROR,
      payload: { msg: err.response.statusText, status: err.response.status }
    })
  }
}

//Update comment
export const updateComment = (
  categoryId,
  postId,
  commentId,
  formData
) => async dispatch => {
  const config = {
    headers: {
      'Content-Type': 'application/json'
    }
  }
  try {
    const res = await axios.put(
      `/api/categories/${categoryId}/posts/${postId}/comment/${commentId}`,
      formData,
      config
    )

    const data = res.data.posts
      .find(p => p._id === postId)
      .comments.find(c => c._id === commentId)

    dispatch({
      type: UPDATE_COMMENT,
      payload: data
    })
    dispatch(setAlert('Comment updated', 'success'))
  } catch (err) {
    dispatch({
      type: POST_ERROR,
      payload: { msg: err.response.statusText, status: err.response.status }
    })
  }
}

//GET category
export const getCategory = categoryId => async dispatch => {
  try {
    const res = await axios.get(`/api/categories/${categoryId}`)

    dispatch({
      type: GET_CATEGORY,
      payload: res.data
    })
  } catch (err) {
    dispatch({
      type: CATEGORY_ERROR,
      payload: { msg: err.response.statusText, status: err.response.status }
    })
  }
}

//delete post
export const deletePost = (id, categoryId) => async dispatch => {
  try {
    await axios.delete(`/api/categories/${categoryId}/posts/${id}`)
    const res = await axios.get(`/api/categories/${categoryId}`)

    dispatch({
      type: DELETE_POST,
      payload: { id, res }
    })

    dispatch(setAlert('Post removed', 'success'))
  } catch (err) {
    dispatch({
      type: POST_ERROR,
      payload: { msg: err.response.statusText, status: err.response.status }
    })
  }
}

//add post
export const addPost = (formData, categoryId) => async dispatch => {
  const config = {
    headers: {
      'Content-Type': 'application/json'
    }
  }

  try {
    const category = await axios.post(
      `/api/categories/${categoryId}/posts`,
      formData,
      config
    )

    const categories = await axios.get('/api/categories')

    dispatch({
      type: ADD_POST,
      payload: { category: category.data.posts, categories: categories.data }
    })

    //getCategory(categoryId)

    dispatch(setAlert('Post Created', 'success'))
  } catch (err) {
    dispatch({
      type: POST_ERROR,
      payload: { msg: err.response.statusText, status: err.response.status }
    })
  }
}

//GET post
export const getPost = (categoryId, id) => async dispatch => {
  try {
    const res = await axios.get(`/api/categories/${categoryId}/posts/${id}`)

    dispatch({
      type: GET_POST,
      payload: res.data
    })
  } catch (err) {
    dispatch({
      type: POST_ERROR,
      payload: { msg: err.response.statusText, status: err.response.status }
    })
  }
}

//add comment
export const addComment = (formData, categoryId, postId) => async dispatch => {
  const config = {
    headers: {
      'Content-Type': 'application/json'
    }
  }
  try {
    await axios.post(
      `/api/categories/${categoryId}/posts/${postId}/comment`,
      formData,
      config
    )
    const res = await axios.get(
      `/api/categories/${categoryId}/posts/${postId}/comment`
    )

    dispatch({
      type: ADD_COMMENT,
      payload: res.data
    })

    dispatch(setAlert('Comment added', 'success'))
  } catch (err) {
    dispatch({
      type: POST_ERROR,
      payload: { msg: err.response.statusText, status: err.response.status }
    })
  }
}

//delete comment
export const deleteComment = (
  categoryId,
  postId,
  commentId
) => async dispatch => {
  try {
    await axios.delete(
      `/api/categories/${categoryId}/posts/${postId}/comment/${commentId}`
    )

    dispatch({
      type: REMOVE_COMMENT,
      payload: commentId
    })

    dispatch(setAlert('Comment removed', 'success'))
  } catch (err) {
    dispatch({
      type: POST_ERROR,
      payload: { msg: err.response.statusText, status: err.response.status }
    })
  }
}
