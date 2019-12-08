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
  UPDATE_COMMENT,
  GET_COMMENT,
  DELETE_CATEGORY,
  UPDATE_CATEGORY,
  ADD_CATEGORY
} from "../actions/types"

const initialState = {
  posts: [],
  post: {},
  comment: {},
  loading: true,
  catloading: true,
  postloading: true,
  commentloading: true,
  category: {},
  error: {}
}

export default function(state = initialState, action) {
  const { type, payload } = action

  switch (type) {
    case UPDATE_COMMENT:
      return {
        ...state,
        comment: payload,
        commentloading: false
      }
    case DELETE_CATEGORY:
      return {
        ...state,
        posts: payload,
        loading: false
      }
    case GET_COMMENT:
      return{
        ...state,
        comment: payload,
        loading: false
        //commentloading: false
      }
    case ADD_CATEGORY:
      return{
        ...state,
        posts: payload,
        loading: false
      }
    case UPDATE_CATEGORY:
      return{
        ...state,
        category: payload,
        postloading: false
      }
    case GET_CATEGORY:
      return {
        ...state,
        category: payload,
        catloading: false,
        loading: true,//paskutine keista
        postloading: true
      }
    case GET_POSTS:
      return {
        ...state,
        posts: payload,
        loading: false,
        c: true,
        postloading: true
      }
    case GET_POST:
      return {
        ...state,
        post: payload,
        postloading: false,
        loading: true,
        commentloading: false
      }
    case UPDATE_POST:
      return {
        ...state,
        post: payload,
        postloading: false
      }
    case ADD_POST:
      return {
        ...state,
        posts: payload.categories,
        category: { ...state.category, posts: payload.category},
        loading: false
      }
    case DELETE_POST:
      return {
        ...state,
        posts: state.posts.map(cat => ({
          ...cat,
          posts: cat.posts.filter(p => p._id !== payload.id)
        })),
        category: {
          ...state.category,
          posts: payload.res.data.posts
        },
        loading: false
      }
    case POST_ERROR:
      return {
        ...state,
        posts: payload,
        loading: false
      }
    case ADD_COMMENT:
      return {
        ...state,
        post: { ...state.post, comments: payload },
        loading: false
      }
    case REMOVE_COMMENT:
      return {
        ...state,
        post: {
          ...state.post,
          comments: state.post.comments.filter(
            comment => comment._id !== payload
          )
        },
        loading: false
      }
    case CATEGORY_ERROR:
      return {
        ...state,
        category: payload,
        loading: false
      }
    default:
      return state
  }
}
