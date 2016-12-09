import React from 'react'
import ReactDOM from 'react-dom'
import {Provider} from 'react-redux'
import {createStore} from './store'
import {registerDefaultItemTypes} from './../items/item-types'
import Bank from './components/bank.jsx'

import './style.css'

registerDefaultItemTypes()

const store = createStore({
  questions: [
    {
      id: '1',
      type: 'application/x.choice+json',
      content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit',
      meta: {
        authors: [
          {name: 'Axel Penin'}
        ],
        updated: '2016/10/19 16:30:00',
        model: true,
        category: 'Category A'
      }
    },
    {
      id: '2',
      type: 'application/x.open+json',
      content: 'sed do eiusmod tempor incididunt ut labore et dolore magna',
      meta: {
        authors: [
          {name: 'Axel Penin'},
          {name: 'Patrick Guillou'}
        ],
        updated: '2016/10/18 12:00:00',
        category: 'Category A'
      }
    },
    {
      id: '3',
      type: 'application/x.choice+json',
      content: 'Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.',
      meta: {
        authors: [
          {name: 'Axel Penin'},
          {name: 'Patrick Guillou'}
        ],
        updated: '2016/10/20 12:00:00',
        category: 'Category B'
      }
    },
    {
      id: '4',
      type: 'application/x.graphic+json',
      content: 'Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia',
      meta: {
        authors: [
          {name: 'Axel Penin'}
        ],
        updated: '2016/10/20 18:00:00',
        model: true,
        category: 'Category A'
      }
    }
  ],
  categories: ['Category A', 'Category B'],
  pagination: {
    current: 0,
    pageSize: 1,
    totalResults: 4
  }
})

ReactDOM.render(
  React.createElement(
    Provider,
    {store},
    React.createElement(Bank)
  ),
  document.getElementById('questions-bank')
)
