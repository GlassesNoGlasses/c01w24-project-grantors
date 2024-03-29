import { StarIcon } from "@heroicons/react/24/solid";
import { useEffect, useState } from "react";
import { useParams } from "react-router";
import ApplicationsController from "../../../controllers/ApplicationsController";
import { Application, ApplicationStatus } from "../../../interfaces/Application";
import { ApplicationReview as ApplicationReviewType } from "../../../interfaces/ApplicationReview";
import UserController from "../../../controllers/UserController";
import { Applicant } from "../../../interfaces/Applicant";
import { Grant, GrantQuestion, GrantQuestionType } from "../../../interfaces/Grant";
import GrantsController from "../../../controllers/GrantsController";
import ReviewController from "../../../controllers/ReviewController";
import { useUserContext } from "../../contexts/userContext";
import { useNavigate } from "react-router-dom";
import { DownloadWrapper } from "../../files/download/DownloadWrapper";
import FileController from "../../../controllers/FileController";
import { FSFile } from "../../../interfaces/FSFile";

const ApplicationReview = () => {
    const { user } = useUserContext();
    const { applicationID } = useParams();
    const [ application, setApplication ] = useState<Application | undefined>();
    const [ applicant, setApplicant ] = useState<Applicant | undefined>();
    const [ files, setFiles ] = useState<FSFile[]>([]);
    const [ grant, setGrant ] = useState<Grant | undefined>();
    const [ rating, setRating ] = useState<number>(0);
    const [ hoverRating, setHoverRating ] = useState<number>(0);
    const [ review, setReview ] = useState<string>('');
    const [ reviewed, setReviewed ] = useState<boolean>(false);
    const [ showError, setShowError ] = useState<boolean>(false);

    const navigate = useNavigate();

    const rejectApplication = () => {
        submitApplicationReview(ApplicationStatus.rejected);
    };

    const submitApplicationReview = (applicationStatus: ApplicationStatus) => {
        if (application && user) {
            ReviewController.submitReview({
                ID: '',
                applicationID: application.id,
                reviewerID: user.accountID,
                reviewText: review,
                rating: rating,
                applicationStatus: applicationStatus,

            }, user).then((success: boolean) => {
                if (success) {
                    setReviewed(true);
                } else {
                    console.log('Error submitting review');
                    setShowError(true);
                }
            });
        }
    };

    const approveApplication = () => {
        submitApplicationReview(ApplicationStatus.approved);
        navigate(`/applications/${applicationID}/funding`);
    };

    useEffect(() => {
        if (applicationID) {
            ApplicationsController.fetchApplication(applicationID).then((application: Application | undefined) => {
                if (application) {
                    setApplication(application);
                    return application;
                }
            });
        }
    }, [applicationID]);

    useEffect(() => {
        if (application && user) {
            if (application.status != ApplicationStatus.submitted) {
                setReviewed(true);
                ReviewController.fetchReview(application.id, user).then((review: ApplicationReviewType | undefined) => {
                    if (review) {
                        setHoverRating(review.rating);
                        setReview(review.reviewText);
                    }
                });
            }

            UserController.fetchApplicant(application.applicantID).then((applicant: Applicant | undefined) => {
                if (applicant) {
                    setApplicant(applicant);
                }
            });

            GrantsController.fetchGrant(application.grantID).then((grant: Grant | undefined) => {
                if (grant) {
                    setGrant(grant);
                }
            });

            FileController.fetchUserFSFiles(application.applicantID).then((files: FSFile[] | undefined) => {
                if (files) {
                    const neededFiles = files.filter((file: FSFile) => {
                        return application?.responses.some((response: GrantQuestion) => {
                            return response.answer?.includes(file.title);
                        });
                    });
                    setFiles(neededFiles);
                }
            });
        }

    }, [application, user]);


    const formatQuestionAnswer = (question: GrantQuestion) => {
        switch (question.type) {
            case GrantQuestionType.CHECKBOX:
                return question.answer?.split(',').join(', ');
            case GrantQuestionType.FILE:
                return question.answer ? 
                    <div className="flex flex-col">
                        {
                        question.answer.split(',').map((fileName: string) => {
                            const file: File | undefined = files.find((fsFile: FSFile) => fsFile.title === fileName)?.file;
                            return file ? <DownloadWrapper element={<span className="underline">{fileName}</span>} file={file} /> 
                            : 'Error loading file.'
                        })
                        }
                    </div>
                    : 'No file uploaded';
            default:
                return question.answer;
        }
    };

    return (
        <div className="p-10 pt-24">

            <div id="review-container" className="flex flex-col rounded-xl border-4 border-primary pb-8 bg-white
            shadow-2xl shadow-black">
                <div id="review-header" className="flex flex-row justify-between items-center px-8">
                    <span className="py-4 text-xl font-bold">Review Grant Application</span>
                    <div id="star-rating" className="flex flex-row items-center gap-3">
                        <span className="text-lg">Rating</span>
                        <div id="stars:">
                            {[1,2,3,4,5].map((star) => (
                                <button 
                                    type="button"
                                    key={star}
                                    onClick={() => reviewed || setRating(star)}
                                    onMouseEnter={() => reviewed || setHoverRating(star)}
                                    onMouseLeave={() => reviewed || setHoverRating(rating)} // set hoverRating to rating when not hovering
                                >
                                    <StarIcon className={`h-8 w-8 ${star <= hoverRating ? 'text-yellow-500' : 'text-gray-500'}`}/>
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
                <div className="flex flex-row justify-between px-8 gap-8">
                    <div id="application-info-container" className="flex flex-col w-3/4 gap-8">
                        <div id="applicant-info" className="flex flex-col border-2 rounded border-magnify-blue p-2">
                            <span className="text-lg">Applicant</span>
                            <div id="name" className="flex flex-row justify-between">
                                <span>Name:</span>
                                <span>{applicant ? applicant.firstName + ' ' + applicant.lastName : 'Applicant not found'}</span>
                            </div>
                            <div id="email" className="flex flex-row justify-between">
                                <span>Email:</span> 
                                <span>{applicant ? applicant.email : 'Applicant not found'}</span>
                            </div>
                        </div>
                        <ul id="application-fields" className="flex flex-col border-2 rounded border-magnify-blue p-2 gap-4">
                            {
                                application ? application.responses.map((grantQuestion: GrantQuestion, index: number) => (
                                    <li key={index}>
                                        <div id={`question-${index}`} className="font-bold italic">Question: {grantQuestion.question}</div>
                                        <div id={`response-${index}`}>{formatQuestionAnswer(grantQuestion)}</div>
                                    </li>
                                ))

                                : <div>Application not found</div>
                            }
                        </ul>
                    </div>
                    <div id="right-col" className="flex flex-col w-1/2 gap-4">
                        <div id="grant-info-container" className="flex flex-col p-2 border-2 rounded border-magnify-blue">
                            <span className="text-lg">Grant Info</span>
                            <div id="grant-title" className="flex flex-row justify-between">
                                <span>Title:</span>
                                <span>{grant ? grant.title : "Grant not found"}</span>
                            </div>
                            <div id="grant-description" className="flex flex-row justify-between gap-5">
                                <span>Description:</span>
                                <span className="text-right">{grant ? grant.description : "Grant not found."}</span>
                            </div>
                            <div id="grant-category" className="flex flex-row justify-between">
                                <span>Category:</span>
                                <span>{grant ? grant.category : "Grant not found."}</span>
                            </div>
                            <div id="grant-funding" className="flex flex-row justify-between">
                                <span>Funding Amount:</span>
                                <span>{grant ? grant.minAmount + " - " + grant.maxAmount : "Grant not found."}</span>
                            </div>
                            <div id="grant-deadline" className="flex flex-row justify-between">
                                <span>Deadline:</span>
                                <span>{grant ? grant.deadline.toLocaleDateString('en-GB', {
                                                    day: '2-digit',
                                                    month: 'short',
                                                    year: 'numeric'})
                                            : "Grant not found."}
                                </span>
                            </div>
                        </div>
                        <div id="notes" className="p-1 h-full">
                            <textarea
                                className='outline outline-2 outline-magnify-blue p-2 w-full h-full rounded'
                                placeholder="Application notes."
                                value={review}
                                onChange={(e) => setReview(e.target.value)}
                            />
                        </div>
                        
                    </div>
                </div>
                {
                reviewed ? 
                <div id="post-review-actions" className="flex flex-row justify-between px-8 pt-4 items-center">
                        <div className="flex flex-row items-center gap-5">
                            <span className="text-lg">Application reviewed!</span>
                            <button id="next-application" className={`py-5 px-10 button`}
                                onClick={rejectApplication}
                            >
                                Review Next Application
                            </button>
                        </div>
                        <button id="back-to-dashboard" className={`py-5 px-10 button`}
                            onClick={() => navigate("/")}
                        >
                            Back to Dashboard
                        </button>
                </div>
                : 
                <div id="actions" className="flex flex-row justify-around px-8 pt-10">
                        <button id="reject" className={`py-3 p-6 text-lg ${application && applicant && grant ? "button-reject" : "button-disabled" }`}
                            onClick={rejectApplication}
                        >
                            Reject
                        </button>
                        <button id="submit-review" className={`py-3 p-6 text-lg ${application && applicant && grant ? "button" : "button-disabled" }`}
                            onClick={() => submitApplicationReview(ApplicationStatus.submitted)}
                        >
                            Submit Review
                        </button>
                        <button id="approve" className={`py-3 p-6 text-lg ${application && applicant && grant ? "button-approve" : "button-disabled" }`}
                            onClick={approveApplication}
                        >
                            Approve
                        </button>
                    </div>
                }
                
            </div>
        </div>
    );
};

export default ApplicationReview;