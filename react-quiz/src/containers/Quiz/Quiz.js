import React, {Component} from "react"
import classes from './Quiz.module.css'
import ActiveQuiz from "../../components/ActiveQuiz/ActiveQuiz"
import FinishedQuiz from "../../components/FinishedQuiz/FinishedQuiz"
import Loader from "../../components/UI/Loader/Loader"
import { useLocation, useNavigate, useParams } from "react-router-dom"
import { connect } from "react-redux"
import {fetchQuizById, quizAnswerClick, retryQuiz} from '../../store/actions/quiz'

class Quiz extends Component {

    componentDidMount() {
        // console.log('this.props', this.props);
        // console.log('this.props.router.params.id', this.props.router.params.id);
        this.props.fetchQuizById(this.props.router.params.id)
    }

    componentWillUnmount() {
        this.props.retryQuiz()
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
                            onRetry={this.props.retryQuiz}
                        />
                        : <div className={classes.QuizWrapper}>
                            <ActiveQuiz
                                answers={this.props.quiz[this.props.activeQuestion].answers}
                                question={this.props.quiz[this.props.activeQuestion].question}
                                onAnswerClick={this.props.quizAnswerClick}
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
        fetchQuizById: id => dispatch(fetchQuizById(id)),
        quizAnswerClick: answerId => dispatch(quizAnswerClick(answerId)),
        retryQuiz: () => dispatch(retryQuiz())
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(Quiz))

