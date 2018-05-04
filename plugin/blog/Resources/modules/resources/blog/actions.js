import {API_REQUEST} from '#/main/core/api/actions'
import {actions as formActions} from '#/main/core/data/form/actions'
import {makeActionCreator} from '#/main/core/scaffolding/actions'
import {constants} from '#/plugin/blog/resources/blog/constants.js'
import {actions as listActions} from '#/main/core/data/list/actions'

//export const BLOG_OPEN = 'BLOG_OPEN'

export const POSTS_LOAD = 'POSTS_LOAD'
export const POST_LOAD = 'POST_LOAD'
export const POST_RESET = 'POST_RESET'
export const POST_UPDATE_PUBLICATION = 'POST_UPDATE_PUBLICATION'
export const SWITCH_MODE = 'SWITCH_MODE'
export const POST_EDIT_RESET = 'POST_EDIT_RESET'
export const BLOG_OPTIONS_EDIT_RESET = ' BLOG_OPTIONS_EDIT_RESET'
export const INIT_DATALIST = ' INIT_DATALIST'
  
export const actions = {}

actions.postsLoad = makeActionCreator(POSTS_LOAD, 'posts')
actions.postLoad = makeActionCreator(POST_LOAD, 'post')
actions.initDataList = makeActionCreator(INIT_DATALIST)
actions.postReset = makeActionCreator(POST_RESET)
actions.blogOptionsEditReset = makeActionCreator(BLOG_OPTIONS_EDIT_RESET)
actions.switchMode = makeActionCreator(SWITCH_MODE, 'mode')
actions.updatePostPublicationState = makeActionCreator(POST_UPDATE_PUBLICATION, 'post')

/*actions.getPosts = (blogId) => ({
  [API_REQUEST]: {
    url:['apiv2_blog_post_list', {blogId}],
    success: (response, dispatch) => {
      dispatch(actions.postsLoad(response));
      dispatch(actions.switchMode(constants.LIST_POSTS))
    }
  }
})*/

actions.getPost = (blogId, postId) => (dispatch) => {
  dispatch(actions.postReset());
  dispatch({[API_REQUEST]: {
    url:['apiv2_blog_post_get', {blogId, postId}],
    request: {
      method: 'GET'
    },
    success: (response, dispatch) => dispatch(actions.postLoad(response))
  }})
}

/*actions.editPost = (blogId, slug) => {
  actions.postReset()
  return {[API_REQUEST]: {
    url:['apiv2_blog_post_get', {blogId, slug}],
    success: (response, dispatch) => dispatch(actions.postEdit(response))
  }}
}*/

actions.editPost = (formName, blogId, postId) => (dispatch) => {
  //reset form from previous data
  dispatch(formActions.resetForm(formName, {}, true))
  if (postId) {
    dispatch({
      [API_REQUEST]: {
        url:['apiv2_blog_post_get', {blogId, postId}],
        request: {
          method: 'GET'
        },
        success: (response, dispatch) => {
          dispatch(formActions.resetForm(formName, response, false));
          dispatch(actions.switchMode(constants.EDIT_POST))
        }
      }
    })
  }
}

actions.editBlogOptions = (formName, blogId) => (dispatch, getState) => {
  //reset form from previous data
  dispatch(formActions.resetForm(formName, getState().blog.data.originalOptions, false));
  dispatch(actions.switchMode(constants.EDIT_OPTIONS))
}

/*actions.publishPost = (blogId, postId) => (dispatch) => {
  if (postId) {
    dispatch({
      [API_REQUEST]: {
        url:['apiv2_blog_post_publish', {blogId, postId}],
        success: (response, dispatch) => {

        }
      }
    })
  }
}*/

actions.createPost = (formName) => (dispatch) => {
  dispatch(formActions.resetForm(formName, {}, true))
  dispatch(actions.switchMode(constants.CREATE_POST))
}

actions.publishPost = (blogId, postId) => {
  return {[API_REQUEST]: {
    url:['apiv2_blog_post_publish', {blogId, postId}],
    request: {
      method: 'PUT'
    },
    success: (response, dispatch) => {
      dispatch(actions.updatePostPublicationState(response))
    }
  }}
}


/*actions.publishPost = (blogId, postId) => {
  return [API_REQUEST]: {
    url:['apiv2_blog_post_publish', {blogId, postId}],
    success: (response, dispatch) => {

    }
  }
}*/

/*actions.saveOptions = (blogId) => ({
  [API_REQUEST]: {
    url:['apiv2_blog_options', {blogId}],
    success: (response, dispatch) => dispatch(actions.getPosts(blogId))
  }
})*/
// formActions.saveForm('blog.data.options', ['apiv2_blog_update', {id: id}])


/*actions.editBlogOptions = (formName, blogId) => (dispatch) => {
  //reset form from previous data
  dispatch(formActions.resetForm(formName, {}, true))
  //actions.blogOptionsEditReset()
  dispatch({
    [API_REQUEST]: {
      url:['apiv2_blog_options', {blogId}],
      success: (response, dispatch) => {
        dispatch(formActions.resetForm(formName, response, false))
      }
    }
  })
}*/




/*actions.posts = (blogId) => {
  fetch('/icap_blog/apiv2/blog/'+blogId+'/posts', {
    method: 'GET'
  })
}*/

/*
 * actions.getPost = (blogId, postId) => ({
  [API_REQUEST]: {
    url:['apiv2_blog_post_get', {blogId, postId}],
    success: (response, dispatch) => dispatch(actions.postLoad(response))
  }
})
 */