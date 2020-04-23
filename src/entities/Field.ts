import { FieldType, FieldRestrictions } from './types';
import { CatalyticSDKAPIModels } from '../internal/lib/catalyticSDKAPI';

export default class Field implements CatalyticSDKAPIModels.Field {
    /**
     * The unique ID of the field
     */
    id?: string;
    /**
     * The descriptive name of the Field
     */
    name?: string;
    /**
     * A unique name (within the scope of the
     * Workflow or Instance) that
     * can be used to reference the value of this field in
     * a template or operation.
     */
    referenceName?: string;
    /**
     * A description of this field. This can be
     * used as instructions
     * for users filling out this field in a form
     */
    description?: string;
    /**
     * The visual position of this field relative
     * others in the same scope
     */
    position?: number;
    /**
     * The restrictions for the value of this Field
     */
    restrictions?: FieldRestrictions;
    /**
     * The type of this Field's value. Possible values include:
     * 'undefined', 'text', 'integer', 'decimal', 'date', 'dateTime', 'json', 'bool',
     * 'singleChoice', 'multipleChoice', 'instructions', 'file', 'table',
     * 'workflow', 'instance', 'user'
     */
    fieldType?: FieldType;
    /**
     * The value of this field, serialized as a string
     */
    value?: string;
    /**
     * The optional default value of this field,
     * serialized as a string. The
     * serialization format depends on the type of field.
     */
    defaultValue?: string;
}
