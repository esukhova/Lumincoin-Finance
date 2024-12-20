import Chart from "chart.js/auto";
import {AuthUtils} from "../utils/auth-utils";
import {OperationsService} from "../services/operations-servise";


export class Main {
    constructor(openNewRoute) {

        this.openNewRoute = openNewRoute;

        if (!AuthUtils.getAuthInfo(AuthUtils.accessTokenKey) || !AuthUtils.getAuthInfo(AuthUtils.refreshTokenKey)) {
            return this.openNewRoute('/login');
        }

        document.getElementsByClassName('header')[0].style.display = 'flex';

        this.getOperations('all').then();

        this.getIntervals();

        const datePicker = document.getElementById('ui-datepicker-div');

        if (datePicker) {
            datePicker.remove();
        }

        $('#from-interval').datepicker();
        $('#to-interval').datepicker();
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

        this.getCharts(response.operations);
    }

    getCharts(operations) {

        Chart.defaults.color = '000';
        Chart.defaults.borderColor = '#36A2EB';


        const DATA_COUNT = 5;
        const NUMBER_CFG = {count: DATA_COUNT, min: 0, max: 100};

        let fractionsIncome = [];
        let fractionsExpense = [];

        for (let i = 0; i < operations.length; i++) {
            if (operations[i].type === 'expense') {
                fractionsExpense.push({
                    category: operations[i].category,
                    amount: Number(operations[i].amount)
                });
            } else if (operations[i].type === 'income') {
                fractionsIncome.push({
                    category: operations[i].category,
                    amount: Number(operations[i].amount)
                });
            }
        }

        // console.log(fractionsIncome);
        // console.log(fractionsExpense);

        let fractionsIncomeSums = {};
        let fractionsExpenseSums = {};

        for (let i = 0; i < fractionsIncome.length; i++) {
            if (!fractionsIncomeSums.hasOwnProperty(fractionsIncome[i].category)) {
                fractionsIncomeSums[fractionsIncome[i].category] = fractionsIncome[i].amount;
            } else if (fractionsIncomeSums.hasOwnProperty(fractionsIncome[i].category)) {
                fractionsIncomeSums[fractionsIncome[i].category] = (fractionsIncomeSums[fractionsIncome[i].category] + fractionsIncome[i].amount);
            }
        }
        for (let i = 0; i < fractionsExpense.length; i++) {
            if (!fractionsExpenseSums.hasOwnProperty(fractionsExpense[i].category)) {
                fractionsExpenseSums[fractionsExpense[i].category] = fractionsExpense[i].amount;
            } else if (fractionsExpenseSums.hasOwnProperty(fractionsExpense[i].category)) {
                fractionsExpenseSums[fractionsExpense[i].category] = (fractionsExpenseSums[fractionsExpense[i].category] + fractionsExpense[i].amount);
            }
        }

        // console.log(fractionsIncomeSums);
        // console.log(fractionsExpenseSums);

        const labelsIncome = Object.keys(fractionsIncomeSums);
        const labelsExpense = Object.keys(fractionsExpenseSums);

        const backgroundColor = ['#DC3545', '#FD7E14', '#FFC107', '#20C997', '#0D6EFD', '#DC3545', '#FF69B4', '#00FF00', '#00FFFF', '#9400D3', '#FFDEAD', '#FF3333', '#CC6600', '#FFFF99', '#339933', '#333399'];


        const dataIncome = {
            labels: labelsIncome,
            datasets: [
                {
                    label: 'Доходы',
                    data: Object.values(fractionsIncomeSums),
                    backgroundColor: backgroundColor,
                }
            ],
        };
        const dataExpense = {
            labels: labelsExpense,
            datasets: [
                {
                    label: 'Расходы',
                    data: Object.values(fractionsExpenseSums),
                    backgroundColor: backgroundColor,
                }
            ],
        };

        const options = {
            plugins: {
                legend: {
                    position: 'top',
                    labels: {
                        font: {
                            size: 12,
                            weight: 'bold'
                        }
                    }
                },
                title: {
                    display: true,
                    text: 'Доходы',
                    font: {
                        size: 28,
                        padding: {
                            bottom: 20
                        }
                    },
                    color: '#290661'
                },
            },
        };

        if (Chart.getChart("chart-income")) {
            Chart.getChart("chart-income")?.destroy();
        }
        if (Chart.getChart("chart-expense")) {
            Chart.getChart("chart-expense")?.destroy();
        }


        const chartIncome = new Chart(document.getElementById('chart-income'), {
            type: 'pie',
            data: dataIncome,
            options: options
        });

        options.plugins.title.text = 'Расходы';

        const chartExpense = new Chart(document.getElementById('chart-expense'), {
            type: 'pie',
            data: dataExpense,
            options: options
        });
    }
}