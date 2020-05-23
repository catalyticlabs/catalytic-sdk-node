import { CatalyticSDKAPIModels } from '../internal/lib/catalyticSDKAPI';
import BasePage from './BasePage';
import { Credentials } from '.';

export default class CredentialsPage extends BasePage implements CatalyticSDKAPIModels.CredentialsPage {
    /**
     * The List of Credentials
     */
    credentials?: Credentials[];
}
