import { CatalyticSDKAPIModels } from '../../internal/lib/catalyticSDKAPI';

export default class IntegrationConnection implements CatalyticSDKAPIModels.IntegrationConnection {
    /**
     * The unique Id of the Integration Connection
     */
    id?: string;
    /**
     * The display Name of the Integration Connection
     */
    name?: string;
    /**
     * The unique Reference Name of the Integration Connection
     */
    referenceName?: string;
    /**
     * The Id of the Integration Definition with which this Integration Connection was created
     */
    integrationId?: string;
}
