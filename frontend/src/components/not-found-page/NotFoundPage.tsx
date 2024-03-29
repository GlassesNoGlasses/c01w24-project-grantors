import { Link } from "react-router-dom";
import { FaceFrownIcon } from "@heroicons/react/24/outline";

const NotFoundPage = () => {
    return (
        <div className="pt-24 flex flex-col items-center">
            <div className='flex flex-col gap-8 m-2 p-6 rounded-2xl items-center border-4 border-primary
					bg-white shadow-md shadow-black transition-shadow duration-150 ease-in'>
                <h1 className="text-5xl font-bold">404: Page Not Found</h1>

                <FaceFrownIcon aria-label="sad face symbol" className="w-24 h-24 text-primary" />
            
                <h2 className="text-xl">Sorry, the page you are looking for does not exist</h2>

                <HomeButton />
            </div>
        </div>
    );
};

const HomeButton = () => {
    return (
        <Link role="button" className='p-2 px-5 mt-4 bg-primary hover:bg-secondary 
        text-white font-bold rounded-lg shadow-md transition-colors duration-150 ease-in
        text-base w-fit'
        to='/'>
            Home
        </Link>
    )
}

export default NotFoundPage;