import {AuthUtils} from "../../utils/auth-utils";
import {AuthService} from "../../services/auth-service";

export class Login {

    constructor(openNewRoute) {
        this.openNewRoute = openNewRoute;

        if (AuthUtils.getAuthInfo(AuthUtils.accessTokenKey)) {
            return this.openNewRoute('/');
        }

        this.rememberMeElement = document.getElementById('remember-me');
        this.commonErrorElement = document.getElementById('common-error');

        document.getElementsByClassName('header')[0].style.display = 'none';


        document.getElementById('process-button').addEventListener('click', this.login.bind(this));

        this.fields = [
            {
                name: 'email',
                id: 'email',
                element: null,
                regex: /^\w+([-+.']\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/,
                valid: false,
            },
            {
                name: 'password',
                id: 'password',
                element: null,
                regex: /^(?=.*\d)(?=.*[A-Z])[0-9a-zA-Z]{8,}$/,
                valid: false,
            }
        ];

        const that = this;
        this.fields.forEach(item => {
            item.element = document.getElementById(item.id);
            item.element.onchange = function () {
                that.validateField.call(that, item, this);
            }
        })
    }

    validateField(field, element) {
        if (element.value && element.value.match(field.regex)) {
            element.classList.remove('is-invalid');
            field.valid = true;
        } else {
            element.classList.add('is-invalid');
            field.valid = false;
        }
    }

    validateForm() {
        return this.fields.every(item => item.valid);
    }

    async login() {
        this.commonErrorElement.style.display = 'none';

        if (this.validateForm()) {

            const loginResult = await AuthService.logIn({
                email: this.fields.find(item => item.name === 'email').element.value,
                password: this.fields.find(item => item.name === 'password').element.value,
                rememberMe: this.rememberMeElement.checked
            });

            if (loginResult) {
                AuthUtils.setAuthInfo(loginResult.tokens.accessToken, loginResult.tokens.refreshToken,
                    {id: loginResult.user.id, name: loginResult.user.name, lastName: loginResult.user.lastName});

                return this.openNewRoute('/');
            }

            this.commonErrorElement.style.display = 'block';

        } else {
            this.fields.forEach(item => {
                this.validateField(item, item.element);
            })
        }
    }
}