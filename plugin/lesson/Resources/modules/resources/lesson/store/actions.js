import {API_REQUEST} from '#/main/app/api'
import {makeActionCreator} from '#/main/core/scaffolding/actions'
import {actions as formActions} from '#/main/core/data/form/actions'

export const CHAPTER_LOAD    = 'CHAPTER_LOAD'
export const CHAPTER_RESET   = 'CHAPTER_RESET'
export const CHAPTER_CREATE  = 'CHAPTER_CREATE'
export const CHAPTER_EDIT    = 'CHAPTER_EDIT'
export const CHAPTER_DELETED = 'CHAPTER_DELETED'
export const TREE_LOADED     = 'TREE_LOADED'

export const actions = {}

actions.chapterLoad    = makeActionCreator(CHAPTER_LOAD, 'chapter')
actions.chapterReset   = makeActionCreator(CHAPTER_RESET)
actions.chapterCreate  = makeActionCreator(CHAPTER_CREATE)
actions.chapterEdit    = makeActionCreator(CHAPTER_EDIT)
actions.chapterDeleted = makeActionCreator(CHAPTER_DELETED, 'chapterSlug', 'children')
actions.treeLoaded     = makeActionCreator(TREE_LOADED, 'tree')

actions.loadChapter = (lessonId, chapterSlug) => dispatch => {
  dispatch(actions.chapterReset())
  dispatch({[API_REQUEST]: {
    url:['apiv2_lesson_chapter_get', {lessonId, chapterSlug}],
    success: (response, dispatch) => dispatch(actions.chapterLoad(response))
  }})
}

actions.editChapter = (formName, lessonId, chapterSlug) => dispatch => {
  dispatch(formActions.resetForm(formName, {}, true))
  dispatch(actions.chapterReset())
  dispatch(actions.chapterEdit())
  dispatch({[API_REQUEST]: {
    url: ['apiv2_lesson_chapter_get', {lessonId, chapterSlug}],
    success: (response, dispatch) => dispatch(formActions.resetForm(formName, response, false))
  }})
}

actions.createChapter = formName => dispatch => {
  dispatch(formActions.resetForm(formName, {}, true))
  dispatch(actions.chapterCreate())
}

actions.deleteChapter = (lessonId, chapterSlug, deleteChildren = false) => dispatch => {
  dispatch({[API_REQUEST]: {
    url: ['apiv2_lesson_chapter_delete', {lessonId, chapterSlug}],
    request: {
      method: 'DELETE',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        deleteChildren: deleteChildren,
        permanently: false
      })
    },
    success: (response, dispatch) => {
      dispatch(actions.chapterDeleted(chapterSlug, deleteChildren))
    }
  }})
}

actions.fetchChapterTree = lessonId => dispatch => {
  dispatch({[API_REQUEST]: {
    url: ['apiv2_lesson_tree_get', {lessonId}],
    success: (response, dispatch) => dispatch(actions.treeLoaded(response))
  }})
}