import React, {Component} from "react"
import Layout from "./hoc/Layout/Layout"
import {Routes, Route, Navigate} from 'react-router-dom'
import Quiz from "./containers/Quiz/Quiz"
import Auth from "./containers/Auth/Auth"
import QuizCreator from "./containers/QuizCreator/QuizCreator"
import QuizList from "./containers/QuizList/QuizList"
import { connect } from "react-redux"
import Logout from "./components/Logout/Logout"
import {autoLogin} from './store/actions/auth'

class App extends Component {

  componentDidMount() {
    this.props.autoLogin()
  }

  render () {

    let myRoutes = (
        <Routes>
          <Route path="/auth" element={<Auth />} />
          <Route path="quiz">
            <Route path=":id" element={<Quiz />} />
          </Route>
          <Route path="/" element={<QuizList />} />
          <Route path="*" element={<Navigate to="/" replace />}/>
        </Routes>
    )

    if (this.props.isAuthentificated) {
      myRoutes = (
        <Routes>
          <Route path="/quiz-creator" element={<QuizCreator />} />
          <Route path="quiz">
            <Route path=":id" element={<Quiz />} />
          </Route>
          <Route path="/" element={<QuizList />} />
          <Route path="/logout" element={<Logout />} />
          <Route path="*" element={<Navigate to="/" replace />}/>
        </Routes>
      )
    }

    return (
      <Layout>
        {myRoutes}
      </Layout>
    )
  }
}

function mapStateToProps(state) {
  return {
    isAuthentificated: !!state.auth.token
  }
}

function mapDispatchToProps(dispatch) {
  return {
    autoLogin: () => dispatch(autoLogin())
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(App)
