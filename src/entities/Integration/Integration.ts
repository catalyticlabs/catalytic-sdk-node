import { CatalyticSDKAPIModels } from '../../internal/lib/catalyticSDKAPI';
import { IntegrationConnection } from '..';
import Field from '../Field';

export default class Integration implements CatalyticSDKAPIModels.Integration {
    /**
     * The unique ID of the Integration
     */
    id?: string;
    /**
     * The Reference Name of the Integration
     */
    referenceName?: string;
    /**
     * The display Name of the Integration
     */
    name?: string;
    /**
     * Boolean indicating whether this Integration is custom to your Catalytic team.
     * Only custom Integrations can be updated using the SDK.
     */
    isCustomIntegration?: boolean;
    /**
     * The List of Integration Connections using this Integration
     */
    connections?: IntegrationConnection[];
    /**
     * The values required to create a new Connection of this Integration
     */
    connectionParams?: Field[];
}
