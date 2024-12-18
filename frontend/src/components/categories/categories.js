import {AuthUtils} from "../../utils/auth-utils";
import {CategoriesService} from "../../services/categories-service";

export class Categories {
    constructor(openNewRoute, type) {
        this.openNewRoute = openNewRoute;
        this.type = type;

        if (!AuthUtils.getAuthInfo(AuthUtils.accessTokenKey) || !AuthUtils.getAuthInfo(AuthUtils.refreshTokenKey)) {
            return this.openNewRoute('/login');
        }

        this.recordsElement = document.getElementById(this.type + '-cards');
        this.deleteModalBtnElement = document.getElementById('deleteModalBtn');
        this.cancelModalBtnElement = document.getElementById('cancelModalBtn');
        this.cancelModalBtnElement.href = '/categories/' + this.type;

        this.getCategories().then();
    }

    async getCategories() {

        const response = await CategoriesService.getCategories(this.type);
        if (response.error) {
            alert(response.error);
            return response.redirect ? this.openNewRoute(response.redirect) : null;
        }

        this.showRecords(response.categories);
    }

    showRecords(categories) {
        const cardPlusCol = document.getElementById('card-plus-col');

        for (let i = 0; i < categories.length; i++) {
            const colElement = document.createElement('div');
            colElement.classList.add('col', 'card-category-col');

            colElement.innerHTML =
                '  <div class="card">' +
                '     <div class="card-body">' +
                '        <h5 class="card-title">' + categories[i].title + '</h5>' +
                '        <div class="card-buttons">' +
                '            <a href="/categories/' + this.type + '/edit?id=' + categories[i].id + '" class="btn card-btn btn-primary">Редактировать</a>' +
                '            <button class="btn card-btn btn-danger delete-btn" data-bs-toggle="modal" data-bs-target="#modal">Удалить</button>' +
                '        </div>' +
                '     </div>' +
                ' </div>';

            this.recordsElement.insertBefore(colElement, cardPlusCol);

            document.getElementsByClassName('delete-btn')[i].addEventListener('click', () => {
                this.deleteModalBtnElement.href = '/categories/' + this.type + '/delete?id=' + categories[i].id;
            });
        }

        const cardCategoryCols = document.getElementsByClassName('card-category-col');
        if (cardCategoryCols && cardCategoryCols.length > 0) {
            cardPlusCol.style.height = cardCategoryCols[0].offsetHeight + 'px';
        }
    }
}