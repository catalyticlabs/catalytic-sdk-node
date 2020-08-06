import { CatalyticSDKAPIModels } from '../../../internal/lib/catalyticSDKAPI';
import IntegrationConfiguration from './IntegrationConfiguration';

export default class IntegrationCreationRequest implements CatalyticSDKAPIModels.IntegrationCreationRequest {
    /**
     * The name to apply to the new Integration
     */
    name: string;

    /**
     * Configuration settings for creating Connections with this Integration
     */
    config: IntegrationConfiguration;
}
