import { VFileCompatible } from 'vfile';

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

export enum FieldTypeEnumeration {
    bool = 'bool',
    date = 'date',
    dateTime = 'dateTime',
    decimal = 'decimal',
    file = 'file',
    instance = 'instance',
    instructions = 'instructions',
    integer = 'integer',
    json = 'json',
    multipleChoice = 'multipleChoice',
    password = 'password',
    singleChoice = 'singleChoice',
    table = 'table',
    text = 'text',
    undefined = 'undefined',
    user = 'user',
    workflow = 'workflow'
}

export type FieldType = FieldTypeEnumeration | keyof typeof FieldTypeEnumeration;

export type FieldVisibility = 'public' | 'internal' | 'confidential' | 'highlyConfidential';

export type FileDescriptor = VFileCompatible;

export type InstanceStatus = 'running' | 'completed' | 'cancelled';

export type InstanceStepStatus = 'pending' | 'active' | 'completed' | 'cancelled' | 'snoozed' | 'skipped' | 'error';

export type InstanceVisibility = 'open' | 'restricted';

export type Visibility = 'open' | 'restricted';
