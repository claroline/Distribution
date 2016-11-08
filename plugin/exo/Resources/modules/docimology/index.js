import React from 'react'
import ReactDOM from 'react-dom'
import {Provider} from 'react-redux'
import {createStore} from './store'
import Docimology from './components/docimology.jsx'

import './style.css'

// TODO : do not load from editor.
import {registerItemType} from './../editor/item-types'
import choice from './../editor/items/choice'
import match from './../editor/items/match'
import cloze from './../editor/items/cloze'
import graphic from './../editor/items/graphic'
import open from './../editor/items/open'

[choice, match, cloze, graphic, open].forEach(registerItemType)

const exerciseRaw = JSON.parse(document.getElementById('docimology').dataset.exercise)

const store = createStore({
  exercise: exerciseRaw,
  currentObject: {
    type: 'exercise',
    id: exerciseRaw.id
  }
})

ReactDOM.render(
  React.createElement(
    Provider,
    {store},
    React.createElement(Docimology)
  ),
  document.getElementById('docimology')
)
