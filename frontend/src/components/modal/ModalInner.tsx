import { ModalInnerProps } from './ModalInnerProps'

const ModalInner = ({
    children,
    innerClick,
}: ModalInnerProps) => {
  
	return (
		<div onClick={innerClick} className='flex min-h-fit min-w-fit'>
			{children}
		</div>
	);
};

export default ModalInner