import {AuthUtils} from "../utils/auth-utils";

export class Layout {
    constructor() {
        const sidebarElement = document.getElementById('sidebar-layout');
        const burgerElement = document.getElementById('burger');
        const userNameElement = document.getElementById('user-name');
        const userInfo = JSON.parse(localStorage.getItem(AuthUtils.userInfoKey))

        if (userInfo) {
            userNameElement.innerText = userInfo.lastName + ' ' + userInfo.name;
        }
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
    }
}