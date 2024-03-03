import React from 'react'
import { ApplicationIconProps } from './ApplicationIconProps'
import { ListBulletIcon } from '@heroicons/react/24/solid'

const ApplicationIcon = ({
    imageSrc,
    heroicon,
    label
}: ApplicationIconProps) => {
  return (
    <div className={`application-${label}`} style={styles.applicationContainerStyles}>
        <button>
            <div className={`icone-${imageSrc}`} style={styles.imageStyles}>
                {imageSrc ? (
                    <img src={imageSrc}></img>
                    ) : (
                        heroicon
                    ) }
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
