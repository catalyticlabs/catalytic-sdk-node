import { CatalyticSDKAPIModels } from '../internal/lib/catalyticSDKAPI';

export default class StringRange implements CatalyticSDKAPIModels.StringRange {
    lowerBoundInclusive?: string;
    upperBoundInclusive?: string;
}
