import React, {Component} from "react"
import { connect } from "react-redux"
import {logout} from '../../store/actions/auth'
import {Navigate} from 'react-router-dom'

class Logout extends Component {
    componentDidMount() {
        this.props.logout()
    }

    render() {
        return <Navigate to="/" replace />
    }
}

function mapDispatchToProps(dispatch) {
    return {
        logout: () => dispatch(logout())
    }
}

export default connect(null, mapDispatchToProps)(Logout)