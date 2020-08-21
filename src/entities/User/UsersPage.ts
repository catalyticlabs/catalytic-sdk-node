import { CatalyticSDKAPIModels } from '../../internal/lib/catalyticSDKAPI';
import BasePage from '../BasePage';
import { User } from '..';

export default class UsersPage extends BasePage implements CatalyticSDKAPIModels.UsersPage {
    /**
     * The List of Users
     */
    users?: User[];
}
