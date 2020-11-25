import { CatalyticSDKAPIModels } from '../internal/lib/catalyticSDKAPI';

export default class GuidSearchExpression implements CatalyticSDKAPIModels.GuidSearchExpression {
    isEqualTo: string;

    getIsEqualTo(): string {
        return this.isEqualTo;
    }

    setIsEqualTo(isEqualTo: string): void {
        this.isEqualTo = isEqualTo;
    }
}
