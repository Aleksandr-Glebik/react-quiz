import axios from '../../axios/axios-quiz'
import { FETCH_QUIZES_START, FETCH_QUIZES_ERROR, FETCH_QUIZES_SUCCESS, FETCH_QUIZ_SUCCESS, QUIZ_SET_STATE, FINISH_QUIZ, QUIZ_NEXT_QUESTION, QUIZ_RETRY } from './actionTypes'

export function fetchQuizes() {
    return async dispatch => {
        dispatch(fetchQuizesStart())
        try {
            const response = await axios.get('/quizes.json')

            const quizes = []

            Object.keys(response.data).forEach((key, index) => {
                quizes.push({
                    id: key,
                    name: `Тест № ${index + 1}`
                })
            })

            dispatch(fetchQuizesSuccess(quizes))
        } catch(error) {
            dispatch(fetchQuizesError(error))
        }
    }
}

export function fetchQuizById(quizId) {
    return async dispatch => {
        dispatch(fetchQuizesStart())
        try {
            const response = await axios.get(`quizes/${quizId}.json`)
            const quiz = response.data

            dispatch(fetchQuizeSuccess(quiz))
        } catch (error) {
            dispatch(fetchQuizesError(error))
        }
    }
}

export function fetchQuizeSuccess(quiz) {
    return {
        type: FETCH_QUIZ_SUCCESS,
        quiz: quiz
    }
}

export function fetchQuizesStart() {
    return {
        type: FETCH_QUIZES_START,
    }
}

export function fetchQuizesSuccess(quizes) {
    return {
        type: FETCH_QUIZES_SUCCESS,
        quizes: quizes
    }
}

export function fetchQuizesError(error) {
    return {
        type: FETCH_QUIZES_ERROR,
        error: error
    }
}

export function quizSetState(answerState, results) {
    return {
        type: QUIZ_SET_STATE,
        answerState: answerState,
        results: results
    }
}

export function finishQuiz() {
    return {
        type: FINISH_QUIZ
    }
}

export function quizNextQuestion(number) {
    return {
        type: QUIZ_NEXT_QUESTION,
        number: number
    }
}

export function retryQuiz() {
    return {
        type: QUIZ_RETRY
    }
}

export function quizAnswerClick(answerId) {
    return (dispatch, getState) => {
        const state = getState().quiz
          console.log('state', state);
          if (state.answerState) {
            const key = Object.keys(state.answerState)[0]
            if (state.answerState[key] === 'success') {
                return
            }
        }

        const question = state.quiz[state.activeQuestion]
        const results = state.results

        if (question.rightAnswerId === answerId) {
            if (!results[question.id]) {
                results[question.id] = 'success'
            }

            dispatch(quizSetState({[answerId]: 'success'}, results))

             const timeout = window.setTimeout(() => {
                if (isQuizFinished(state)) {
                    dispatch(finishQuiz())
                } else {
                    dispatch(quizNextQuestion(state.activeQuestion + 1))
                }

                window.clearTimeout(timeout)
            }, 600)
        } else {
            results[question.id] = 'error'
            dispatch(quizSetState({[answerId]: 'error'}, results))
        }
    }
}

function isQuizFinished(state) {
    return state.activeQuestion + 1 === state.quiz.length
}