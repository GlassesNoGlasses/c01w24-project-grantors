import { ButtonIconProps } from './ButtonIconProps'

const ButtonIcon = ({
        imageSrc,
        heroicon,
        label,
        text,
        callback,
    }: ButtonIconProps) => {

    return (
        <button className='flex flex-col items-center justify-center' onClick={callback}>
            <div className='bg-white shadow-lg hover:border-black shadow-black border-4 border-primary' style={styles.imageStyes}>
                {imageSrc ? (
                    <img src={imageSrc}></img>
                ) : (
                    heroicon
                ) }
            </div>
            <h2 className={`text-xl ${text} font-bold mt-2`}>{label ? label : ""}</h2>
        </button>
    );
};

export default ButtonIcon

const styles = {
    imageStyes: {
        borderRadius: "50%",
        padding: "20%",
        height: "16vh",
        aspectRatio: "1 / 1"
    },
};