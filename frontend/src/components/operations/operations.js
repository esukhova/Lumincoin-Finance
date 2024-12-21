import {AuthUtils} from "../../utils/auth-utils";
import {CommonUtils} from "../../utils/common-utils";
import {OperationsService} from "../../services/operations-servise";

export class Operations {
    constructor(openNewRoute) {
        this.openNewRoute = openNewRoute;

        if (!AuthUtils.getAuthInfo(AuthUtils.accessTokenKey) || !AuthUtils.getAuthInfo(AuthUtils.refreshTokenKey)) {
            return this.openNewRoute('/login');
        }

        this.getOperations('all').then();

        this.getIntervals();

        const datePicker = document.getElementById('ui-datepicker-div');

        if (datePicker) {
            datePicker.remove();
        }

        $('#from-interval').datepicker();
        $('#to-interval').datepicker();

        this.deleteModalBtnElement = document.getElementById('deleteModalBtn');
    }

    getIntervals() {
        const intervalsBtnsElement = document.getElementById('operations-intervals');
        const intervalsBtns = intervalsBtnsElement.querySelectorAll('.operations-interval');
        intervalsBtnsElement.addEventListener('click', (e) => {
            let element = null;
            if (e.target.nodeName === 'BUTTON') {
                element = e.target;
            }
            if (element) {
                intervalsBtns.forEach((interval) => interval.classList.remove('active'));
                element.classList.add('active');
            }

        });

        const fromElement = document.getElementById('from-interval');
        const toElement = document.getElementById('to-interval');

        document.getElementById('today-btn').onclick = () => {
            const todayDate = new Date().toISOString().split('T')[0];
            this.getOperations('interval&dateFrom=' + todayDate + '&dateTo=' + todayDate).then();
        }

        document.getElementById('week-btn').onclick = () => this.getOperations('week');
        document.getElementById('month-btn').onclick = () => this.getOperations('month');
        document.getElementById('year-btn').onclick = () => this.getOperations('year');
        document.getElementById('all-btn').onclick = () => this.getOperations('all');
        document.getElementById('interval-btn').onclick = () => {
            this.getOperations('interval&dateFrom=' + fromElement.value + '&dateTo=' + toElement.value).then();
        }
    }

    async getOperations(period) {

        const response = await OperationsService.getOperations(period);
        if (response.error) {
            alert(response.error);
            return response.redirect ? this.openNewRoute(response.redirect) : null;
        }

        this.showRecords(response.operations);
    }

    showRecords(operations) {
        const recordsElement = document.getElementById('records');
        recordsElement.innerHTML = '';
        for (let i = 0; i < operations.length; i++) {
            const trElement = document.createElement('tr');

            const thRowElement = document.createElement('th');
            thRowElement.innerText = i + 1;
            thRowElement.setAttribute('scope', 'row');
            trElement.appendChild(thRowElement);

            const typeCell = trElement.insertCell();
            typeCell.innerText = operations[i].type === 'expense' ? 'расход' : 'доход';
            typeCell.style = typeCell.innerText === 'расход' ? 'color: #DC3545;' : 'color: #198754';

            trElement.insertCell().innerText = operations[i].category ? operations[i].category.toLowerCase() : 'не назначена';
            trElement.insertCell().innerText = operations[i].amount + '$';

            const date = new Date(operations[i].date).toISOString().split('T')[0].split('-');
            trElement.insertCell().innerText = date[2] + '.' + date[1] + '.' + date[0];

            trElement.insertCell().innerText = operations[i].comment;
            trElement.insertCell().innerHTML = CommonUtils.generateGridToolsColumn('operations', operations[i].id);

            recordsElement.appendChild(trElement);

            document.getElementsByClassName('operations-delete')[i].addEventListener('click', () => {
                this.deleteModalBtnElement.href = "/operations/delete?id=" + operations[i].id;
            })
        }
    }
}