import { StarIcon } from "@heroicons/react/24/solid";
import { useState } from "react";
import { useParams } from "react-router";

const ApplicationReview = () => {
    const applicationID = useParams();
    const [rating, setRating] = useState<number>(0);
    const [hoverRating, setHoverRating] = useState<number>(0);

    const rejectApplication = () => {

    };

    const submitApplicationReview = () => {

    };

    const approveApplication = () => {

    };

    return (
        <div id="review-container" className="flex flex-col shadow-[0_4px_25px_rgba(0,0,0,0.2)] rounded m-8 pb-8">
            <div id="review-header" className="flex flex-row justify-between items-center px-8">
                <span className="py-4 text-xl font-bold">Review Grant Application</span>
                <div id="star-rating" className="flex flex-row items-center gap-3">
                    <span className="text-lg">Rating</span>
                    <div id="stars:">
                        {[1,2,3,4,5].map((star) => (
                            <button 
                                type="button"
                                key={star}
                                onClick={() => setRating(star)}
                                onMouseEnter={() => setHoverRating(star)}
                                onMouseLeave={() => setHoverRating(rating)} // set hoverRating to rating when not hovering
                            >
                                <StarIcon className={`h-8 w-8 ${star <= hoverRating ? 'text-yellow-500' : 'text-gray-500'}`}/>
                            </button>
                        ))}
                    </div>
                </div>
            </div>
            <div className="flex flex-row justify-between px-8 gap-4">
                <div id="application-info-container" className="flex flex-col w-3/4 gap-4">
                    <div id="applicant-info" className="flex flex-col border-2 rounded border-magnify-blue p-2">
                        <span className="text-lg">Applicant</span>
                        <div id="name" className="flex flex-row justify-between">
                            <span>Name:</span>
                            <span>Jim McHugh</span>
                        </div>
                        <div id="email" className="flex flex-row justify-between">
                            <span>Email:</span> 
                            <span>jimmy@mcgill.com</span>
                        </div>
                    </div>
                    <div id="application-fields" className="flex flex-col border-2 rounded border-magnify-blue p-2 gap-4">
                        <div id="field1">
                            <div id="question" className="font-bold italic">Question: Why do you want this grant</div>
                            <div id="response"> Cuz i like money</div>
                        </div>
                        <div id="field2">
                            <div id="question" className="font-bold italic">Question: What would you use the money for</div>
                            <div id="response">A. Idk buy some food</div>
                        </div>
                        <div id="field3">
                            <div id="question" className="font-bold italic">Question: How much funding are you requesting</div>
                            <div id="response">A. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis rutrum erat libero, viverra aliquet ante sagittis ac. Fusce auctor suscipit sapien, eget molestie ante congue eget. Sed tincidunt est a scelerisque posuere. Pellentesque bibendum sit amet tellus at blandit. Nam gravida nulla sem, in porta libero porttitor a.</div>
                        </div>
                    </div>
                </div>
                <div id="right-col" className="flex flex-col w-1/2 gap-4">
                    <div id="grant-info-container" className="flex flex-col p-2 border-2 rounded border-magnify-blue">
                        <span className="text-lg">Grant Info</span>
                        <div id="grant-title" className="flex flex-row justify-between">
                            <span>Title:</span>
                            <span>UTAPS</span>
                        </div>
                        <div id="grant-description" className="flex flex-row justify-between">
                            <span>Description:</span>
                            <span>UTAPS</span>
                        </div>
                        <div id="grant-category" className="flex flex-row justify-between">
                            <span>Category:</span>
                            <span>Education</span>
                        </div>
                        <div id="grant-funding" className="flex flex-row justify-between">
                            <span>Funding Amount:</span>
                            <span>1000-5000</span>
                        </div>
                        <div id="grant-deadline" className="flex flex-row justify-between">
                            <span>Deadline:</span>
                            <span>June 30, 2024</span>
                        </div>
                    </div>
                    <div id="notes" className="p-1 h-full">
                        <textarea
                            className='outline outline-2 outline-magnify-blue p-2 w-full h-full rounded'
                            placeholder="Application notes."
                            onChange={(e) => {}}
                        />
                    </div>
                    
                </div>
            </div>
            <div id="actions" className="flex flex-row justify-between px-8 pt-4">
                <button id="reject" className="bg-magnify-blue py-5 px-10 rounded-xl text-white font-bold hover:bg-magnify-dark-blue transition ease-in-out duration-200"
                    onClick={rejectApplication}
                >
                    Reject
                </button>
                <button id="submit review" className="bg-magnify-blue py-5 px-10 rounded-xl text-white font-bold hover:bg-magnify-dark-blue transition ease-in-out duration-200"
                    onClick={submitApplicationReview}
                >
                    Submit Review
                </button>
                <button id="approve" className="bg-magnify-blue py-5 px-10 rounded-xl text-white font-bold hover:bg-magnify-dark-blue transition ease-in-out duration-200"
                    onClick={approveApplication}
                >
                    Approve
                </button>
            </div>
        </div>
    );
};

export default ApplicationReview;