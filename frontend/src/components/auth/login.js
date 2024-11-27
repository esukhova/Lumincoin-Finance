export class Login {

    constructor(openNewRoute) {
        this.openNewRoute = openNewRoute;

        if (localStorage.getItem('accessToken')) {
            return this.openNewRoute('/');
        }

        this.rememberMeElement = document.getElementById('remember-me');
        this.commonErrorElement = document.getElementById('common-error');
//??????
        if (localStorage.getItem('user') && localStorage.getItem('rememberMe')) {
            this.emailElement.value = (JSON.parse(localStorage.getItem('user'))).email;
            this.passwordElement.value = (JSON.parse(localStorage.getItem('user'))).password;
        }
//??????

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
        this.validateForm();
    }

    validateForm() {
        return this.fields.every(item => item.valid);
    }

    async login() {
        this.commonErrorElement.style.display = 'none';

        if (this.validateForm()) {
            const response = await fetch('http://localhost:3000/api/login', {
                method: 'POST',
                headers: {
                    'Content-type': 'application/json',
                    'Accept': 'application/json',
                },
                body: JSON.stringify({
                    email: this.fields.find(item => item.name === 'email').element.value,
                    password: this.fields.find(item => item.name === 'password').element.value,
                    rememberMe: this.rememberMeElement.checked
                })

            });

            const result = await response.json();

            if (result.error || !result.tokens || !result.user) {
                this.commonErrorElement.style.display = 'block';
                return;
            }

            localStorage.setItem('accessToken', result.tokens.accessToken);
            localStorage.setItem('refreshToken', result.tokens.refreshToken);
            localStorage.setItem('user', JSON.stringify({
                id: result.user.id,
                name: result.user.name,
                lastName: result.user.lastName
            }));
//??????
            if (this.rememberMeElement.checked) {
                localStorage.setItem('rememberMe', 'true');
            }
//??????

            this.openNewRoute('/');

        } else {
            this.fields.forEach(item => {
                this.validateField(item, item.element);
            })
        }
    }
}