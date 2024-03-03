import React from 'react'
import { ApplicationIconProps } from './ApplicationIconProps'

const ApplicationIcon = ({
    imageSrc,
    label
}: ApplicationIconProps) => {
  return (
    <div className={`application-${label}`} style={styles.applicationContainerStyles}>
        <button>
            <div className={`icone-${imageSrc}`} style={styles.imageStyles}>
                <img src={imageSrc}></img>
            </div>
            <span style={{fontSize: "x-large", fontWeight: "bold"}}>{label}</span>
        </button>
    </div>
  )
}

export default ApplicationIcon

const styles = {
    applicationContainerStyles: {
        display: "flex",
        flexDirection: "column" as "column",
        alignItems: "center",
        backgroundColor: "white",
        padding: "2%",
        height: "80%",
        aspectRatio: "3 / 2",
        borderRadius: "5%"
    },
    imageStyles: {
        maxHeight: "200px",
        maxWidth: "200px",
        marginBottom: "5%"
    }
}
