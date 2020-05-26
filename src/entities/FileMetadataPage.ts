import { CatalyticSDKAPIModels } from '../internal/lib/catalyticSDKAPI';
import BasePage from './BasePage';
import { FileMetadata } from '.';

export default class FileMetadataPage extends BasePage implements CatalyticSDKAPIModels.FileMetadataPage {
    /**
     * The list of FileMetadata
     */
    files?: FileMetadata[];
}
