import {UrlUtils} from "../../utils/url-utils";
import {CategoriesService} from "../../services/categories-service";
import {OperationsService} from "../../services/operations-servise";

export class CategoriesDelete {
    constructor(openNewRoute, type) {
        this.openNewRoute = openNewRoute;
        this.type = type;

        this.id = UrlUtils.getUrlParam('id');
        if (!this.id) {
            return this.openNewRoute('/');
        }

        this.deleteCategory(this.id).then();
    }

    async deleteCategory(id) {

        const response = await CategoriesService.deleteCategory(this.type, id);
        if (response.error) {
            alert(response.error);
            return response.redirect ? this.openNewRoute(response.redirect) : null;
        }

        this.updateOperations().then();

        return this.openNewRoute('/categories/' + this.type);
    }

    async updateOperations() {

        const response = await OperationsService.getOperations('all');
        if (response.error) {
            alert(response.error);
            return response.redirect ? this.openNewRoute(response.redirect) : null;
        }

        for (let i = 0; i < response.operations.length; i++) {
            if (!response.operations[i].category) {

                const responseDeleteOperation = await OperationsService.deleteOperation(response.operations[i].id);
                if (responseDeleteOperation.error) {
                    alert(responseDeleteOperation.error);
                    return responseDeleteOperation.redirect ? this.openNewRoute(responseDeleteOperation.redirect) : null;
                }
            }
        }
    }
}