import { CatalyticSDKAPIModels } from '../internal/lib/catalyticSDKAPI';
import { FieldRestrictions, FieldType } from './types';

export default class DataTableColumn implements CatalyticSDKAPIModels.DataTableColumn {
    /**
     * The name of this DataTableColumn
     */
    name?: string;
    /**
     * The type of cell data contained in this DataTableColumn.
     * Possible values include: 'undefined', 'text',
     * 'integer', 'decimal', 'date', 'dateTime', 'json', 'bool', 'singleChoice',
     * 'multipleChoice', 'instructions', 'file', 'table', 'workflow', 'instance',
     * 'user'
     */
    type?: FieldType;
    /**
     * The reference name of this DataTableColumn
     */
    referenceName?: string;
    /**
     * Restrictions for the cell data contained in the DataTableColumn
     */
    restrictions?: FieldRestrictions;
}
