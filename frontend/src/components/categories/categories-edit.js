import {AuthUtils} from "../../utils/auth-utils";
import {UrlUtils} from "../../utils/url-utils";
import {CategoriesService} from "../../services/categories-service";

export class CategoriesEdit {
    constructor(openNewRoute, type) {
        this.openNewRoute = openNewRoute;
        this.type = type;

        if (!AuthUtils.getAuthInfo(AuthUtils.accessTokenKey) || !AuthUtils.getAuthInfo(AuthUtils.refreshTokenKey)) {
            return this.openNewRoute('/login');
        }

        this.id = UrlUtils.getUrlParam('id');
        if (!this.id) {
            return this.openNewRoute('/');
        }

        this.titleInput = document.getElementById('title-input');

        this.getTitleOfCategory(this.id).then();

        document.getElementById('editBtn').addEventListener('click', this.editCategory.bind(this));
    }

    async getTitleOfCategory(id) {

        const response = await CategoriesService.getCategory(this.type, id);
        if (response.error) {
            alert(response.error);
            return response.redirect ? this.openNewRoute(response.redirect) : null;
        }

        this.titleInput.value = response.category.title;
    }

    async editCategory(e) {

        const editData = {
            title: this.titleInput.value
        }

        const response = await CategoriesService.editCategory(this.type, this.id, editData);
        if (response.error) {
            alert(response.error);
            return response.redirect ? this.openNewRoute(response.redirect) : null;
        }

        return this.openNewRoute('/categories/' + this.type);

    }
}