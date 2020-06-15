import { CatalyticSDKAPIModels } from '../internal/lib/catalyticSDKAPI';
import BasePage from './BasePage';
import { InstanceStep } from '.';

export default class InstanceStepsPage extends BasePage implements CatalyticSDKAPIModels.InstanceStepsPage {
    /**
     * The List of InstanceSteps
     */
    steps?: InstanceStep[];
}
