import axios from 'axios'

export default axios.create({
    baseURL: 'https://react-quiz-29ea8-default-rtdb.firebaseio.com/'
})