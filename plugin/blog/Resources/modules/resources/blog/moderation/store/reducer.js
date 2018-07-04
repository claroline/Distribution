import {makeListReducer} from '#/main/core/data/list/reducer'

const reducer = {
  comments: makeListReducer('comments', {
    sortBy: {
      property: 'creationDate',
      direction: -1
    }
  }, {}, {selectable: false}
  )}

export {reducer}