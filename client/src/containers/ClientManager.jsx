import React, {Component, PropTypes} from 'react'
import {bindActionCreators} from 'redux'
import {connect} from 'react-redux'

import ConnectionForm from './../components/ConnectionForm'
import ClientInstance from './ClientInstance'

import {connectSocket} from './../actions'

class ClientManager extends Component {
  render() {
    const {manager, actions} = this.props
    switch (manager.get('status')) {
      default:
      case 'connecting':
      case 'disconnected':
        return (<div className="flex-vertical-container light-text">
          <h1 className="title">Client Manager</h1>
          <h2 className="title">Please enter your name below.</h2>
          <ConnectionForm handleSubmit={actions.connectSocket}/>
        </div>)
      case 'connected':
        return (<div className="flex-vertical-container light-text">
          <ClientInstance/>
        </div>)
    }
  }
}

ClientManager.propTypes = {
  manager: PropTypes.object.isRequired,
  actions: PropTypes.object.isRequired
}

function mapStateToProps(state) {
  return {
    manager: state.manager
  }
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators({
      connectSocket
    }, dispatch)
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ClientManager)