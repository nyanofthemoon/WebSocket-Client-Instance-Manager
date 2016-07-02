import React, {Component, PropTypes} from 'react'
import {bindActionCreators} from 'redux'
import {connect} from 'react-redux'

import InstanceJoinForm from './../components/InstanceJoinForm'
import User             from './../components/User'

import {enterInstance}  from './../actions'

class ClientInstance extends Component {
  render() {
    const {instance, actions} = this.props
    let data                  = instance.get('data')
    switch (instance.get('status')) {
      default:
      case 'unjoined':
        return (<div className="flex-vertical-container light-text">
            <h1 className="title">Client Instance</h1>
            <h2 className="title">Please enter instance name below.</h2>
            <InstanceJoinForm handleSubmit={actions.enterInstance}/>
          </div>)
      case 'joined':
        return (<div className="instance">
          Instance Joined
          <User/>
        </div>)
    }
  }
}

ClientInstance.contextTypes = {
  store: PropTypes.object.isRequired
}

ClientInstance.propTypes = {
  instance: PropTypes.object.isRequired,
  actions : PropTypes.object.isRequired
}

function mapStateToProps(state) {
  return {
    instance: state.instance
  }
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators({
      enterInstance
    }, dispatch)
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ClientInstance)