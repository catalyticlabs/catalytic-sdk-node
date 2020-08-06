import { CatalyticSDKAPIModels } from '../../../internal/lib/catalyticSDKAPI';

export default class IntegrationConfiguration implements CatalyticSDKAPIModels.IntegrationConfiguration {
    /**
     * Client Id corresponding to the custom OAuth application
     */
    clientId: string;
    /**
     * Client Secret corresponding to the custom OAuth application
     */
    clientSecret: string;
    /**
     * Token Path corresponding to the custom OAuth application
     */
    tokenPath: string;
    /**
     * Token Revoke Path corresponding to the custom OAuth application
     */
    revokePath: string;
    /**
     * The site corresponding to the custom OAuth application
     */
    site: string;
    /**
     * The Authorization base url corresponding to the custom OAuth application
     */
    authorizeBaseUrl: string;
    /**
     * The scopes corresponding to the custom OAuth application
     */
    scopes?: string[];
    /**
     * Whether to supply authorization credentials in the body of the request
     */
    useBodyAuth?: boolean;
}
