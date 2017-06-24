import React from 'react'
import ReactDOM from 'react-dom'
import {Provider} from 'react-redux'

import {createStore} from '#/main/core/utilities/redux'

import {reducer} from '#/main/core/administration/theme/reducer'
import {Themes} from '#/main/core/administration/theme/components/themes.jsx'

class ThemeAdministration {
  constructor(initialData) {
    this.store = createStore(reducer, initialData)
  }

  render(element) {
    ReactDOM.render(
      React.createElement(
        Provider,
        {store: this.store},
        React.createElement(Themes)
      ),
      element
    )
  }
}

const container = document.querySelector('.themes-container')
const themes = JSON.parse(container.dataset.themes)

const themeTool = new ThemeAdministration({
  themes: themes
})

themeTool.render(container)
