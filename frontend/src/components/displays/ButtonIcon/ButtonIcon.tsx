import React from 'react'
import { ButtonIconProps } from './ButtonIconProps'

const ButtonIcon = ({
    imageSrc,
    label,
    callback,
}: ButtonIconProps) => {

  return (
    <div>
        <button style={styles.buttonStyles} onClick={callback}>
            <div className={`icone-${imageSrc}`} style={styles.imageStyes}>
                <img src={imageSrc}></img>
            </div>
            <span style={{fontSize: "x-large", color: "white", fontWeight: "bold"}}>{label ? label : ""}</span>
        </button>
    </div>
  )
}

export default ButtonIcon

const styles = {
    imageStyes: {
        background: "white",
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

