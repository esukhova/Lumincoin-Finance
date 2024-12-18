import {HttpUtils} from "../utils/http-utils";
import {AuthUtils} from "../utils/auth-utils";

export class AuthService {

    static async logIn(data) {
        const result = await HttpUtils.request('/login', 'POST', false, data);

        if (result.error || !result.response || (result.response && (!result.response.tokens || !result.response.user))) {
            return false;
        }

        return result.response;
    }

    static async signUp(data) {
        const result = await HttpUtils.request('/signup', 'POST', false, data);

        if (result.error || !result.response || (result.response && !result.response.user)) {
            return false;
        }

        return result.response;
    }

    static async logOut(data) {
        const result = await HttpUtils.request('/logout', 'POST', false, data);
    }
}