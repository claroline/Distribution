import {API_REQUEST} from '#/main/core/api/actions'
import {actions as formActions} from '#/main/core/data/form/actions'
import {makeActionCreator} from '#/main/core/scaffolding/actions'
import {constants} from '#/plugin/blog/resources/blog/constants.js'
import {actions as listActions} from '#/main/core/data/list/actions'
import {now} from '#/main/core/scaffolding/date'

//export const BLOG_OPEN = 'BLOG_OPEN'

export const POSTS_LOAD = 'POSTS_LOAD'
export const POST_LOAD = 'POST_LOAD'
export const POST_RESET = 'POST_RESET'
export const POST_DELETE = 'POST_DELETE'
export const POST_UPDATE_PUBLICATION = 'POST_UPDATE_PUBLICATION'
export const SWITCH_MODE = 'SWITCH_MODE'
export const POST_EDIT_RESET = 'POST_EDIT_RESET'
export const BLOG_OPTIONS_EDIT_RESET = ' BLOG_OPTIONS_EDIT_RESET'
export const INIT_DATALIST = ' INIT_DATALIST'
export const SHOW_COMMENTS = ' SHOW_COMMENTS'
export const SHOW_COMMENT_FORM = ' SHOW_COMMENT_FORM'
export const SHOW_EDIT_COMMENT_FORM = ' SHOW_EDIT_COMMENT_FORM'
export const CREATE_COMMENT = ' CREATE_COMMENT'
export const UPDATE_POST_COMMENT = 'UPDATE_POST_COMMENT'
export const CREATE_POST_COMMENT = 'CREATE_POST_COMMENT'
export const DELETE_POST_COMMENT = 'DELETE_POST_COMMENT'
  
export const actions = {}

actions.postsLoad = makeActionCreator(POSTS_LOAD, 'posts')
actions.postLoad = makeActionCreator(POST_LOAD, 'post')
actions.postDelete = makeActionCreator(POST_DELETE, 'postId')
actions.initDataList = makeActionCreator(INIT_DATALIST)
actions.postReset = makeActionCreator(POST_RESET)
actions.blogOptionsEditReset = makeActionCreator(BLOG_OPTIONS_EDIT_RESET)
actions.switchMode = makeActionCreator(SWITCH_MODE, 'mode')
actions.updatePostPublicationState = makeActionCreator(POST_UPDATE_PUBLICATION, 'post')
actions.showComments = makeActionCreator(SHOW_COMMENTS, 'value')
actions.showCommentForm = makeActionCreator(SHOW_COMMENT_FORM, 'value')
actions.showEditCommentForm = makeActionCreator(SHOW_EDIT_COMMENT_FORM, 'value')
actions.updateComment = makeActionCreator(UPDATE_POST_COMMENT, 'comment')
actions.createComment = makeActionCreator(CREATE_POST_COMMENT, 'comment')
actions.removeComment = makeActionCreator(DELETE_POST_COMMENT, 'commentId')

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

actions.createPost = (formName) => (dispatch) => {
  dispatch(formActions.resetForm(formName, {publicationDate: now()}, true))
  dispatch(actions.switchMode(constants.CREATE_POST))
}

actions.submitComment = (blogId, postId, comment) => (dispatch) => {
  const formData = new FormData()
  formData.append('comment', comment)
  dispatch({
    [API_REQUEST]: {
      url: ['apiv2_blog_comment_new', {blogId, postId}],
      request: {
        method: 'POST',
        body: formData
      },
      success: (response, dispatch) => {
        dispatch(actions.showCommentForm(false))
        dispatch(actions.createComment(response))
      }
    }
  })
}

actions.editComment = (blogId, postId, commentId, comment) => (dispatch) => {
  //const formData = new FormData()
  //formData.append('message', comment)
  dispatch({
    [API_REQUEST]: {
      url: ['apiv2_blog_comment_update', {blogId, postId, commentId}],
      request: {
        method: 'PUT',
        body: JSON.stringify(comment)
      },
      success: (response, dispatch) => {
        dispatch(actions.showEditCommentForm(false))
        dispatch(actions.updateComment(response))
      }
    }
  })
}

actions.publishComment = (blogId, postId, commentId) => (dispatch) => {
  dispatch({
    [API_REQUEST]: {
      url: ['apiv2_blog_comment_publish', {blogId, postId, commentId}],
      request: {
        method: 'PUT'
      },
      success: (response, dispatch) => {
        dispatch(actions.updateComment(response))
      }
    }
  })
}

actions.unpublishComment = (blogId, postId, commentId) => (dispatch) => {
  dispatch({
    [API_REQUEST]: {
      url: ['apiv2_blog_comment_unpublish', {blogId, postId, commentId}],
      request: {
        method: 'PUT'
      },
      success: (response, dispatch) => {
        dispatch(actions.updateComment(response))
      }
    }
  })
}

actions.deleteComment = (blogId, postId, commentId) => (dispatch) => {
  dispatch({
    [API_REQUEST]: {
      url: ['apiv2_blog_comment_delete', {blogId, postId, commentId}],
      request: {
        method: 'DELETE'
      },
      success: (response, dispatch) => {
        dispatch(actions.removeComment(commentId))
      }
    }
  })
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

actions.deletePost = (blogId, postId) => {
  return {[API_REQUEST]: {
    url:['apiv2_blog_post_delete', {blogId, postId}],
    request: {
      method: 'DELETE'
    },
    success: (response, dispatch) => {
      dispatch(actions.postDelete(postId))
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