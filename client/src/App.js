import React, { Fragment, useEffect } from "react"
import { BrowserRouter as Router, Route, Switch } from "react-router-dom"
import Navbar from "./components/layout/Navbar"
import Footer from './components/layout/Footer'
import Landing from "./components/layout/Landing"
import Register from "./components/auth/Register"
import Login from "./components/auth/Login"
import Alert from './components/layout/Alert'
import DashBoard from "./components/dashboard/Dashboard"
import CreateProfile from "./components/profile-form/CreateProfile"
import PrivateRoute from "./components/routing/PrivateRoute"
import AdminRoute from "./components/routing/AdminRoute"
import Posts from "./components/posts/Posts"
import EditProfile from "./components/profile-form/EditProfile"
import Categories from "./components/categories/Categories"
import "./App.css"
import './assets/scss/base.scss'
import logo from './img/icon.png'
import setAuthToken from './utils/setAuhtToken'
import Post from './components/post/Post'
import EditPost from './components/post/EditPost'
import EditComment from './components/post/EditComment'
import CategoryPost from './components/categories/CategoryPost'
import EditCategory from './components/categories/EditCategory'

import { Provider } from "react-redux"
import store from "./store"
import {loadUser} from './actions/auth'
import CategoryForm from "./components/categories/CategoryForm"

if (localStorage.token) {
  setAuthToken(localStorage.token)
}

const App = () => { 
  
  useEffect(() => {
    store.dispatch(loadUser())
  }, [])

  return(
  <Provider store={store}>
    <Router>
      <Fragment>
        <Navbar logo={logo} />
        <Route exact path='/' component={Landing} />
        <section className='container'>
          <Alert />
          <Switch>
            <Route exact path='/register' component={Register} />
            <Route exact path='/login' component={Login} />
            <Route exact path='/categories' component={Categories} />
            <Route exact path='/categories/:categoryId' component={CategoryPost} />
            <PrivateRoute exact path='/categories/:categoryId/posts/:postId' component={Post} />          
            <PrivateRoute exact path='/dashboard' component={DashBoard} />
            <PrivateRoute exact path='/create-profile' component={CreateProfile} />
            <PrivateRoute exact path='/edit-profile' component={EditProfile} />
            <PrivateRoute exact path='/categories/:categoryId/posts/:postId/edit-comment/:commentId' component={EditComment} />
            <PrivateRoute exact path='/posts' component={Posts} />
            <PrivateRoute exact path='/categories/:categoryId/edit-post/:postId' component={EditPost}/>
            <AdminRoute exact path='/add-category' component={CategoryForm}/>
            <AdminRoute exact path='/edit-category/:categoryId' component={EditCategory}/>
          </Switch>
        </section>
        <Footer/>
      </Fragment>
    </Router>
  </Provider>
)}

export default App
