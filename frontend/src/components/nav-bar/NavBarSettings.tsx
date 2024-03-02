import React from 'react'
import { NavBarSettingsProps } from './NavBarSettingsProps'
import burger from '../../images/burger.png'

const NavBarSettings = ({

}: NavBarSettingsProps) => {
  return (
    <button className='hover:bg-green-200'>
        <img src={burger} style={styles.burgerStyles}></img>
    </button>
  )
}

export default NavBarSettings

const styles = {
    burgerStyles: {
        height: "40px",
        width: "auto",
        borderWidth: "medium",
        borderColor: "rgb(141, 229, 100)",
    }
}
