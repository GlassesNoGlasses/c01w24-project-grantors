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

  const AdminTopNaviation = (): JSX.Element =>  {
    return (
      <AdminNav user={user}/>
    )
  };

  const ClientTopNavigation = (): JSX.Element =>  {
    return (
      <div className='nav-information' style={styles.navInformationStyles}>
        <AdminNav user={user}/>
    </div>)
  };

  const DefaultTopNavigation = (): JSX.Element => {
    return (
      <div className='nav-information' style={styles.navInformationStyles}>
        <Link to="/about">About</Link>
        <Link to="/services">Services</Link>
        <Link to="/gallery">Gallery</Link>
        <Link to="/contact">Contact</Link>
        <Link to="/login">
          <button>Login</button>
        </Link>
        <Link to="/signup">
          <button>SignUp</button>
        </Link>
    </div>)
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
    <div className="w-full h-full">
      <nav className='nav-bar' style={styles.navBarStyles}>
        <div className='nav-container' style={styles.navContainerStyles}>
          <Link to="/" className='nav-brand'>
            <img src={logoImage} className='nav-logo'/>
          </Link>
          {SetTopNavigation()}
        </div>
      </nav>
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
    borderStyle: "solid",
    borderSize: "thick"
  },
  navInformationStyles: {
    display: "inline-flex",
    height: "100%",
    width: "100%",
    flexDirection: "row" as "row",
    justifyContent: "space-evenly",
  }
}
