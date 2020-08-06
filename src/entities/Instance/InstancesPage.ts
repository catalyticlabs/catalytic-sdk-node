import { CatalyticSDKAPIModels } from '../../internal/lib/catalyticSDKAPI';
import BasePage from '../BasePage';
import { Instance } from '..';

export default class InstancesPage extends BasePage implements CatalyticSDKAPIModels.InstancesPage {
    /**
     * The List of Instances
     */
    instances?: Instance[];
}
