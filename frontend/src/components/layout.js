export class Layout {
    constructor() {
        const sidebarElement = document.getElementById('sidebar-layout')
        const burgerElement = document.getElementById('burger')

        if (burgerElement) {
            burgerElement.addEventListener("click", () => {
                if (sidebarElement.classList.contains("active")) {
                    sidebarElement.classList.remove("active");
                } else {
                    sidebarElement.classList.add("active");
                }
                if (burgerElement.classList.contains("active")) {
                    burgerElement.classList.remove("active");
                } else {
                    burgerElement.classList.add("active");
                }
            });

            sidebarElement.addEventListener("blur", () => {
                sidebarElement.classList.remove("active");
            });
        }
    }
}