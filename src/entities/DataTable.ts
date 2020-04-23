import { CatalyticSDKAPIModels } from '../internal/lib/catalyticSDKAPI';
import DataTableColumn from './DataTableColumn';
import { DataTableType, Visibility } from './types';

export default class DataTable implements CatalyticSDKAPIModels.DataTable {
    constructor(dataTable?: CatalyticSDKAPIModels.DataTable) {
        if (dataTable) {
            this.fromInternal(dataTable);
        }
    }

    /**
     * The unique ID of the Data Table
     */
    id: string;
    /**
     * Alias for `Id`
     */
    dataTableId?: string;
    /**
     * Gets a unique reference name for this Data Table
     */
    referenceName?: string;
    /**
     * The descriptive name of the Data Table
     */
    name: string;
    /**
     * The name of the team in which the Data Table is defined
     */
    teamName: string;
    /**
     * A description of what kind of data is stored in the Table
     */
    description?: string;
    /**
     * The ordered names of the columns in this Data Table
     */
    columns?: DataTableColumn[];
    /**
     * Whether or not this table is archived and excluded from default searches
     */
    isArchived?: boolean;
    /**
     * The type of this Data Table. Possible values include:
     * 'imported', 'master', 'application', 'instance', 'batch'
     */
    type?: DataTableType;
    /**
     * The default visibility of cells in this Data Table. Possible values include:
     * 'open', 'restricted'
     */
    visibility?: Visibility;
    /**
     * The users who can find and modify this Data Table
     */
    visibleToUsers?: string[];
    /**
     * The maximum number of rows in this Data Table
     */
    rowLimit?: number;
    /**
     * The maximum number of columns in this Data Table
     */
    columnLimit?: number;
    /**
     * The maximum number of cells in this Data Table
     */
    cellLimit?: number;

    private fromInternal(dataTable: CatalyticSDKAPIModels.DataTable): void {
        this.id = dataTable.id;
        this.dataTableId = dataTable.dataTableId;
        this.referenceName = dataTable.referenceName;
        this.name = dataTable.name;
        this.teamName = dataTable.teamName;
        this.description = dataTable.description;
        this.columns = dataTable.columns;
        this.isArchived = dataTable.isArchived;
        this.type = dataTable.type;
        this.visibility = dataTable.visibility;
        this.visibleToUsers = dataTable.visibleToUsers;
        this.rowLimit = dataTable.rowLimit;
        this.columnLimit = dataTable.columnLimit;
        this.cellLimit = dataTable.cellLimit;
    }
}
