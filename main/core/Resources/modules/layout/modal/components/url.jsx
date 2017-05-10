import React, {Component, PropTypes as T} from 'react'

class UrlModal extends Component {
  constructor(props) {
    super(props)

    this.id = Math.random().toString(36).replace(/[^a-z]+/g, '').substr(0, 5)
    //this.id = uuid().replace(/-/g, '')
  }

  render() {
    return (
      <div
        id={this.id}
        dangerouslySetInnerHTML={{__html: this.props.content}}
      />
    )
  }

  submitForm() {
    var form = document.querySelector(`#${this.id} form`)
    var url = form.action

    var formData = new FormData(form)

    fetch(url, {
      method: 'POST',
      body: formData,
      credentials: 'include'
    }).then(data => {
      this.props.hideModal(data)
    })
  }

  componentDidMount() {
          //event.preventDefault();
    document.querySelector(`#${this.id} button[type="submit"]`).addEventListener('click', event => {
      event.preventDefault()
      this.submitForm()
    })

    document.querySelector(`#${this.id}`).addEventListener('keypress', event => {
      if (event.keyCode === 13 && event.target.nodeName !== 'TEXTAREA') {
        event.preventDefault()
        this.submitForm()
      }
    })

    const array = []
    const nodes = document.querySelectorAll(`#${this.id} [data-dismiss="modal"]`)
    //because it's an arrayNode collection or something, we can't use forEach directtly
    array.forEach.call(nodes, node => node.addEventListener('click', () => this.props.hideModal()))
  }
}

UrlModal.propTypes = {
  fadeModal: T.func.isRequired,
  hideModal: T.func.isRequired,
  show: T.bool.isRequired,
  className: T.string,
  content: T.string.isRequired
}

// required when testing proptypes on code instrumented by istanbul
// @see https://github.com/facebook/jest/issues/1824#issuecomment-250478026
UrlModal.displayName = 'UrlModal'

export {UrlModal}
