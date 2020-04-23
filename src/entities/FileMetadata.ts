import { CatalyticSDKAPIModels } from '../internal/lib/catalyticSDKAPI';

export default class FileMetadata implements CatalyticSDKAPIModels.FileMetadata {
    constructor(file?: CatalyticSDKAPIModels.FileMetadata) {
        if (file) {
            this.fromInternal(file);
        }
    }

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
    /**
     * The stringified ID of the File, used for
     * reference in a !:FilesPage
     */
    referenceName?: string;

    private fromInternal(file: CatalyticSDKAPIModels.FileMetadata): void {
        this.id = file.id;
        this.name = file.name;
        this.teamName = file.teamName;
        this.contentType = file.contentType;
        this.sizeInBytes = file.sizeInBytes;
        this.displaySize = file.displaySize;
        this.isPublic = file.isPublic;
        this.md5Hash = file.md5Hash;
        this.referenceName = file.referenceName;
    }
}
