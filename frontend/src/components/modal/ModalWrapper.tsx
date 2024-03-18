import React from 'react'
import { ModalWrapperProps } from './ModalWrapperProps'
import ModalInner from './ModalInner'

const ModalWrapper = ({
        children,
        closeModal,
}: ModalWrapperProps) => {

    return (
        <div onClick={closeModal} className='min-h-full min-w-full
        flex justify-center items-center z-10 fixed inset-0 bg-dim '>
                <ModalInner innerClick={(e: React.MouseEvent) =>  e.stopPropagation()}>
                        {children}
                </ModalInner>
        </div>
    );
}

export default ModalWrapper
