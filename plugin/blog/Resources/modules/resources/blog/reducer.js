import {makeReducer, combineReducers} from '#/main/core/scaffolding/reducer'
import {makePageReducer} from '#/main/core/layout/page/reducer'
import {makeListReducer} from '#/main/core/data/list/reducer'
import {makeFormReducer} from '#/main/core/data/form/reducer'
import {makeResourceReducer} from '#/main/core/resource/reducer'
import {FORM_SUBMIT_SUCCESS} from '#/main/core/data/form/actions'
import {POSTS_LOAD, POST_LOAD, POST_EDIT, POST_RESET, SWITCH_MODE, POST_UPDATE_PUBLICATION, INIT_DATALIST} from '#/plugin/blog/resources/blog/actions'
import {
  ITEM_UPDATE_TAGS
} from '#/plugin/tag/actions.js'

/*
 * const reducer = makePageReducer(etat_initial, custom_reducer)

 * const reducer = makePageReducer(etat_initial??, {
  props1: makeReducer(valeur_par_defaut, {})
})
 * 
 * */

//action.posts. posts defini dans actions.js via le makeInstanceActionCreator

/*heroes: makeListReducer('heroes', {}, {
  invalidated: makeReducer(false, {
    [FORM_SUBMIT_SUCCESS+'/hero']: () => true
  })
}),*/

const reducer = makeResourceReducer({}, {
  mode: makeReducer('list_posts', {
    [SWITCH_MODE]: (state, action) => action.mode
  }),
  posts: makeListReducer('posts', {
    sortBy: {    
      property: 'publicationDate',
      direction: -1
    }
  }, {
    invalidated: makeReducer(false, {
      [FORM_SUBMIT_SUCCESS+'/post_edit']: () => true,
      [POST_UPDATE_PUBLICATION]: () => true,
      [INIT_DATALIST]: () => true
    })
  },{
    selectable: false
  }),
  post: makeReducer({}, {
    [POST_LOAD]: (state, action) => action.post,
    [POST_UPDATE_PUBLICATION]: (state, action) => action.post,
    [POST_RESET]: () => ({})
  }),
  post_edit: makeFormReducer('post_edit'),
  resourceNode: makeReducer({}, {}),
  blog: combineReducers({
    data: combineReducers({
      id: makeReducer({}, {}),
      title: makeReducer({}, {}),
      options: makeFormReducer('blog.data.options'),
      originalOptions: makeReducer({}, {}),
      tags: combineReducers({
        id: makeReducer("new", {}),
        tags: makeReducer(['tag1','tag2'], {})
      }),
    })
  })
  //options: makeFormReducer('options')
})
     /* tags: combineReducers({
        id: makeReducer('new', {}),
        tags: makeReducer([], {}),
      }),*/
      

   /* case ITEM_UPDATE_TAGS: {
      const updatedItem = Object.assign(
        {},
        items[action.id],
        {tags: action.tags}
      )

      return update(items, {[action.id]: {$set: updatedItem}})
    }*/

export {reducer}