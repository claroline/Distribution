import React, {Component} from 'react'
import {PropTypes as T} from 'prop-types'
import {Provider} from 'react-redux'

import {loadRegistries} from '#/main/app/registry'

const AppLoader = props =>
  <div className="app-loader">
    Please wait will we load the application...
  </div>

class App extends Component {
  constructor(props) {
    super(props)

    this.state = {
      ready: false
    }
  }

  componentDidMount() {
    loadRegistries(() => this.setState({ready: true}))
  }

  componentWillUnMount() {

  }

  render() {
    if (!this.state.ready) {
      return (
        <AppLoader/>
      )
    } else {
      if (this.props.store) {
        return (
          <Provider
            store={this.props.store}
          >
            {this.props.children}
          </Provider>
        )
      }

      return this.props.children
    }
  }
}

App.propTypes = {
  store: T.object,
  children: T.element.isRequired
}

export {
  App
}
