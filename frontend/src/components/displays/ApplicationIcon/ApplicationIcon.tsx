import { ApplicationIconProps } from './ApplicationIconProps'

const ApplicationIcon = ({
    imageSrc,
    heroicon,
    label
}: ApplicationIconProps) => {
    return (
        <button className='flex flex-col items-center bg-white rounded-lg gap-2
        border-4 border-primary shadow-2xl hover:border-black shadow-black w-[25vw]
        h-[35vh] justify-center'>
            <div className='max-h-48 max-w-48'>
                {imageSrc ? (
                    <img src={imageSrc}></img>
                ) : (
                    heroicon
                ) }
            </div>
            <p className='text-lg font-bold'>{label}</p>
        </button>
    );
};

export default ApplicationIcon;
