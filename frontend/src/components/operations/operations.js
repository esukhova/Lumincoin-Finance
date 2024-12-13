import {HttpUtils} from "../../utils/http-utils";
import {AuthUtils} from "../../utils/auth-utils";

export class Operations {
    constructor(openNewRoute) {
        this.openNewRoute = openNewRoute;

        //Исправить
        if (!AuthUtils.getAuthInfo(AuthUtils.accessTokenKey) || !AuthUtils.getAuthInfo(AuthUtils.refreshTokenKey)) {
            return this.openNewRoute('/login');
        }
        //

        this.getOperations().then();
    }

    async getOperations() {
        const result = await HttpUtils.request('/operations?period=all');
        if (result.redirect) {
            return this.openNewRoute(result.redirect);
        }

        if (result.error || !result.response || (result.response && result.response.error)) {
            return alert('Возникла ошибка при запросе данных. Обратитесь в поддержку');
        }

        this.showRecords(result.response);
    }

    showRecords(operations) {
        console.log(operations);
    }
}