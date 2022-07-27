import React, {Component} from "react"
import classes from './Quiz.module.css'
import ActiveQuiz from "../../components/ActiveQuiz/ActiveQuiz"
import FinishedQuiz from "../../components/FinishedQuiz/FinishedQuiz"
import Loader from "../../components/UI/Loader/Loader"
import { useLocation, useNavigate, useParams } from "react-router-dom"
import { connect } from "react-redux"
import {fetchQuizById} from '../../store/actions/quiz'

class Quiz extends Component {

    onAnswerClickHandler = (answerId) => {
        // console.log('answer id', answerId);
        if (this.state.answerState) {
            const key = Object.keys(this.state.answerState)[0]
            if (this.state.answerState[key] === 'success') {
                return
            }
        }

        const question = this.state.quiz[this.state.activeQuestion]
        const results = this.state.results

        if (question.rightAnswerId === answerId) {
            if (!results[question.id]) {
                results[question.id] = 'success'
            }

            this.setState({
                answerState: {[answerId]: 'success'},
                results: results
            })

            const timeout = window.setTimeout(() => {
                if (this.isQuizFinished()) {
                    this.setState({
                        isFinished: true
                    })
                    console.log('finished');
                } else {
                    this.setState({
                        activeQuestion: this.state.activeQuestion + 1,
                        answerState: null
                    })
                }

                window.clearTimeout(timeout)
            }, 600)
        } else {
            results[question.id] = 'error'
            this.setState({
                answerState: {[answerId]: 'error'},
                results: results
            })

        }
    }

    isQuizFinished() {
        return this.state.activeQuestion + 1 === this.state.quiz.length
    }

    retryHandler = () => {
        this.setState({
            activeQuestion: 0,
            answerState: null,
            isFinished: false,
            results: {

            }
        })
    }

    componentDidMount() {
        console.log('this.props', this.props);
        console.log('this.props.router.params.id', this.props.router.params.id);
        this.props.fetchQuizById(this.props.router.params.id)
    }

    render() {
        return (
            <div className={classes.Quiz}>
                <h1>Ответьте на все вопросы</h1>

                { this.props.loading || !this.props.quiz
                    ? <Loader />
                    : this.props.isFinished
                        ?  <FinishedQuiz
                            results={this.props.results}
                            quiz={this.props.quiz}
                            onRetry={this.retryHandler}
                        />
                        : <div className={classes.QuizWrapper}>
                            <ActiveQuiz
                                answers={this.props.quiz[this.props.activeQuestion].answers}
                                question={this.props.quiz[this.props.activeQuestion].question}
                                onAnswerClick={this.onAnswerClickHandler}
                                quizLength={this.props.quiz.length}
                                answerNumber={this.props.activeQuestion + 1}
                                state={this.props.answerState}
                            />
                        </div>
                }
            </div>
        )
    }
}

function withRouter(Component) {
    function ComponentWithRouterProp(props) {
      let location = useLocation()
      let navigate = useNavigate()
      let params = useParams()

      return (
        <Component {...props} router={{location, navigate, params}} />
      )
    }

    return ComponentWithRouterProp
}

function mapStateToProps(state) {

    return {
        results: state.quiz.results,
        isFinished: state.quiz.isFinished,
        activeQuestion: state.quiz.activeQuestion,
        answerState: state.quiz.answerState,
        quiz: state.quiz.quiz,
        loading: state.quiz.loading,
    }

}

function mapDispatchToProps(dispatch) {
    return  {
        fetchQuizById: id => dispatch(fetchQuizById(id))
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(Quiz))

