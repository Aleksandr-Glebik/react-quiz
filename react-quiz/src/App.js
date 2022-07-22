import React, {Component} from "react"
import Layout from "./hoc/Layout/Layout"
import {Routes, Route} from 'react-router-dom'
import Quiz from "./containers/Quiz/Quiz"
import Auth from "./containers/Auth/Auth"
import QuizCreator from "./containers/QuizCreator/QuizCreator"
import QuizList from "./containers/QuizList/QuizList"

function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/auth" element={<Auth />} />
        <Route path="/quiz-creator" element={<QuizCreator />} />
        <Route path="quiz">
          <Route path=":id" element={<Quiz />} />
        </Route>
        <Route path="/" element={<QuizList />} />
      </Routes>
    </Layout>
  );
}

export default App;
