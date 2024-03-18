
import { useEffect } from 'react'
import { ModalProps } from './ModalProps'
import ModalWrapper from './ModalWrapper'

export const Modal = ({
    children,
    allowQuickClose,
    showModal,
    closeModal,
    openModal,
}: ModalProps) => {

    useEffect(() => {
        const closeOnEscapePressed = (e: KeyboardEvent) => {
			if (e.key === "Escape") {
				closeModal();
			}
        };
        window.addEventListener("keydown", closeOnEscapePressed);
        return () =>
          window.removeEventListener("keydown", closeOnEscapePressed);
      }, []);

	return (
		<div className={`${showModal ? 'visible' : 'invisible'}`}>
			<ModalWrapper closeModal={closeModal}>
				{children}
			</ModalWrapper>
		</div>
	);
};


