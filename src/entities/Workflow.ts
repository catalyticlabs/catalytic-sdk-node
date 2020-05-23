import { CatalyticSDKAPIModels } from '../internal/lib/catalyticSDKAPI';
import Field from './Field';

import { FieldVisibility, InstanceVisibility } from './types';

export default class Workflow implements CatalyticSDKAPIModels.Workflow {
    /**
     * The unique ID of the Workflow
     */
    id: string;
    /**
     * The descriptive name of the Workflow
     */
    name: string;
    /**
     * The name of the team in which the Workflow is defined
     */
    teamName: string;
    /**
     * A description of what the Workflow does
     */
    description?: string;
    /**
     * A descriptive grouping for your Workflow
     */
    category?: string;
    /**
     * The email address of the user who owns this Workflow
     */
    owner?: string;
    /**
     * The email address of the user who created this Workflow
     */
    createdBy?: string;
    /**
     * A collection of the required and optional input fields that can be passed to this Workflow when starting it.
     */
    inputFields?: Field[];
    /**
     * Indicates whether the Workflow is published; if false, Workflow is in draft mode
     */
    isPublished?: boolean;
    /**
     * Indicates whether is Archived and no longer available for users to find, start or edit.
     */
    isArchived?: boolean;
    /**
     * The default visibility for Fields on this Workflow. Possible values include:
     * 'public', 'internal', 'confidential', 'highlyConfidential'
     */
    fieldVisibility?: FieldVisibility;
    /**
     * The default visibility of Instances of this Workflow. Possible values include:
     * 'open', 'restricted'
     */
    instanceVisibility?: InstanceVisibility;
    /**
     * The users who may view, start, and edit this Workflow in addition to the Workflow Owner
     */
    adminUsers?: string[];
    /**
     * The users who can view and start this Workflow
     */
    standardUsers?: string[];
    /**
     * The maximum number of steps that can appear in an Instance of this Workflow
     */
    taskCountLimit?: number;
    /**
     * The maximum number of fields that can appear in an Instance of this Workflow
     */
    fieldCountLimit?: number;
    /**
     * The maximum size of data stored in any field in an Instance of this Workflow
     */
    fieldSizeLimit?: number;
    /**
     * The maximum total size of data stored in all fields in an Instance of this Workflow
     */
    fieldTotalSizeLimit?: number;
    /**
     * The maximum number of rows of any data table created in an Instance of this Workflow
     */
    dataTableRowLimit?: number;
    /**
     * The maximum number of columns of any data table created in an Instance of this Workflow
     */
    dataTableColumnLimit?: number;
    /**
     * The maximum number of cells of any data table created in an Instance of this Workflow
     */
    dataTableCellLimit?: number;
}
