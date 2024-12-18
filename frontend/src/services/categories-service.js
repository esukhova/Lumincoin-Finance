import {HttpUtils} from "../utils/http-utils";

export class CategoriesService {

    static async getCategories(type) {

        const returnObject = {
            error: false,
            redirect: null,
            categories: null
        };

        const result = await HttpUtils.request('/categories/' + type);

        if (result.redirect || result.error || !result.response || (result.response && result.response.error)) {
            returnObject.error = 'Возникла ошибка при запросе категорий. Обратитесь в поддержку';
            if (result.redirect) {
                returnObject.redirect = result.redirect;
            }
            return returnObject;
        }

        returnObject.categories = result.response;
        return returnObject;
    }

    static async getCategory(type, id) {

        const returnObject = {
            error: false,
            redirect: null,
            category: null
        };

        const result = await HttpUtils.request('/categories/' + type + '/' + id);

        if (result.redirect || result.error || !result.response || (result.response && result.response.error)) {
            returnObject.error = 'Возникла ошибка при запросе данных. Обратитесь в поддержку';
            if (result.redirect) {
                returnObject.redirect = result.redirect;
            }
            return returnObject;
        }

        returnObject.category = result.response;
        return returnObject;
    }

    static async createCategory(type, data) {

        const returnObject = {
            error: false,
            redirect: null
        };

        const result = await HttpUtils.request('/categories/' + type, 'POST', true, data);

        if (result.redirect || result.error || !result.response || (result.response && result.response.error)) {
            returnObject.error = 'Возникла ошибка при сохранении категории. Обратитесь в поддержку';
            if (result.redirect) {
                returnObject.redirect = result.redirect;
            }
            return returnObject;
        }

        return returnObject;
    }

    static async deleteCategory(type, id) {

        const returnObject = {
            error: false,
            redirect: null
        };

        const result = await HttpUtils.request('/categories/' + type + '/' + id, 'DELETE', true);

        if (result.redirect || result.error || !result.response || (result.response && result.response.error)) {
            returnObject.error = 'Возникла ошибка при удалении категории. Обратитесь в поддержку';
            if (result.redirect) {
                returnObject.redirect = result.redirect;
            }
            return returnObject;
        }

        return returnObject;
    }

    static async editCategory(type, id, data) {

        const returnObject = {
            error: false,
            redirect: null
        };

        const result = await HttpUtils.request('/categories/' + type + '/' + id, 'PUT', true, data);

        if (result.redirect || result.error || !result.response || (result.response && result.response.error)) {
            returnObject.error = 'Возникла ошибка при редактировании категории. Обратитесь в поддержку';
            if (result.redirect) {
                returnObject.redirect = result.redirect;
            }
            return returnObject;
        }

        return returnObject;
    }
}