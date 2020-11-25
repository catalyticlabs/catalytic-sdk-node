import Field from '../Field';

import { InstanceStepStatus } from '../types';

export default class InstanceStep {
    /**
     * Unique ID of this Task
     */
    id: string;
    /**
     * Unique ID of this Instance to which this Step
     * belongs
     */
    instanceId: string;
    /**
     * Unique ID of the Workflow to which this Step
     * belongs
     */
    workflowId: string;
    /**
     * Display name of this Task
     */
    name: string;
    /**
     * The name of the Catalytic team in which this
     * Task exists
     */
    teamName: string;
    /**
     * The position of this Task amongst the other
     * Tasks in the Instance
     */
    position?: number;
    /**
     * A description or instructions of the Task
     */
    description?: string;
    /**
     * Possible values include: 'pending', 'active',
     * 'completed', 'cancelled', 'snoozed', 'skipped', 'error'
     */
    status?: InstanceStepStatus;
    /**
     * The start date of the step, or null if the step
     * has not started
     */
    startDate?: Date;
    /**
     * The end date of the step, or null if the step has
     * not started
     */
    endDate?: Date;
    /**
     * The email of the user (if any) that this
     * InstanceStep is assigned to
     */
    assignedTo?: string;
    /**
     *  A collection of the required and optional
     * output fields
     * that can be set by this InstanceStep when completing it.
     */
    outputFields?: Field[];
}
