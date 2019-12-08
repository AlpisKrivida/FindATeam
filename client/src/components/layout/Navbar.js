import React, { Fragment, useState } from 'react'
import { Link } from 'react-router-dom'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import { logout } from '../../actions/auth'

const Navbar = ({ auth: { isAuthenticated, loading }, logout, logo }) => {
  const [navOpen, setNavOpen] = useState(false)

  const authLinks = (
    <ul className={navOpen ? 'active' : ''}>
      <figure onClick={() => setNavOpen(!navOpen)}>
        <img src={logo} alt='logo'></img>
      </figure>
      <li>
        <Link to='/categories'>Categories</Link>
      </li>
      <li>
        <Link to='/dashboard'>
          <i className='fas fa-user' /> Dashboard
        </Link>
      </li>
      <li>
        <a onClick={logout} href='#!'>
          <i className='fas fa-sign-out-alt' />
          Logout
        </a>
      </li>
    </ul>
  )

  const guestLinks = (
    <ul className={navOpen ? 'active' : ''}>
      <figure onClick={() => setNavOpen(!navOpen)}>
        <img src={logo} alt='logo'></img>
      </figure>
      <h1>
        <Link to='/'>TeamFinder</Link>
      </h1>
      <li>
        <Link to='/categories'>Categories</Link>
      </li>
      <li>
        <Link to='/register'>Register</Link>
      </li>
      <li>
        <Link to='/login'>Login</Link>
      </li>
    </ul>
  )

  return (
    // <nav className='navbar bg-dark'>
    //   <h1>
    //     <Link to='/'>
    //       <i className='fas fa-code'></i> TeamFinder
    //     </Link>
    //   </h1>

    //     {!loading && (
    //       <Fragment>{isAuthenticated ? authLinks : guestLinks}</Fragment>
    //     )}
    // </nav>

    <nav className='responsive-toolbar' style={{ background: '#333' }}>
      {/* <h1>
        <Link to='/'>
          <i className='fas fa-code'></i> TeamFinder
        </Link>
      </h1> */}
      {!loading && (
        <Fragment>{isAuthenticated ? authLinks : guestLinks}</Fragment>
      )}
    </nav>
  )
}
Navbar.prototype = {
  logout: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired
}

const mapStateToProps = state => ({
  auth: state.auth
})

export default connect(mapStateToProps, { logout })(Navbar)
