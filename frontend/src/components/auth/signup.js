export class SignUp {
    constructor(openNewRoute) {
        this.openNewRoute = openNewRoute;

        if (localStorage.getItem('accessToken')) {
            return this.openNewRoute('/');
        }

        this.passwordElement = document.getElementById('password');
        this.commonErrorElement = document.getElementById('common-error');

        document.getElementById('process-button').addEventListener('click', this.signUp.bind(this));

        this.fields = [
            {
                name: 'fio',
                id: 'fio',
                element: null,
                regex: /^([A-ЯЁ][а-яё]+\s)+[A-ЯЁ][а-яё]+$/,
                valid: false,
            },
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
            },
            {
                name: 'repeat-password',
                id: 'repeat-password',
                element: null,
                regex: null,
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
        if (field.name === 'repeat-password') {
            if (element.value === this.passwordElement.value) {
                element.classList.remove('is-invalid');
                field.valid = true;
            } else {
                element.classList.add('is-invalid');
                field.valid = false;
            }
        } else if (element.value && element.value.match(field.regex)) {
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

    async signUp() {
        this.commonErrorElement.style.display = 'none';

        if (this.validateForm()) {
            const response = await fetch('http://localhost:3000/api/signup', {
                method: 'POST',
                headers: {
                    'Content-type': 'application/json',
                    'Accept': 'application/json',
                },
                body: JSON.stringify({
                    name: this.fields.find(item => item.name === 'fio').element.value.split(' ').slice(1).join(' '),
                    lastName: this.fields.find(item => item.name === 'fio').element.value.split(' ', 1)[0],
                    email: this.fields.find(item => item.name === 'email').element.value,
                    password: this.fields.find(item => item.name === 'password').element.value,
                    passwordRepeat: this.fields.find(item => item.name === 'repeat-password').element.value,
                })

            });

            const result = await response.json();

            if (result.error || !result.user) {
                this.commonErrorElement.style.display = 'block';
                return;
            }

            localStorage.setItem('user', JSON.stringify({id: result.user.id, name: result.user.name, lastName: result.user.lastName, email: result.user.email}));

            this.openNewRoute('/login');

        } else {
            this.fields.forEach(item => {
                this.validateField(item, item.element);
            })
        }
    }
}