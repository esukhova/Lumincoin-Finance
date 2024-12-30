import {AuthUtils} from "../../utils/auth-utils";
import {ValidationUtils} from "../../utils/validation-utils";
import {CategoriesService} from "../../services/categories-service";

export class CategoriesCreate {
    constructor(openNewRoute ,type) {
        this.openNewRoute = openNewRoute;
        this.type = type;

        if (!AuthUtils.getAuthInfo(AuthUtils.accessTokenKey) || !AuthUtils.getAuthInfo(AuthUtils.refreshTokenKey)) {
            return this.openNewRoute('/login');
        }

        this.titleElement = document.getElementById('title-input');
        this.existingCategoriesTitles = [];

        this.getCategories().then();

        document.getElementById('createBtn').addEventListener('click', this.createCategory.bind(this));
    }

    async getCategories() {

        const response = await CategoriesService.getCategories(this.type);
        if (response.error) {
            alert(response.error);
            return response.redirect ? this.openNewRoute(response.redirect) : null;
        }

        for (let i = 0; i < response.categories.length; i++) {
            this.existingCategoriesTitles.push(response.categories[i].title.toLowerCase());
        }
    }

    async createCategory() {

        if (ValidationUtils.validateNewCategory(this.titleElement, this.existingCategoriesTitles)) {

            const createData = {
                title: this.titleElement.value
            }
            const response = await CategoriesService.createCategory(this.type, createData);
            if (response.error) {
                alert(response.error);
                return response.redirect ? this.openNewRoute(response.redirect) : null;
            }

            return this.openNewRoute('/categories/' + this.type);
        }
    }
}