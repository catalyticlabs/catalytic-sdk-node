import { CatalyticSDKAPIModels } from '../internal/lib/catalyticSDKAPI';
import DateTimeRange from './dateTimeRange';

export default class DateTimeSearchExpression implements CatalyticSDKAPIModels.DateTimeSearchExpression {
    isEqualTo?: Date;
    between?: DateTimeRange;
    contains?: Date;

    getIsEqualTo(): Date {
        return this.isEqualTo;
    }

    setIsEqualTo(isEqualTo: Date): void {
        this.isEqualTo = isEqualTo;
    }

    getBetween(): DateTimeRange {
        return this.between;
    }

    setBetween(between: DateTimeRange): void {
        this.between = between;
    }

    getContains(): Date {
        return this.contains;
    }

    setContains(contains: Date): void {
        this.contains = contains;
    }
}
