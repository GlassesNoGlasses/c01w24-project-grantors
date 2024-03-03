import React from 'react'
import { NavbarProps } from './NavbarProps'
import { Link, Outlet } from 'react-router-dom'

const Navbar = ({
  prop1,
  prop2,
  prop3
}: NavbarProps) => {
  return (
    <div>
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
      <Outlet />
    </div>
  )
}

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

export default Navbar
