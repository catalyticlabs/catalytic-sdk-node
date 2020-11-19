// import { UserSearchClause as UserSearchClauseType } from '../types';
import UserSearchClause from './userSearchClause';

/**
 * Class used to build queries for searching for Users
 */
export default class UsersWhere {
    /**
     * Search by multiple criteria
     *
     * @param   {UserSearchClause[]} andCriteria    Search criteria to search for Users by
     * @return  {UserSearchClause}                  The search clause
     */
    and(...andCriteria: UserSearchClause[]): UserSearchClause {
        const userSearchClause = new UserSearchClause();
        userSearchClause.setAnd(andCriteria);
        return userSearchClause;
    }

    /**
     * Search by multiple criteria
     *
     * @param   {UserSearchClause[]} orCriteria Search criteria to search for Users by
     * @return  {UserSearchClause}              The search clause
     */
    or(...orCriteria: UserSearchClause[]): UserSearchClause {
        const userSearchClause = new UserSearchClause();
        userSearchClause.setOr(orCriteria);
        return userSearchClause;
    }

    /**
     * Search by id
     *
     * @param   {string} id         The id to search for Users by
     * @return  {UserSearchClause}  The search clause
     */
    id(id: string): UserSearchClause {
        const userSearchClause = new UserSearchClause();
        userSearchClause.setId(id);
        return userSearchClause;
    }

    /**
     * Search by email
     *
     * @param   {string} email      The email to search for Users by
     * @return  {UserSearchClause}  The search clause
     */
    email(email: string): UserSearchClause {
        const userSearchClause = new UserSearchClause();
        userSearchClause.setEmail(email);
        return userSearchClause;
    }

    /**
     * Search by partial email
     *
     * @param   {string} email      The partial email to search for Users by
     * @return  {UserSearchClause}  The search clause
     */
    emailContains(email: string): UserSearchClause {
        const userSearchClause = new UserSearchClause();
        userSearchClause.setEmailContains(email);
        return userSearchClause;
    }

    /**
     * Search by full name
     *
     * @param   {string} fullName   The fullName to search for Users by
     * @return  {UserSearchClause}  The search clause
     */
    fullName(fullName: string): UserSearchClause {
        const userSearchClause = new UserSearchClause();
        userSearchClause.setFullName(fullName);
        return userSearchClause;
    }

    /**
     * Search by partial full name
     *
     * @param   {string} fullName   The partial full name to search for Users by
     * @return  {UserSearchClause}  The search clause
     */
    fullNameContains(fullName: string): UserSearchClause {
        const userSearchClause = new UserSearchClause();
        userSearchClause.setFullNameContains(fullName);
        return userSearchClause;
    }

    /**
     * Search by team admin
     *
     * @param   {boolean} isTeamAdmin   The team admin to search for Users by
     * @return  {UserSearchClause}      The search clause
     */
    isTeamAdmin(isTeamAdmin: boolean): UserSearchClause {
        const userSearchClause = new UserSearchClause();
        userSearchClause.setIsTeamAdmin(isTeamAdmin);
        return userSearchClause;
    }

    /**
     * Search by deactivated
     *
     * @param   {boolean} isDeactivated The deactivated to search for Users by
     * @return  {UserSearchClause}      The search clause
     */
    isDeactivated(isDeactivated: boolean): UserSearchClause {
        const userSearchClause = new UserSearchClause();
        userSearchClause.setIsDeactivated(isDeactivated);
        return userSearchClause;
    }

    /**
     * Search by locked out
     *
     * @param   {boolean} isLockedOut   The locked out to search for Users by
     * @return  {UserSearchClause}      The search clause
     */
    isLockedOut(isLockedOut: boolean): UserSearchClause {
        const userSearchClause = new UserSearchClause();
        userSearchClause.setIsLockedOut(isLockedOut);
        return userSearchClause;
    }

    /**
     * Search by created date
     *
     * @param   {Date} createdDate  The created date to search for Users by
     * @return  {UserSearchClause}  The search clause
     */
    createdDate(createdDate: Date): UserSearchClause {
        const userSearchClause = new UserSearchClause();
        userSearchClause.setCreatedDate(createdDate);
        return userSearchClause;
    }

    /**
     * Search by a range of created dates
     *
     * @param   {Date} start        The inclusive start date to search for Users by
     * @param   {Date} end          The inclusive end date to search for Users by
     * @return  {UserSearchClause}  The search clause
     */
    createdDateBetween(start: Date, end: Date): UserSearchClause {
        const userSearchClause = new UserSearchClause();
        userSearchClause.setCreatedDateBetween(start, end);
        return userSearchClause;
    }
}
