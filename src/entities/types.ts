export type DataTableType = 'imported' | 'master' | 'application' | 'instance' | 'batch';

export interface FieldRestrictions {
    /**
     * A set of valid choices for this field. If set, FieldType must be
     * SingleChoice or MultipleChoice
     */
    choices?: string[];
    /**
     * Indicates whether null or empty values will be rejected
     */
    valueRequired?: boolean;
}

export type FieldType =
    | 'undefined'
    | 'text'
    | 'integer'
    | 'decimal'
    | 'date'
    | 'dateTime'
    | 'json'
    | 'bool'
    | 'singleChoice'
    | 'multipleChoice'
    | 'instructions'
    | 'file'
    | 'table'
    | 'workflow'
    | 'instance'
    | 'user';

export type FieldVisibility = 'public' | 'internal' | 'confidential' | 'highlyConfidential';

export type InstanceStatus = 'running' | 'completed' | 'cancelled';

export type InstanceStepStatus = 'pending' | 'active' | 'completed' | 'cancelled' | 'snoozed' | 'skipped' | 'error';

export type InstanceVisibility = 'open' | 'restricted';

export type Visibility = 'open' | 'restricted';
