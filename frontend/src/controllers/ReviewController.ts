import { SERVER_PORT } from "../constants/ServerConstants";
import { ApplicationReview } from "../interfaces/ApplicationReview";
import { CreateObjectResponse, GetReviewResponse } from "../interfaces/ServerResponse";
import { User } from "../interfaces/User";

export default class ReviewController {

    static async submitReview(review: ApplicationReview, user: User): Promise<boolean> {
        try {
            const res = await fetch(`http://localhost:${SERVER_PORT}/review`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${user.authToken}`
                },
                body: JSON.stringify(review),
            });

            if (!res.ok) {
                console.error("Server error submitting review", res);
            }

            return res.ok;
        } catch (error) {
            console.error("Error submitting review", error);
            return false;
        }
    };

    static async fetchReview(applicationID: string, user: User): Promise<ApplicationReview | undefined> {
        try {
            const res = await fetch(`http://localhost:${SERVER_PORT}/review/${applicationID}`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${user.authToken}`
                }
            });

            return await res.json().then((data: GetReviewResponse) => {
                if (data.response) {
                    return data.response;
                }
                console.error("Server error fetching review:", data.error);
            });
        } catch (error) {
            console.error("Error fetching review", error);
        }
    }
};