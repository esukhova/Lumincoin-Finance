import {AuthUtils} from "../../utils/auth-utils";

export class ExpenseCreate {
    constructor(openNewRoute) {
        this.openNewRoute = openNewRoute;

        //Исправить
        if (!AuthUtils.getAuthInfo(AuthUtils.accessTokenKey) || !AuthUtils.getAuthInfo(AuthUtils.refreshTokenKey)) {
            return this.openNewRoute('/login');
        }
        //

    }
}