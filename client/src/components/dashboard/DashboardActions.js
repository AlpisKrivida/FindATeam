import React from 'react'
import { Link } from 'react-router-dom'
import { connect } from 'react-redux'

const DashboardActions = ({ auth: { user } }) => {
  return (
    <div className='dash-buttons'>
      <Link to='/edit-profile' className='btn btn-light'>
        <i className='fas fa-user-circle text-primary'></i> Edit Profile
      </Link>
      <Link to='/view-profile' className='btn btn-light'>
        View Profile
      </Link>
      {user.admin && (
        <Link to='/add-category' className='btn btn-light'>
          Configure categories
        </Link>
      )}
    </div>
  )
}

const mapStateToProps = state => ({
  auth: state.auth
})

export default connect(mapStateToProps)(DashboardActions)
