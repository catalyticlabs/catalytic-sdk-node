import { CatalyticSDKAPIModels } from '../internal/lib/catalyticSDKAPI';

export default class BasePage {
    /**
     *
     */
    nextPageOptions?: PagingOptions;
    /**
     *
     */
    nextPageToken?: string;
    /**
     *
     */
    count?: number;
}

export class PagingOptions implements CatalyticSDKAPIModels.PagingOptions {
    /**
     * The page size of search results
     */
    size?: number;
    /**
     * A token used to retrieve the next page of results
     */
    pageToken?: string;
    /**
     * Indicates whether all results should be retrieved
     */
    getAllResults?: boolean;
}
