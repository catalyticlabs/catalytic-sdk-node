import { CatalyticSDKAPIModels } from '../../internal/lib/catalyticSDKAPI';
import BasePage from '../BasePage';
import { AccessToken } from '..';

export default class AccessTokensPage extends BasePage implements CatalyticSDKAPIModels.AccessTokensPage {
    /**
     * The List of Access Tokens
     */
    accessTokens?: AccessToken[];
}
