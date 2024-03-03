import React from 'react'
import { ButtonIconProps } from './ButtonIconProps'

const ButtonIcon = ({
    imageSrc,
    label,
    callback,
}: ButtonIconProps) => {

  return (
    <button className='flex flex-col items-center justify-center' onClick={callback}>
        <div className='bg-white' style={styles.imageStyes}>
            <img src={imageSrc}></img>
        </div>
        <p className='text-xl text-white font-bold'>{label ? label : ""}</p>
    </button>
)
}

export default ButtonIcon

const styles = {
    imageStyes: {
        borderRadius: "50%",
        padding: "25%",
        height: "16vh",
        aspectRatio: "1 / 1"
    },
    buttonStyles: {
        display: "flex",
        flexDirection: "column" as "column",
        alignItems: "center",
        justifyContent: "center" 
    }
}

