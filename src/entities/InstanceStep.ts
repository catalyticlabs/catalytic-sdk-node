import Field from './Field';

import { InstanceStepStatus } from './types';

export default class InstanceStep {
    /**
     * @member {string} id Unique ID of this Task
     */
    id: string;
    /**
     * @member {string} instanceId Unique ID of this Instance to which this Step
     * belongs
     */
    instanceId: string;
    /**
     * @member {string} workflowId Unique ID of the Workflow to which this Step
     * belongs
     */
    workflowId: string;
    /**
     * @member {string} name Display name of this Task
     */
    name: string;
    /**
     * @member {string} teamName The name of the Catalytic team in which this
     * Task exists
     */
    teamName: string;
    /**
     * @member {number} [position] The position of this Task amongst the other
     * Tasks in the Instance
     */
    position?: number;
    /**
     * @member {string} [description] A description or instructions of the Task
     */
    description?: string;
    /**
     * @member {InstanceStepStatus} [status] Possible values include: 'pending', 'active',
     * 'completed', 'cancelled', 'snoozed', 'skipped', 'error'
     */
    status?: InstanceStepStatus;
    /**
     * @member {string} [assignedTo] The email of the user (if any) that this
     * InstanceStep is assigned to
     */
    assignedTo?: string;
    /**
     * @member {Field[]} [outputFields] A collection of the required and optional
     * output fields
     * that can be set by this InstanceStep when completing it.
     */
    outputFields?: Field[];
}
