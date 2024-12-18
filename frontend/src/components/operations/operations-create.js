import {AuthUtils} from "../../utils/auth-utils";
import {CommonUtils} from "../../utils/common-utils";
import {UrlUtils} from "../../utils/url-utils";
import {OperationsService} from "../../services/operations-servise";
import {CategoriesService} from "../../services/categories-service";

export class OperationsCreate {
    constructor(openNewRoute) {
        this.openNewRoute = openNewRoute;

        if (!AuthUtils.getAuthInfo(AuthUtils.accessTokenKey) || !AuthUtils.getAuthInfo(AuthUtils.refreshTokenKey)) {
            return this.openNewRoute('/login');
        }

        this.type = UrlUtils.getUrlParam('type');
        if (!this.type) {
            return this.openNewRoute('/');
        }

        this.selectTypeElement = document.getElementById('select-type');
        this.amountElement = document.getElementById('amount');
        this.amountDivElement = document.getElementById('amount-div');
        this.amountErrorElement = document.getElementById('look-like-input-error');
        this.dateElement = document.getElementById('date');
        this.commentElement = document.getElementById('comment');

        $('#date').datepicker();

        this.defaultFill(this.type).then();

        this.amountDivElement.addEventListener('focusout', this.validateForm.bind(this));
        document.getElementById('createBtn').addEventListener('click', this.createOperation.bind(this));

    }

    async defaultFill(type = 'expense') {

        this.selectTypeElement.value = type;
        this.selectTypeElement.setAttribute('disabled', 'disabled');

        this.amountElement.value = this.amountDivElement.innerText;

        document.getElementById('form').insertBefore(await CommonUtils.getSelectCategory({type: type}, this.openNewRoute), this.amountElement);
        this.selectCategoryElement = document.getElementById('select-category');

        $('#date').datepicker('setDate', 'today');
    }

    validateForm() {
        this.amountElement.value = this.amountDivElement.innerText;

        let isValid = true;
        if ((/^[1-9]\d+$/.test(this.amountElement.value)) && (this.amountElement.value > 0)) {
            this.amountDivElement.parentElement.classList.remove('is-invalid');
            this.amountErrorElement.style.display = 'none';
        } else {
            this.amountDivElement.parentElement.classList.add('is-invalid');
            isValid = false;
            this.amountErrorElement.style.display = 'block';
        }

        return isValid;
    }

    async getCategoryId(type) {

        const response = await CategoriesService.getCategories(type);
        if (response.error) {
            alert(response.error);
            return response.redirect ? this.openNewRoute(response.redirect) : null;
        }

        for (let i = 0; i < response.categories.length; i++) {
            if (response.categories[i].title.toLowerCase() === this.selectCategoryElement.value.toLowerCase()) {
                this.categoryId = response.categories[i].id;
                return;
            }
        }
    }


    async createOperation(e) {
        e.preventDefault();

        await this.getCategoryId(this.type);

        if (this.validateForm()) {

            const createData = {
                type: this.selectTypeElement.value,
                amount: Number(this.amountDivElement.innerText),
                date: this.dateElement.value.split('/')[2] + '-' + this.dateElement.value.split('/')[0] + '-' + this.dateElement.value.split('/')[1],
                comment: this.commentElement.value ? this.commentElement.value : " ",
                category_id: this.categoryId
            }

            const response = await OperationsService.createOperation(createData);
            if (response.error) {
                alert(response.error);
                return response.redirect ? this.openNewRoute(response.redirect) : null;
            }

            return this.openNewRoute('/operations');
        }
    }
}