import { CatalyticSDKAPIModels } from '../internal/lib/catalyticSDKAPI';
import BasePage from './BasePage';
import { Workflow } from '.';

export default class WorkflowsPage extends BasePage implements CatalyticSDKAPIModels.WorkflowsPage {
    /**
     * The List of Workflows
     */
    workflows?: Workflow[];
}
