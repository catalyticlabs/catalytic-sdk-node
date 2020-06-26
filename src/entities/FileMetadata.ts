import { CatalyticSDKAPIModels } from '../internal/lib/catalyticSDKAPI';

export default class FileMetadata implements CatalyticSDKAPIModels.FileMetadata {
    /**
     * The unique ID of the File in Catalytic
     */
    id?: string;
    /**
     * The name of the File
     */
    name?: string;
    /**
     * The name of the Catalytic team with which the
     * File is associated
     */
    teamName?: string;
    /**
     * The content-type of the File
     */
    contentType?: string;
    /**
     * The size of the File, in bytes
     */
    sizeInBytes?: number;
    /**
     * The human-readable size of the File
     */
    displaySize?: string;
    /**
     * Boolean indicating whether the File can be
     * downloaded by unauthenticated users
     */
    isPublic?: boolean;
    /**
     * The MD5 hash of the File
     */
    md5Hash?: string;
}
