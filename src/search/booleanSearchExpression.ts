import { CatalyticSDKAPIModels } from '../internal/lib/catalyticSDKAPI';

export default class BooleanSearchExpression implements CatalyticSDKAPIModels.BoolSearchExpression {
    isEqualTo?: boolean;

    getIsEqualTo(): boolean {
        return this.isEqualTo;
    }

    setIsEqualTo(isEqualTo: boolean): void {
        this.isEqualTo = isEqualTo;
    }
}
