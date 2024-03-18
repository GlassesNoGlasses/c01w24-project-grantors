export interface ModalProps {
    children: React.ReactNode | JSX.Element | null,
    allowQuickClose?: boolean,
    showModal?: boolean,
    closeModal: () => void,
    openModal: () => void,
}

