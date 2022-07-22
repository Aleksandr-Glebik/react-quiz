import React, {Component} from "react"
import classes from './QuizCreator.module.css'
import Button from '../../components/UI/Button/Button'
import { createControl, validate, validateForm } from "../../form/FormFramework"
import Input from "../../components/UI/input/Input"
import Auxilliary from "../../hoc/Layout/Auxilliary/Auxilliary"
import Select from "../../components/UI/Select/Select"

function createOptionControl(number) {
    return createControl({
        label: `Вариант ${number}`,
        errorMessage: 'Значение не может быть пустым',
        id: number
    }, {required: true})
}

function createFormControls() {
    return {
        question: createControl({
            label: 'Введите вопрос',
            errorMessage: 'Вопрос не может быть пустым'
        }, {required: true}),
        option1: createOptionControl(1),
        option2: createOptionControl(2),
        option3: createOptionControl(3),
        option4: createOptionControl(4),
    }
}

export default class QuizCreator extends Component {

    state = {
       quiz: [],
       rightAnswerId: 1,
       isFormValid: false,
       formControls: createFormControls(),
    }

    submitHandler = (event) => {
        event.preventDefault()
    }

    addQuestionHandler = (event) => {
        event.preventDefault()
    }

    createQuizHandler = () => {

    }

    onChangeHandler = (value, controlName) => {
        const formControls = {...this.state.formControls}
        const control = {...formControls[controlName]}

        control.touched = true
        control.value = value
        control.valid = validate(control.value, control.validation)

        formControls[controlName] = control

        this.setState({
            formControls: formControls,
            isFormValid: validateForm(formControls)

        })

    }

    renderControls() {
        const inputs = Object.keys(this.state.formControls).map((controlName, index) => {
            const control = this.state.formControls[controlName]

            return (
                <Auxilliary key={controlName + index}>
                    <Input
                        type={control.type}
                        value={control.value}
                        valid={control.valid}
                        touched={control.touched}
                        label={control.label}
                        errorMessage={control.errorMessage}
                        shouldValidate={!!control.validation}
                        onChange={event => this.onChangeHandler(event.target.value, controlName)}
                    />
                    { index === 0 ? <hr /> : null }
                </Auxilliary>

            )
        })

        return inputs
    }

    selectChangeHandler = (event) => {
        console.log(event.target.value);
        this.setState({
            rightAnswerId: +event.target.value
        })
    }

    render () {
        const select = <Select
            label='Выберите правильный ответ'
            value={this.state.rightAnswerId}
            onChange={this.selectChangeHandler}
            options={[
                {text: 1, value: 1},
                {text: 2, value: 2},
                {text: 3, value: 3},
                {text: 4, value: 4}
            ]}
        />

        return (
            <div className={classes.QuizCreator}>
                <div>
                <h1>Создание теста</h1>

                <form onSubmit={this.submitHandler}>
                    {this.renderControls()}

                    { select }

                    <Button
                        type="primary"
                        onClick={this.addQuestionHandler}
                        disabled={!this.state.isFormValid}
                    >
                        Добавить вопрос
                    </Button>

                    <Button
                        type="success"
                        onClick={this.createQuizHandler}
                        disabled={this.state.quiz.length === 0}
                    >
                        Создать тест
                    </Button>

                </form>
                </div>
            </div>
        )
    }
}