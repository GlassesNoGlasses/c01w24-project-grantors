import React from 'react'
import { NavbarProps } from './NavbarProps'
import { Link, Outlet } from 'react-router-dom'
import logoImage from '../../images/grantors-logo.png'

const Navbar = ({
  prop1,
  prop2,
  prop3
}: NavbarProps) => {
  return (
    <div>
      <nav className='nav-bar' style={styles.navBarStyles}>
        <div className='nav-container' style={styles.navContainerStyles}>
          <Link to="/" className='nav-brand'>
            <img src={logoImage} className='nav-logo'/>
          </Link>
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
          </div>
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
