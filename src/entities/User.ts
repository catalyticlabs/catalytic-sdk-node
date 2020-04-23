import { CatalyticSDKAPIModels } from '../internal/lib/catalyticSDKAPI';

export default class User implements CatalyticSDKAPIModels.User {
    constructor(user?: CatalyticSDKAPIModels.User) {
        if (user) {
            this.fromInternal(user);
        }
    }
    /**
     * Unique ID for the user
     */
    id: string;
    /**
     * Unique username of user
     */
    username?: string;
    /**
     * The email address associated with this user
     */
    email: string;
    /**
     * The user's full name
     */
    fullName: string;
    /**
     * The name of this User's Catalytic team
     */
    teamName: string;

    private fromInternal(user: CatalyticSDKAPIModels.User): void {
        this.id = user.id;
        this.username = user.username;
        this.email = user.email;
        this.fullName = user.fullName;
        this.teamName = user.teamName;
    }
}
