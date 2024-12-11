import {AuthUtils} from "../../utils/auth-utils";

export class IncomeCreate {
    constructor(openNewRoute) {
        this.openNewRoute = openNewRoute;

        //Исправить
        if (!AuthUtils.getAuthInfo(AuthUtils.accessTokenKey) || !AuthUtils.getAuthInfo(AuthUtils.refreshTokenKey)) {
            return this.openNewRoute('/login');
        }
        //

    }
}