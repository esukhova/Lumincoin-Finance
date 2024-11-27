import Chart from "chart.js/auto";


export class Main {
    constructor() {
        console.log('Main');
        this.getCharts();
    }

    getCharts() {
        Chart.defaults.color = '000';
        Chart.defaults.borderColor = '#36A2EB';



        const DATA_COUNT = 5;
        const NUMBER_CFG = {count: DATA_COUNT, min: 0, max: 100};

        const data = {
            labels: ['Red', 'Orange', 'Yellow', 'Green', 'Blue'],
            datasets: [
                {
                    label: 'Dataset 1',
                    data: [10, 20, 5, 7, 8],
                    backgroundColor: ['#DC3545', '#FD7E14', '#FFC107', '#20C997', '#0D6EFD'],
                }
            ],
        };

        const optionsIncome = {
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
        const optionsExpense = {
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
                    text: 'Расходы',
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
        const chartIncome = new Chart(document.getElementById('chart-income'), {
            type: 'pie',
            data: data,
            options: optionsIncome
        });

        const chartExpense = new Chart(document.getElementById('chart-expense'), {
            type: 'pie',
            data: data,
            options: optionsExpense,
        });
    }
}