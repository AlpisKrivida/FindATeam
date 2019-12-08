import React from 'react'
import { Link } from 'react-router-dom'

const CategoryItem = ({ categoryId, posts: { name } }) => {
  return (
    <Link to={`/categories/${categoryId}`} className='btn btn-light'>
      <i className='fas fa-user-circle text-primary'></i> {name}
    </Link>
  )
}

export default CategoryItem
