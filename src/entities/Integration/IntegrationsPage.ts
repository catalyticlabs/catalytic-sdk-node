import { CatalyticSDKAPIModels } from '../../internal/lib/catalyticSDKAPI';
import BasePage from '../BasePage';
import { Integration } from '..';

export default class IntegrationsPage extends BasePage implements CatalyticSDKAPIModels.IntegrationsPage {
    /**
     * The list of Integrations
     */
    integrations?: Integration[];
}
