import React, {Component} from "react"
import classes from './Auth.module.css'
import Button from '../../components/UI/Button/Button'
import Input from "../../components/UI/input/Input"

export default class Auth extends Component {

    state = {
        formControls: {
            email: {
                value: '',
                type: 'email',
                label: 'Email',
                errorMessage: 'Введите корректный email',
                valid: false,
                touched: false,
                validation: {
                    require: true,
                    email: true
                }
            },
            password: {
                value: '',
                type: 'password',
                label: 'Пароль',
                errorMessage: 'Введите корректный пароль',
                valid: false,
                touched: false,
                validation: {
                    require: true,
                    minLength: 6
                }
            }
        }
    }

    loginHandler = () => {

    }

    registerHandler = () => {

    }

    submitHandler = (event) => {
        event.preventDefault()
    }

    validateControl(value, validation) {
        if (!validation) {
            return true
        }

        let isValid = true

        if (validation.require) {
            isValid = value.trim() !== '' && isValid
        }

        if (validation.email) {
            const validateEmail = (email) => {
                return String(email)
                  .toLowerCase()
                  .match(
                    /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
                  )
              }

              isValid = validateEmail(value) && isValid
        }

        if (validation.minLength) {
            isValid = value.length >= validation.minLength && isValid
        }

        return isValid
    }

    onChangeHandler = (event, controlName) => {
        // console.log(`${controlName}: `, event.target.value)

        const formControls = {...this.state.formControls}
        const control = {...formControls[controlName]}

        control.value = event.target.value
        control.touched = true
        control.valid = this.validateControl(control.value, control.validation)

        formControls[controlName] = control

        this.setState({
            formControls: formControls
        })
    }

    renderInput() {
        const inputs = Object.keys(this.state.formControls).map((controlName, index) => {
            const control = this.state.formControls[controlName]

            return (
                <Input
                    key={controlName + index}
                    type={control.type}
                    value={control.value}
                    valid={control.valid}
                    touched={control.touched}
                    label={control.label}
                    errorMessage={control.errorMessage}
                    shouldValidate={!!control.validation}
                    onChange={event => this.onChangeHandler(event, controlName)}
                />
            )
        })

        return inputs
    }

    render() {

        return (
            <div className={classes.Auth}>
               <div>
                <h1>Авторизация</h1>

                <form onSubmit={this.submitHandler}
                    className={classes.AuthForm}
                >
                   {this.renderInput()}

                    <Button
                      type='success'
                      onClick={this.loginHandler}
                    >Войти</Button>

                    <Button
                      type='primary'
                      onClick={this.registerHandler}
                    >Зарегистрироваться</Button>

                </form>
               </div>
            </div>
        )
    }
}
