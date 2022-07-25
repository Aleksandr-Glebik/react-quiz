import React, {Component} from "react"
import classes from './Quiz.module.css'
import ActiveQuiz from "../../components/ActiveQuiz/ActiveQuiz"
import FinishedQuiz from "../../components/FinishedQuiz/FinishedQuiz"
import axios from '../../axios/axios-quiz'
import Loader from "../../components/UI/Loader/Loader"
import { useLocation, useNavigate, useParams } from "react-router-dom"

class Quiz extends Component {
    state = {
        results: {}, // { [id]: 'success' or 'err' }
        isFinished: false,
        activeQuestion: 0,
        answerState: null, // { [id]: 'success' or 'err' }
        quiz: [],
        loading: true,
    }

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

    async componentDidMount() {
        try {
            const response = await axios.get(`quizes/${this.props.router.params.id}.json`)
            const quiz = response.data

            this.setState({
                quiz,
                loading: false
            })

        } catch (error) {
            console.log('error', error);
        }
    }

    render() {
        return (
            <div className={classes.Quiz}>
                <h1>Ответьте на все вопросы</h1>

                { this.state.loading
                    ? <Loader />
                    : this.state.isFinished
                        ?  <FinishedQuiz
                            results={this.state.results}
                            quiz={this.state.quiz}
                            onRetry={this.retryHandler}
                        />
                        : <div className={classes.QuizWrapper}>
                            <ActiveQuiz
                                answers={this.state.quiz[this.state.activeQuestion].answers}
                                question={this.state.quiz[this.state.activeQuestion].question}
                                onAnswerClick={this.onAnswerClickHandler}
                                quizLength={this.state.quiz.length}
                                answerNumber={this.state.activeQuestion + 1}
                                state={this.state.answerState}
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

export default withRouter(Quiz)
// export default Quiz