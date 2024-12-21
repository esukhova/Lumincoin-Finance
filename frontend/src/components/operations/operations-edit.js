import {AuthUtils} from "../../utils/auth-utils";
import {CommonUtils} from "../../utils/common-utils";
import {UrlUtils} from "../../utils/url-utils";
import {OperationsService} from "../../services/operations-servise";

export class OperationsEdit {
    constructor(openNewRoute) {
        this.openNewRoute = openNewRoute;

        if (!AuthUtils.getAuthInfo(AuthUtils.accessTokenKey) || !AuthUtils.getAuthInfo(AuthUtils.refreshTokenKey)) {
            return this.openNewRoute('/login');
        }

        this.id = UrlUtils.getUrlParam('id');
        if (!this.id) {
            return this.openNewRoute('/');
        }

        this.selectTypeElement = document.getElementById('select-type');
        this.amountElement = document.getElementById('amount');
        this.amountDivElement = document.getElementById('amount-div');
        this.amountErrorElement = document.getElementById('look-like-input-error');
        this.dateElement = document.getElementById('date');
        this.commentElement = document.getElementById('comment');


        $('#date').datepicker();

        this.getOperation(this.id).then();

        this.amountDivElement.addEventListener('focusout', this.validateForm.bind(this));
        document.getElementById('editBtn').addEventListener('click', this.editOperation.bind(this));
    }

    async getOperation(id) {

        const response = await OperationsService.getOperation(id);
        if (response.error) {
            alert(response.error);
            return response.redirect ? this.openNewRoute(response.redirect) : null;
        }

        this.showOperation(response.operation).then();
    }

    async showOperation(operation) {

        this.selectTypeElement.value = operation.type;
        this.selectTypeElement.setAttribute('disabled', 'disabled');
        this.amountElement.value = operation.amount;
        this.amountDivElement.innerText = this.amountElement.value;

        document.getElementById('form').insertBefore(await CommonUtils.getSelectCategory(operation, this.openNewRoute), this.amountElement);
        this.selectCategoryElement = document.getElementById('select-category');

        $('#date').datepicker("setDate", new Date(operation.date.replaceAll('-', '/')));

        this.commentElement.value = operation.comment;
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

    async editOperation(e) {
        e.preventDefault();

        if (this.validateForm()) {

            const editData = {
                type: this.selectTypeElement.value,
                amount: Number(this.amountDivElement.innerText),
                date: this.dateElement.value.split('/')[2] + '-' + this.dateElement.value.split('/')[0] + '-' + this.dateElement.value.split('/')[1],
                comment: this.commentElement.value ? this.commentElement.value : " ",
                category_id: this.selectCategoryElement.selectedIndex + 1
            };

            const response = await OperationsService.editOperation(this.id, editData);
            if (response.error) {
                alert(response.error);
                return response.redirect ? this.openNewRoute(response.redirect) : null;
            }

            return this.openNewRoute('/operations');
        }

    }
}