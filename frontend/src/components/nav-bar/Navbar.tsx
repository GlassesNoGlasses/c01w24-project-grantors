import React from 'react'
import { NavbarProps } from './NavbarProps'
import { Link, Outlet } from 'react-router-dom'
import logoImage from '../../images/grantors-logo.png'
import { useUserContext } from '../contexts/userContext'
import { UserType } from '../interfaces/user'
import AdminNav from './admin-nav/AdminNav'

const Navbar = ({
  prop1,
  prop2,
  prop3
}: NavbarProps) => {

  // Get User Context
  const {user} = useUserContext();


  const LoginButton = () => {
    return (
      <Link className='p-2 px-5 m-2 bg-green-500 hover:bg-green-600 active:bg-green-700
        text-white font-bold rounded-lg shadow-md transition-colors duration-150 ease-in
        text-base'
        to='/login'>
        Log In
      </Link>
    )
  }
  
  const SignUpButton = () => {
    return (
      <Link className='p-2 px-5 m-2 bg-blue-500 hover:bg-blue-600 active:bg-blue-700
        text-white font-bold rounded-lg shadow-md transition-colors duration-150 ease-in
        text-base'
        to='/signup'>
        Sign Up
      </Link>
    )
  }
  

  const AdminTopNaviation = (): JSX.Element =>  {
    return (
      <nav className='nav-bar' style={styles.navBarStyles}>
        <div className='nav-container' style={styles.navContainerStyles}>
          <Link to="/" className='nav-brand'>
            <img src={logoImage} className='nav-logo'/>
          </Link>
          <AdminNav user={user}/>
        </div>
    </nav>
    )
  };

  const ClientTopNavigation = (): JSX.Element =>  {
    return (
      <nav className='nav-bar' style={styles.navBarStyles}>
        <div className='nav-container' style={styles.navContainerStyles}>
          <Link to="/" className='nav-brand'>
            <img src={logoImage} className='nav-logo'/>
          </Link>
          <AdminNav user={user}/>
        </div>
    </nav>)
  };

  const DefaultTopNavigation = (): JSX.Element => {
    return (
      <nav className='flex flex-col sm:flex-row justify-between items-center sm:pr-8 border-b-2 border-black'>
        <Link to="/" className='nav-brand'>
          <img src='/grantors-logo.png' className='nav-logo'/>
        </Link>
        <Link className='text-base hover:underline' to="/about">About</Link>
        <Link className='text-base hover:underline' to="/services">Services</Link>
        <Link className='text-base hover:underline' to="/gallery">Gallery</Link>
        <Link className='text-base hover:underline' to="/contact">Contact</Link>
        <LoginButton />
        <SignUpButton />
      </nav>
    )
  };

  const SetTopNavigation = (): JSX.Element => {
    switch (user?.type) {
      case UserType.Admin:
        return AdminTopNaviation();
      case UserType.Client:
        return ClientTopNavigation();
      default:
        return DefaultTopNavigation();
    }
  };

  return (
    <div>
      {SetTopNavigation()}
      <Outlet />
    </div>
  )
}

export default Navbar

const styles = {
  navBarStyles: {
    height: "fit-content",
    width: "100%",
  },
  navContainerStyles: {
    height: "fit-content",
    width: "100%",
    display: "flex",
    flexDirection: "row" as "row",
    justifyContent: "space-evenly",
    alignItems: "center",
    borderBottom: "black",
    borderStyle: "solid"
  },
  navInformationStyles: {
    display: "inline-flex",
    height: "100%",
    width: "90%",
    flexDirection: "row" as "row",
    justifyContent: "space-evenly",
  }
  
}
