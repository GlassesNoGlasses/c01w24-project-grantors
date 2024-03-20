import { SERVER_PORT } from "../constants/ServerConstants";
import { ApplicationReview } from "../interfaces/ApplicationReview";
import { CreateObjectResponse } from "../interfaces/ServerResponse";
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
};