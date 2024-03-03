import React from 'react'
import { ApplicationIconProps } from './ApplicationIconProps'

const ApplicationIcon = ({
    imageSrc,
    label
}: ApplicationIconProps) => {
  return (
    <button className='flex flex-col items-center bg-white rounded-lg p-4 px-6 gap-2'>
        <div className='max-h-48 max-w-48'>
            <img src={imageSrc}></img>
        </div>
        <p className='text-lg font-bold'>{label}</p>
    </button>
  )
}

export default ApplicationIcon
