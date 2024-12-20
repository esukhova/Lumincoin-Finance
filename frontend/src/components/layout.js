import {BalanceService} from "../services/balance-service";

export class Layout {
    constructor(openNewRoute) {
        this.openNewRoute = openNewRoute;

        const sidebarElement = document.getElementById('sidebar-layout');
        const burgerElement = document.getElementById('burger');

        if (burgerElement) {
            burgerElement.classList.remove("active");
            burgerElement.addEventListener("click", () => {
                if (sidebarElement.classList.contains("show")) {
                    burgerElement.classList.add("active");
                } else {
                    burgerElement.classList.remove("active");
                }
                if (burgerElement.classList.contains("active")) {
                    burgerElement.classList.remove("active");
                } else {
                    burgerElement.classList.add("active");
                }
            });

            document.addEventListener("click", (e) => {
               if (e.target.className === 'offcanvas-backdrop fade') {
                   burgerElement.classList.remove("active");
               }
            });
        }

        this.balance = document.getElementById('balance-span');
        this.balanceInput = document.getElementById('balance-input');

        this.getBalance().then();

        document.getElementById('balanceModalBtn').addEventListener('click', this.updateBalance.bind(this));
    }

    async getBalance() {

        const response = await BalanceService.getBalance();
        if (response.error) {
            alert(response.error);
            return response.redirect ? this.openNewRoute(response.redirect) : null;
        }

        this.balance.innerText = response.balance.balance;
        this.balanceInput.value = response.balance.balance;
        }

    async updateBalance() {

        let updateData = {};

        if (this.balanceInput.value !== this.balance.innerText) {
            updateData = {
                newBalance: this.balanceInput.value
            }

            const response = await BalanceService.updateBalance(updateData);
            if (response.error) {
                alert(response.error);
                return response.redirect ? this.openNewRoute(response.redirect) : null;
            }

            this.balance.innerText = response.balance.balance;
        }
    }
}