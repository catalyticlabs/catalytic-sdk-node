import { CatalyticSDKAPIModels } from '../internal/lib/catalyticSDKAPI';

export default class DateTimeRange implements CatalyticSDKAPIModels.DateTimeOffsetNullableRange {
    lowerBoundInclusive?: Date;
    upperBoundInclusive?: Date;

    constructor(start: Date, end?: Date) {
        this.lowerBoundInclusive = start;
        this.upperBoundInclusive = end;
    }
}
