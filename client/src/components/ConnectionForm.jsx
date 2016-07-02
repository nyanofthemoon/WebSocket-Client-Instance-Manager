import React, {Component, PropTypes} from 'react'
import Config from './../config'

class ConnectionForm extends Component {
  _handleFormSubmit(e) {
    e.preventDefault()
    var username = this.refs.username.value
    if (username.length >= 1) {
      this.props.handleSubmit(username, this.context.store)
    }
  }

  componentDidMount() {
    if (Config.environment.isDevelopment()) {
      let timestamp = new Date().getTime()
      this.refs.username.value = 'Player ' + timestamp
    }
  }

  render() {
    return (
      <form className="flex-horizontal-container" action="" onSubmit={this._handleFormSubmit.bind(this)}>
        <div>
          <input type="text" ref="username" placeholder="username"/>
        </div>
        <div>
          <button type="submit">Play</button>
        </div>
      </form>
    );
  }
}

ConnectionForm.contextTypes = {
  store: React.PropTypes.object.isRequired
}

export default ConnectionForm