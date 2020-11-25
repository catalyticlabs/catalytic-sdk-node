import { CatalyticSDKAPIModels } from '../internal/lib/catalyticSDKAPI';
import StringRange from './stringRange';

export default class StringSearchExpression implements CatalyticSDKAPIModels.StringSearchExpression {
    isEqualTo?: string;
    between?: StringRange;
    contains?: string;

    getIsEqualTo(): string {
        return this.isEqualTo;
    }

    setIsEqualTo(isEqualTo: string): void {
        this.isEqualTo = isEqualTo;
    }

    getBetween(): StringRange {
        return this.between;
    }

    setBetween(between: StringRange): void {
        this.between = between;
    }

    getContains(): string {
        return this.contains;
    }

    setContains(contains: string): void {
        this.contains = contains;
    }
}
