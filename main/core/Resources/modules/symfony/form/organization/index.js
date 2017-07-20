import React from 'react'
import ReactDOM from 'react-dom'
import {Provider} from 'react-redux'

import {createStore} from '#/main/core/utilities/redux'

import {reducer} from '#/main/core/administration/workspace/reducer'
import {OrganizationPicker} from '#/main/core/symfony/form/organization/organization_picker.jsx'


alert('yo')
class OrganizationField {
  constructor(initialData) {

    this.store = createStore(reducer, initialData)
  }

  render(element) {
    ReactDOM.render(
      React.createElement(
        Provider,
        {store: this.store},
        React.createElement(OrganizationPicker)
      ),
      element
    )
  }
}

const container = document.querySelector('#organization-field-container')
const orgaField = new OrganizationField()

orgaField.render(container)
