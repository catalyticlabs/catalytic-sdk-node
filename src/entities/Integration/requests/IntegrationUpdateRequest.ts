import { CatalyticSDKAPIModels } from '../../../internal/lib/catalyticSDKAPI';
import IntegrationConfiguration from './IntegrationConfiguration';

export default class IntegrationUpdateRequest implements CatalyticSDKAPIModels.IntegrationUpdateRequest {
    /**
     * The updated name to apply to the Integration
     */
    name: string;

    /**
     * Updated Configuration settings for creating Connections with this Integration
     */
    config: IntegrationConfiguration;
}
