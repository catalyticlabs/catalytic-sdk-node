import Field from './Field';
import InstanceStep from './InstanceStep';
import { InstanceStatus, FieldVisibility, Visibility } from './types';
import { CatalyticSDKAPIModels } from '../internal/lib/catalyticSDKAPI';

export default class Instance implements CatalyticSDKAPIModels.Instance {
    /**
     * @member {string} id The unique ID of the Instance
     */
    id: string;
    /**
     * @member {string} workflowId The unique ID of the Workflow this Instance
     * was started from
     */
    workflowId: string;
    /**
     * @member {string} [name] The descriptive name of the Instance
     */
    name?: string;
    /**
     * @member {string} teamName The name of the Catalytic team in which this
     * Instance was started
     */
    teamName: string;
    /**
     * @member {string} [description] A description of the Instance
     */
    description?: string;
    /**
     * @member {string} [category] A descriptive grouping for the Instance
     */
    category?: string;
    /**
     * @member {string} [owner] The email address of the user who owns this
     * Instance
     */
    owner?: string;
    /**
     * @member {string} [createdBy] The email address of the user who created
     * this Instance
     */
    createdBy?: string;
    /**
     * @member {InstanceStep[]} [steps] A collection of the Tasks belonging to
     * this Instance
     */
    steps?: InstanceStep[];
    /**
     * @member {Field[]} [fields] A collection of the Fields belonging to this
     * Instance
     */
    fields?: Field[];
    /**
     * @member {InstanceStatus} [status] Possible values include: 'running',
     * 'completed', 'cancelled'
     */
    status?: InstanceStatus;
    /**
     * @member {FieldVisibility} [fieldVisibility] Possible values include:
     * 'public', 'internal', 'confidential', 'highlyConfidential'
     */
    fieldVisibility?: FieldVisibility;
    /**
     * @member {Visibility} [visibility] Possible values include: 'open',
     * 'restricted'
     */
    visibility?: Visibility;
    /**
     * @member {string[]} [visibleToUsers] The users who can find and interact
     * with this Instance
     */
    visibleToUsers?: string[];
}
