import {makeReducer, combineReducers} from '#/main/core/scaffolding/reducer'
import cloneDeep from 'lodash/cloneDeep'
import {makeListReducer} from '#/main/core/data/list/reducer'
import {makeFormReducer} from '#/main/core/data/form/reducer'
import {FORM_SUBMIT_SUCCESS} from '#/main/core/data/form/actions'
import {LIST_FILTER_ADD, LIST_FILTER_REMOVE} from '#/main/core/data/list/actions'
import {ITEM_UPDATE_TAGS} from '#/plugin/tag/actions.js'
import {constants} from '#/plugin/blog/resources/blog/constants.js'
import {
  POSTS_LOAD, 
  POST_LOAD, 
  POST_DELETE,
  POST_EDIT, 
  POST_RESET, 
  SWITCH_MODE, 
  POST_UPDATE_PUBLICATION, 
  INIT_DATALIST, 
  SHOW_COMMENTS, 
  SHOW_COMMENT_FORM,
  SHOW_EDIT_COMMENT_FORM,
  UPDATE_POST_COMMENT,
  DELETE_POST_COMMENT,
  CREATE_POST_COMMENT,
  PUBLISH_POST_COMMENT
  } from '#/plugin/blog/resources/blog/actions'

//action.posts. posts defini dans actions.js via le makeInstanceActionCreator

/*heroes: makeListReducer('heroes', {}, {
  invalidated: makeReducer(false, {
    [FORM_SUBMIT_SUCCESS+'/hero']: () => true
  })
}),*/

const reducer = {
  calendarSelectedDate: makeReducer('', {
    [LIST_FILTER_ADD+'/posts']: (state, action) => {
      if(action.property === 'publicationDate'){
        return action.value;
      }
      return state;
    },
    [LIST_FILTER_REMOVE+'/posts']: (state, action) => {
      if(action.filter.property === 'publicationDate'){
        return null;
      }
      return state;
    }
  }),
  canEdit: makeReducer(false, {}),
  goHome: makeReducer(false, {
    [FORM_SUBMIT_SUCCESS+'/post_edit']: () => true,
    [SWITCH_MODE]: (state, action) => false,
  }),
  user: makeReducer({}, {}),
  showComments: makeReducer(true, {
    [SHOW_COMMENTS]: (state, action) => action.value
  }),
  showCommentForm: makeReducer(false, {
    [SHOW_COMMENT_FORM]: (state, action) => action.value
  }),
  showEditCommentForm: makeReducer('', {
    [SHOW_EDIT_COMMENT_FORM]: (state, action) => action.value
  }),
  mode: makeReducer('list_posts', {
    [SWITCH_MODE]: (state, action) => action.mode
  }),
  posts: makeListReducer('posts', {
      sortBy: {    
        property: 'publicationDate',
        direction: -1
      }
    },{
      invalidated: makeReducer(false, {
        [FORM_SUBMIT_SUCCESS+'/post_edit']: () => true,
        [POST_UPDATE_PUBLICATION]: () => true,
        [INIT_DATALIST]: () => true,
        [POST_DELETE]: () => true
      })
    },{
    selectable: false
  }),
  post: makeReducer({}, {
    [POST_LOAD]: (state, action) => action.post,
    [POST_UPDATE_PUBLICATION]: (state, action) => action.post,
    [POST_RESET]: () => ({}),
    [UPDATE_POST_COMMENT]: (state, action) => {
      const post = cloneDeep(state)
      const commentIndex = post.comments.findIndex(e => e.id === action.comment.id)
      post.comments[commentIndex] = action.comment
      return post
    },
    [CREATE_POST_COMMENT]: (state, action) => {
      const post = cloneDeep(state)
      post.comments.unshift(action.comment);
      return post
    },
    [DELETE_POST_COMMENT]: (state, action) => {
      const post = cloneDeep(state)
      const commentIndex = post.comments.findIndex(e => e.id === action.commentId)
      post.comments.splice(commentIndex, 1);
      return post
    }
  }),
  post_edit: makeFormReducer('post_edit'),
  resourceNode: makeReducer({}, {}),
  blog: combineReducers({
    data: combineReducers({
      id: makeReducer({}, {}),
      title: makeReducer({}, {}),
      authors: makeReducer({}, {}),
      archives: makeReducer({}, {}),
      options: makeFormReducer('blog.data.options'),
      originalOptions: makeReducer({}, {}),
      tags: combineReducers({
        id: makeReducer("new", {}),
        tags: makeReducer(['tag1','tag2'], {})
      }),
    })
  })
}
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