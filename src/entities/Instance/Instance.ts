import Field from '../Field';
import InstanceStep from './InstanceStep';
import { InstanceStatus, FieldVisibility, Visibility } from '../types';
import { CatalyticSDKAPIModels } from '../../internal/lib/catalyticSDKAPI';

export default class Instance implements CatalyticSDKAPIModels.Instance {
    /**
     * The unique ID of the Instance
     */
    id: string;
    /**
     * The unique ID of the Workflow this Instance
     * was started from
     */
    workflowId: string;
    /**
     * The descriptive name of the Instance
     */
    name?: string;
    /**
     * The name of the Catalytic team in which this
     * Instance was started
     */
    teamName: string;
    /**
     * A description of the Instance
     */
    description?: string;
    /**
     * A descriptive grouping for the Instance
     */
    category?: string;
    /**
     * The email address of the user who owns this
     * Instance
     */
    owner?: string;
    /**
     * The email address of the user who created
     * this Instance
     */
    createdBy?: string;
    /**
     * A collection of the Tasks belonging to
     * this Instance
     */
    steps?: InstanceStep[];
    /**
     * A collection of the Fields belonging to this
     * Instance
     */
    fields?: Field[];
    /**
     * Possible values include: 'running',
     * 'completed', 'cancelled'
     */
    status?: InstanceStatus;
    /**
     * The start date of the instance
     */
    startDate?: Date;
    /**
     * The end date of the instance, or null if the step
     * has not started
     */
    endDate?: Date;
    /**
     * Possible values include:
     * 'public', 'internal', 'confidential', 'highlyConfidential'
     */
    fieldVisibility?: FieldVisibility;
    /**
     * Possible values include: 'open',
     * 'restricted'
     */
    visibility?: Visibility;
    /**
     * The users who can find and interact
     * with this Instance
     */
    visibleToUsers?: string[];
}
