
import React from 'react'
import { DownloadWrapperProps } from './DownloadWrapperProps'

export const DownloadWrapper = ({
    element,
    file,
    title
}: DownloadWrapperProps) => {
  return (
    <a href={URL.createObjectURL(file)} download={`${title ? title : file.name}`}>
        {element}
    </a>
  )
}

