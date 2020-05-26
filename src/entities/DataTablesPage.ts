import { CatalyticSDKAPIModels } from '../internal/lib/catalyticSDKAPI';
import BasePage from './BasePage';
import { DataTable } from '.';

export default class DataTablesPage extends BasePage implements CatalyticSDKAPIModels.DataTablesPage {
    /**
     * The list of DataTables
     */
    dataTables?: DataTable[];
}
