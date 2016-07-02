import React, {Component, PropTypes} from 'react'
import Config from './../config'

class InstanceJoinForm extends Component {
  _handleFormSubmit(e) {
    e.preventDefault()
    var id = this.refs.id.value
    if (id.length >= 3) {
      this.props.handleSubmit(id, this.context.store)
    }
  }

  componentDidMount() {
    if (Config.environment.isDevelopment()) {
      let timestamp = new Date().getTime()
      this.refs.id.value = 'Instance ' + timestamp
    }
  }

  render() {
    return (
      <form className="flex-horizontal-container" action="" onSubmit={this._handleFormSubmit.bind(this)}>
        <div>
          <input type="text" ref="id" placeholder="instance name"/>
        </div>
        <div>
          <button type="submit">Join</button>
        </div>
      </form>
    );
  }
}

InstanceJoinForm.contextTypes = {
  store: React.PropTypes.object.isRequired
}

export default InstanceJoinForm