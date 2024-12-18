import {BalanceService} from "../services/balance-service";

export class BalanceUpdate {
    constructor(openNewRoute) {
        this.openNewRoute = openNewRoute;

        this.updateBalance().then();
    }

    async updateBalance() {

        let updateData = {};
        const balanceInput = document.getElementById('balance-input');
        const balance = document.getElementById('balance-span');

        if (balanceInput.value !== balance.innerText) {
            updateData = {
                newBalance: balanceInput.value
            }

            const response = await BalanceService.updateBalance(updateData);
            if (response.error) {
                alert(response.error);
                return response.redirect ? this.openNewRoute(response.redirect) : null;
            }
        }

        return this.openNewRoute('/');
    }
}