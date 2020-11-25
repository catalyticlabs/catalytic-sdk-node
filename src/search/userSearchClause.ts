// import {
//     // UserSearchClause,
//     GuidSearchExpression as GuidSearchExpressionType,
//     StringSearchExpression as StringSearchExpressionType,
//     BooleanSearchExpression as BooleanSearchExpressionType,
//     DateTimeSearchExpression as DateTimeSearchExpressionType,
//     DateTimeRange as DateTimeRangeType
// } from '../types';

import GuidSearchExpression from './guidSearchExpression';
import StringSearchExpression from './stringSearchExpression';
import BooleanSearchExpression from './booleanSearchExpression';
import DateTimeSearchExpression from './dateTimeSearchExpression';
import DateTimeRange from './dateTimeRange';

/**
 * Class used to create search criteria for searching Users
 */
export default class UserSearchClause {
    and: UserSearchClause[];
    or: UserSearchClause[];
    id: GuidSearchExpression;
    email: StringSearchExpression;
    fullName: StringSearchExpression;
    isTeamAdmin: BooleanSearchExpression;
    isDeactivated: BooleanSearchExpression;
    isLockedOut: BooleanSearchExpression;
    createdDate: DateTimeSearchExpression;

    getAnd(): UserSearchClause[] {
        return this.and;
    }

    setAnd(and: UserSearchClause[]): void {
        this.and = and;
    }

    getOr(): UserSearchClause[] {
        return this.or;
    }

    setOr(or: UserSearchClause[]): void {
        this.or = or;
    }

    getId(): GuidSearchExpression {
        return this.id;
    }

    setId(id: string): void {
        const idExpression = new GuidSearchExpression();
        idExpression.setIsEqualTo(id);
        this.id = idExpression;
    }

    getEmail(): StringSearchExpression {
        return this.email;
    }

    setEmail(email: string): void {
        const emailExpression = new StringSearchExpression();
        emailExpression.setIsEqualTo(email);
        this.email = emailExpression;
    }

    setEmailContains(emailContains: string): void {
        const emailExpression = new StringSearchExpression();
        emailExpression.setContains(emailContains);
        this.email = emailExpression;
    }

    getFullName(): StringSearchExpression {
        return this.fullName;
    }

    setFullName(fullName: string): void {
        const fullNameExpression = new StringSearchExpression();
        fullNameExpression.setIsEqualTo(fullName);
        this.fullName = fullNameExpression;
    }

    setFullNameContains(fullNameContains: string): void {
        const fullNameExpression = new StringSearchExpression();
        fullNameExpression.setContains(fullNameContains);
        this.fullName = fullNameExpression;
    }

    getIsTeamAdmin(): BooleanSearchExpression {
        return this.isTeamAdmin;
    }

    setIsTeamAdmin(isTeamAdmin: boolean): void {
        const isTeamAdminExpression = new BooleanSearchExpression();
        isTeamAdminExpression.setIsEqualTo(isTeamAdmin);
        this.isTeamAdmin = isTeamAdminExpression;
    }

    getIsDeactivated(): BooleanSearchExpression {
        return this.isDeactivated;
    }

    setIsDeactivated(isDeactivated: boolean): void {
        const isDeactivatedExpression = new BooleanSearchExpression();
        isDeactivatedExpression.setIsEqualTo(isDeactivated);
        this.isDeactivated = isDeactivatedExpression;
    }

    getIsLockedOut(): BooleanSearchExpression {
        return this.isLockedOut;
    }

    setIsLockedOut(isLockedOut: boolean): void {
        const isLockedOutExpression = new BooleanSearchExpression();
        isLockedOutExpression.setIsEqualTo(isLockedOut);
        this.isLockedOut = isLockedOutExpression;
    }

    getCreatedDate(): DateTimeSearchExpression {
        return this.createdDate;
    }

    setCreatedDate(createdDate: Date): void {
        const createdDateExpression = new DateTimeSearchExpression();
        createdDateExpression.setIsEqualTo(createdDate);
        this.createdDate = createdDateExpression;
    }

    setCreatedDateBetween(start: Date, end: Date): void {
        const createdDateExpression = new DateTimeSearchExpression();
        const between = new DateTimeRange(start, end);
        createdDateExpression.setBetween(between);
        this.createdDate = createdDateExpression;
    }
}
