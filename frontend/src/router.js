import {Main} from "./components/main";
import {SignUp} from "./components/auth/signup";
import {Login} from "./components/auth/login";
import {Operations} from "./components/operations/operations";
import {Categories} from "./components/categories/categories";
import {CategoriesEdit} from "./components/categories/categories-edit";
import {CategoriesCreate} from "./components/categories/categories-create";
import {OperationsCreate} from "./components/operations/operations-create";
import {OperationsEdit} from "./components/operations/operations-edit";
import {Layout} from "./components/layout";
import {Logout} from "./components/auth/logout";
import {FileUtils} from "./utils/file-utils";
import {OperationsDelete} from "./components/operations/operations-delete";
import {CategoriesDelete} from "./components/categories/categories-delete";
import {BalanceUpdate} from "./components/balance-update";
import {AuthUtils} from "./utils/auth-utils";

export class Router {
    constructor() {

        this.titlePageElement = document.getElementById('title');
        this.contentPageElement = document.getElementById('content');
        this.firstScriptElement = document.getElementById('firstScriptElement');
        this.userName = null;

        this.initEvents();
        this.routes = [
            {
                route: '/',
                title: 'Главная',
                filePathTemplate: '/templates/pages/main.html',
                useLayout: '/templates/layout.html',
                styles: ['jquery-ui.min.css'],
                scripts: ['jquery-3.7.1.min.js', 'jquery-ui.min.js'],
                load: () => {
                    new Main(this.openNewRoute.bind(this));

                }
            },
            {
                route: '/login',
                title: 'Авторизация',
                filePathTemplate: '/templates/pages/auth/login.html',
                useLayout: false,
                load: () => {
                    document.body.classList.add('login-page');
                    new Login(this.openNewRoute.bind(this));
                },
                unload: () => {
                    document.body.classList.remove('login-page');
                }
            },
            {
                route: '/signup',
                title: 'Регистрация',
                filePathTemplate: '/templates/pages/auth/signup.html',
                useLayout: false,
                load: () => {
                    document.body.classList.add('signup-page');
                    new SignUp(this.openNewRoute.bind(this));
                },
                unload: () => {
                    document.body.classList.remove('signup-page');
                }
            },
            {
                route: '/logout',
                load: () => {
                    new Logout(this.openNewRoute.bind(this));
                },
            },
            {
                route: '/operations',
                title: 'Доходы и расходы',
                filePathTemplate: '/templates/pages/operations/operations.html',
                useLayout: '/templates/layout.html',
                styles: ['jquery-ui.min.css'],
                scripts: ['jquery-3.7.1.min.js', 'jquery-ui.min.js'],
                load: () => {
                    new Operations(this.openNewRoute.bind(this));
                }
            },
            {
                route: '/operations/create',
                title: 'Создание дохода/расхода',
                filePathTemplate: '/templates/pages/operations/operations-create.html',
                useLayout: '/templates/layout.html',
                styles: ['jquery-ui.min.css'],
                scripts: ['jquery-3.7.1.min.js', 'jquery-ui.min.js'],
                load: () => {
                    new OperationsCreate(this.openNewRoute.bind(this));
                }
            },
            {
                route: '/operations/edit',
                title: 'Редактирование дохода/расхода',
                filePathTemplate: '/templates/pages/operations/operations-edit.html',
                useLayout: '/templates/layout.html',
                styles: ['jquery-ui.min.css'],
                scripts: ['jquery-3.7.1.min.js', 'jquery-ui.min.js'],
                load: () => {
                    new OperationsEdit(this.openNewRoute.bind(this));
                }
            },
            {
                route: '/operations/delete',
                load: () => {
                    new OperationsDelete(this.openNewRoute.bind(this));
                }
            },
            {
                route: '/categories/expense',
                title: 'Расходы',
                filePathTemplate: '/templates/pages/categories/expense.html',
                useLayout: '/templates/layout.html',
                load: () => {
                    new Categories(this.openNewRoute.bind(this), 'expense');
                }
            },
            {
                route: '/categories/expense/edit',
                title: 'Редактирование категории расходов',
                filePathTemplate: '/templates/pages/categories/expense-edit.html',
                useLayout: '/templates/layout.html',
                load: () => {
                    new CategoriesEdit(this.openNewRoute.bind(this), 'expense');
                }
            },
            {
                route: '/categories/expense/create',
                title: 'Создание категории расходов',
                filePathTemplate: '/templates/pages/categories/expense-create.html',
                useLayout: '/templates/layout.html',
                load: () => {
                    new CategoriesCreate(this.openNewRoute.bind(this), 'expense');
                }
            },
            {
                route: '/categories/expense/delete',
                load: () => {
                    new CategoriesDelete(this.openNewRoute.bind(this), 'expense');
                }
            },
            {
                route: '/categories/income',
                title: 'Доходы',
                filePathTemplate: '/templates/pages/categories/income.html',
                useLayout: '/templates/layout.html',
                load: () => {
                    new Categories(this.openNewRoute.bind(this), 'income');
                }
            },
            {
                route: '/categories/income/edit',
                title: 'Редактирование категории доходов',
                filePathTemplate: '/templates/pages/categories/income-edit.html',
                useLayout: '/templates/layout.html',
                load: () => {
                    new CategoriesEdit(this.openNewRoute.bind(this), 'income');
                }
            },
            {
                route: '/categories/income/create',
                title: 'Создание категории доходов',
                filePathTemplate: '/templates/pages/categories/income-create.html',
                useLayout: '/templates/layout.html',
                load: () => {
                    new CategoriesCreate(this.openNewRoute.bind(this), 'income');
                }
            },
            {
                route: '/categories/income/delete',
                load: () => {
                    new CategoriesDelete(this.openNewRoute.bind(this), 'income');
                }
            },
            {
                route: '/balance',
                load: () => {
                    new BalanceUpdate(this.openNewRoute.bind(this));
                }
            },

        ]
    }

    initEvents() {
        window.addEventListener('DOMContentLoaded', this.activateRoute.bind(this));
        window.addEventListener('popstate', this.activateRoute.bind(this));
        document.addEventListener('click', this.clickHandler.bind(this));
    }

    async openNewRoute(url) {
        const currentRoute = window.location.pathname;
        history.pushState({}, '', url);
        await this.activateRoute(null, currentRoute);
    }

    async clickHandler(e) {
        let element = null;
        if (e.target.nodeName === 'A') {
            element = e.target;
        } else if (e.target.parentNode.nodeName === 'A') {
            element = e.target.parentNode;
        }
        if (element) {
            e.preventDefault();

            const currentRoute = window.location.pathname;
            const url = element.href.replace(window.location.origin, '')
            if (!url || url === '/#' || url.startsWith('javascript: void(0)')) {
                return;
            }

            await this.openNewRoute(url);
        }
    }

    async activateRoute(e, oldRoute = null) {
        if (oldRoute) {
            const currentRoute = this.routes.find(item => item.route === oldRoute);
            if (currentRoute.styles && currentRoute.styles.length > 0) {
                currentRoute.styles.forEach(style => {
                    document.querySelector(`link[href='/css/${style}']`).remove();
                })
            }
            if (currentRoute.scripts && currentRoute.scripts.length > 0) {
                currentRoute.scripts.forEach(script => {
                    document.querySelector(`script[src='/js/${script}']`).remove();
                })
            }
            if (currentRoute.unload && typeof currentRoute.unload === 'function') {
                currentRoute.unload();
            }
        }
        const urlRoute = window.location.pathname;
        const newRoute = this.routes.find(item => item.route === urlRoute);

        if (newRoute) {
            if (newRoute.styles && newRoute.styles.length > 0) {
                newRoute.styles.forEach(style => {
                    FileUtils.loadPageStyle('/css/' + style, this.firstScriptElement);
                })
            }
            if (newRoute.scripts && newRoute.scripts.length > 0) {
                for (const script of newRoute.scripts) {
                    await FileUtils.loadPageScript('/js/' + script);
                }
            }

            if (newRoute.title) {
                this.titlePageElement.innerText = newRoute.title + ' | Lumincoin Finance';
            }

            if (newRoute.filePathTemplate) {
                document.body.className = '';
                let contentBlock = this.contentPageElement;
                if (newRoute.useLayout) {
                    this.contentPageElement.innerHTML = await fetch(newRoute.useLayout).then(response => response.text());
                    new Layout(this.openNewRoute.bind(this));
                    contentBlock = document.getElementById('content-layout');
                    this.activateMenuItem(newRoute);

                    this.userNameElement = document.getElementById('user-name');
                    let userInfo = AuthUtils.getAuthInfo(AuthUtils.userInfoKey);
                    if (userInfo) {
                        userInfo = JSON.parse(userInfo);
                        if (userInfo.lastName && userInfo.name) {
                            this.userName = userInfo.lastName + ' ' + userInfo.name;
                        }
                    }
                    this.userNameElement.innerText = this.userName;
                }
                contentBlock.innerHTML = await fetch(newRoute.filePathTemplate).then(response => response.text());
            }

            if (newRoute.load && typeof newRoute.load === 'function') {
                newRoute.load();
            }

        } else {
            console.log('No route found');
            history.pushState({}, '', '/');
            await this.activateRoute();
        }
    }

    activateMenuItem(route) {
        const accordionBtn = document.getElementsByClassName('accordion-button')[0];
        const accordionCollapse = document.getElementsByClassName('accordion-collapse')[0];
        document.querySelectorAll('.sidebar .nav-link').forEach(item => {
            const href = item.getAttribute('href');
            if ((route.route.includes(href) && href !== '/') || (route.route === href && href === '/')) {
                item.classList.add('active');
                if (route.route.includes('categories')) {
                    accordionBtn.classList.add('active');
                    accordionBtn.classList.remove('collapsed');
                    accordionCollapse.classList.add('show');
                }
                ;
            } else {
                item.classList.remove('active');
            }
        })
    }
}