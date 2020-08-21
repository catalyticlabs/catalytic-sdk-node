import { CatalyticSDKAPIModels } from '../../../internal/lib/catalyticSDKAPI';
import { ReferenceableFieldInput } from '../../../types';

export default class IntegrationConnectionCreationRequest
    implements CatalyticSDKAPIModels.IntegrationConnectionCreationRequest {
    /**
     * The Id of the Integration with which the Connection will be created
     */
    integrationId?: string;
    /**
     * The display Name to apply to the new Integration Connection
     */
    name?: string;
    /**
     * Parameters used to create an Integration Connection
     */
    connectionParams?: ReferenceableFieldInput[];
}
