import {Match as component} from './match.jsx'
import {ITEM_CREATE} from './../actions'
import {makeId, makeActionCreator} from './../util'
import cloneDeep from 'lodash/cloneDeep'

/* global jsPlumb */

const UPDATE_SOLUTION = 'UPDATE_SOLUTION'
const ADD_SOLUTION = 'ADD_SOLUTION'
const REMOVE_SOLUTION = 'REMOVE_SOLUTION'
const UPDATE_PROP = 'UPDATE_PROP'
const ADD_ITEM = 'ADD_ITEM'
const REMOVE_ITEM = 'REMOVE_ITEM'
const JSPLUMB_INIT = 'JSPLUMB_INIT'
const JSPLUMB_ADD_CONNECTION = 'JSPLUMB_ADD_CONNECTION'
const JSPLUMB_REMOVE_CONNECTION = 'JSPLUMB_REMOVE_CONNECTION'
const JSPLUMB_ADD_ENDPOINT = 'JSPLUMB_ADD_ENDPOINT'

export const actions = {
  updateSolution: makeActionCreator(UPDATE_SOLUTION, 'id', 'property', 'value'),
  addSolution: makeActionCreator(ADD_SOLUTION, 'data', 'event'),
  removeSolution: makeActionCreator(REMOVE_SOLUTION, 'index'),
  updateProperty: makeActionCreator(UPDATE_PROP, 'property', 'value'),
  addItem: makeActionCreator(ADD_ITEM, 'isLeftItem'),
  removeItem: makeActionCreator(REMOVE_ITEM, 'isLeftItem', 'id', 'elemId'),
  jsPlumbInit: makeActionCreator(JSPLUMB_INIT),
  jsPlumbAddEndpoint: makeActionCreator(JSPLUMB_ADD_ENDPOINT, 'isLeftItem', 'elemId')
}


function initJsPlumb(solutions) {
  jsPlumb.setSuspendDrawing(false)

  // defaults parameters for all connections
  jsPlumb.importDefaults({
    Anchors: ['RightMiddle', 'LeftMiddle'],
    ConnectionsDetachable: true,
    Connector: 'Straight',
    DropOptions: {tolerance: 'touch'},
    HoverPaintStyle: {strokeStyle: '#FC0000'},
    LogEnabled: true,
    PaintStyle: {strokeStyle: '#777', lineWidth: 4}
  })

  jsPlumb.registerConnectionTypes({
    'valid': {
      paintStyle     : { strokeStyle: '#5CB85C', lineWidth: 5 },
      hoverPaintStyle: { strokeStyle: 'green',   lineWidth: 6 }
    },
    'invalid': {
      paintStyle:      { strokeStyle: '#D9534F', lineWidth: 5 },
      hoverPaintStyle: { strokeStyle: 'red',     lineWidth: 6 }
    },
    'selected': {
      paintStyle:      { strokeStyle: '#006DCC', lineWidth: 6 },
      hoverPaintStyle: { strokeStyle: '#006DCC', lineWidth: 6 }
    },
    'default': {
      paintStyle     : { strokeStyle: 'grey',    lineWidth: 5 },
      hoverPaintStyle: { strokeStyle: 'orange', lineWidth: 6 }
    }
  })

  jsPlumb.setContainer(document.getElementById('match-question-container-id'))
  // edd existing connections in case if we are currently editing
  for (const solution of solutions) {
    jsPlumb.connect({
      source: 'source_' + solution.firstId,
      target: 'target_' + solution.secondId
    })
  }
}

function getPopoverPosition(e) {
  const rect =  document.getElementById('popover-place-holder').getBoundingClientRect()
  return {
    left: 0 - rect.width / 2,
    top: e.clientY - rect.top
  }
}

function decorate(item) {

  const firstSetWithDeletable = item.firstSet.map(
    set => Object.assign({}, set, {
      _deletable: item.firstSet.length > 1
    })
  )

  const secondSetWithDeletable = item.secondSet.map(
    set => Object.assign({}, set, {
      _deletable: item.secondSet.length > 1
    })
  )

  const solutionsWithDeletable = item.solutions.map(
    solution => Object.assign({}, solution, {
      _deletable: item.solutions.length > 0
    })
  )

  let decorated = Object.assign({}, item, {
    firstSet: firstSetWithDeletable,
    secondSet: secondSetWithDeletable,
    solutions: solutionsWithDeletable,
    _popover: {
      visible: false,
      id:null,
      left: null,
      top: null,
      title:null
    },
    _jsPlumbConnection: null,
    _solution: null
  })

  return decorated
}

function reduce(item = {}, action) {
  switch (action.type) {
    case ITEM_CREATE: {
      return decorate(Object.assign({}, item, {
        random: false,
        penalty: 0,
        firstSet: [
          {
            id: makeId(),
            type: 'text/html',
            data: ''
          }
        ],
        secondSet: [
          {
            id: makeId(),
            type: 'text/html',
            data: ''
          },
          {
            id: makeId(),
            type: 'text/html',
            data: ''
          }
        ],
        solutions: []
      }))
    }

    case ADD_SOLUTION: {
      console.log('add solution')
      const newItem = cloneDeep(item)
      /*console.log(newItem)
      data.connection.setType('selected')
      const positions = getPopoverPosition(event)
      const firstSetId = data.sourceId.replace('source_', '')
      const secondSetId = data.targetId.replace('target_', '')
      const title = newItem.firstSet.find(el => el.id === firstSetId).data + ' - ' + newItem.secondSet.find(el => el.id === secondSetId).data
      const solution = {
        firstSetId: firstSetId,
        secondSetId: secondSetId,
        feedback: '',
        score: 1
      }
      newItem.solutions.push(solution)

      newItem._popover = {
        visible: true,
        id:data.sourceId + '-' + data.targetId,
        left: positions.left,
        top: positions.top,
        title:title
      }

      newItem._jsPlumbConnection = data.connection
      newItem._solution = solution
      return newItem*/
      return newItem
    }

    case UPDATE_SOLUTION: {
      console.log('update solution action')
      return item
    }

    case REMOVE_SOLUTION: {
      console.log('remove solution action')
      return item
    }

    case UPDATE_PROP: {
      console.log('update prop action')
      return item
    }

    case ADD_ITEM: {

      const toAdd = {
        id: makeId(),
        type: 'text/html',
        data: ''
      }

      const newItem = cloneDeep(item)
      action.isLeftItem === true ? newItem.firstSet.push(toAdd) : newItem.secondSet.push(toAdd)

      const deletable = action.isLeftItem === true ? newItem.firstSet.length > 1 : newItem.secondSet.length > 1
      action.isLeftItem === true ? newItem.firstSet.forEach(set => set._deletable = deletable) : newItem.secondSet.forEach(set => set._deletable = deletable)

      return newItem
    }

    case REMOVE_ITEM: {
      const newItem = cloneDeep(item)
      // action.isLeftItem
      if (action.isLeftItem) {
        const setIndex = newItem.firstSet.findIndex(set => set.id === action.id)
        newItem.firstSet.splice(setIndex, 1)
        for(const index in newItem.solutions){
          if(newItem.solutions[index].firstSetId === action.id){
            newItem.solutions.splice(index, 1)
          }
        }
        newItem.firstSet.forEach(set => set._deletable = newItem.firstSet.length > 1)
      } else {
        const setIndex = newItem.secondSet.findIndex(set => set.id === action.id)
        newItem.secondSet.splice(setIndex, 1)
        for(const index in newItem.solutions){
          if(newItem.solutions[index].secondSetId === action.id){
            newItem.solutions.splice(index, 1)
          }
        }
        newItem.secondSet.forEach(set => set._deletable = newItem.secondSet.length > 1)
      }

      // also need to detach every connection with this endpoint if any
      // also need to remove item endpoint
      // https://jsplumbtoolkit.com/community/doc/miscellaneous-examples.html
      // Remove all Endpoints for the element 'window1', deleting their Connections.
      // not sure about this one especially concerning events
      jsPlumb.removeAllEndpoints(action.elemId)

      return newItem
    }

    case JSPLUMB_INIT: {

      const newItem = cloneDeep(item)
      initJsPlumb(newItem.solutions)

      jsPlumb.bind('beforeDrop', function (connection) {
        // check that the connection is not already in jsPlumbConnections before creating it
        const list = jsPlumb.getConnections().filter(el => el.sourceId === connection.sourceId && el.targetId === connection.targetId )
        return list.length === 0
      })

      jsPlumb.bind('connection', function (data, event) {

        console.log('connection created')
        const newItem = cloneDeep(item)
        console.log(newItem)
        data.connection.setType('selected')
        const positions = getPopoverPosition(event)
        const firstSetId = data.sourceId.replace('source_', '')
        const secondSetId = data.targetId.replace('target_', '')
        const title = newItem.firstSet.find(el => el.id === firstSetId).data + ' - ' + newItem.secondSet.find(el => el.id === secondSetId).data
        const solution = {
          firstSetId: firstSetId,
          secondSetId: secondSetId,
          feedback: '',
          score: 1
        }
        newItem.solutions.push(solution)

        newItem._popover = {
          visible: true,
          id:data.sourceId + '-' + data.targetId,
          left: positions.left,
          top: positions.top,
          title:title
        }

        newItem._jsPlumbConnection = data.connection
        newItem._solution = solution
        return newItem
      }.bind(this))

      return newItem
    }

    case JSPLUMB_ADD_ENDPOINT: {
      const selector = '#' +  action.elemId
      const anchor = action.isLeftItem === true ? 'RightMiddle' : 'LeftMiddle'
      if (action.isLeftItem === true) {
        jsPlumb.addEndpoint(jsPlumb.getSelector(selector), {
          anchor: anchor,
          cssClass: 'endPoints',
          isSource: true,
          maxConnections: -1
        })
      } else {
        jsPlumb.addEndpoint(jsPlumb.getSelector(selector), {
          anchor: anchor,
          cssClass: 'endPoints',
          isTarget: true,
          maxConnections: -1
        })
      }
      return item
    }

    case JSPLUMB_ADD_CONNECTION: {
      const newItem = cloneDeep(item)
      return newItem
    }

  }
  return item
}



function validate() {
  const errors = {}
  return errors
}


export default {
  type: 'application/x.match+json',
  name: 'match',
  component,
  reduce,
  validate
}
