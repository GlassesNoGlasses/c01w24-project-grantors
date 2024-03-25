import React from 'react'
import { useUserContext } from '../contexts/userContext'



const Background = () => {


    const {user} = useUserContext()

    const hc = user?.preferences.hc
    const sbg = user?.preferences.sbg
    let background = 'bg-home-background'

    if (sbg) background = 'bg-white'
    if (hc) background = 'bg-black'


    return (
        <div className={` ${background} bg-cover 
                bg-no-repeat bg-center h-[100vh] w-[100vw] fixed z-[-1]`}/>
    )
}

export default Background