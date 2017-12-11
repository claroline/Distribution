
const ACTION_GENERIC  = 'generic'
const ACTION_LOAD     = 'load'
const ACTION_REFRESH  = 'refresh'
const ACTION_SAVE     = 'save'
const ACTION_CREATE   = 'create'
const ACTION_UPDATE   = 'update'
const ACTION_DELETE   = 'delete'
const ACTION_SEND     = 'send'
const ACTION_UPLOAD   = 'upload'
const ACTION_DOWNLOAD = 'download'

const ACTIONS = {
  [ACTION_GENERIC]: {},
  [ACTION_LOAD]: {
    icon: 'fa fa-search'
  },
  [ACTION_REFRESH]: {
    icon: 'fa fa-recycle'
  },
  [ACTION_SAVE]: {
    icon: 'fa fa-floppy-o'
  },
  [ACTION_CREATE]: {
    icon: 'fa fa-floppy-o'
  },
  [ACTION_UPDATE]: {
    icon: 'fa fa-floppy-o'
  },
  [ACTION_DELETE]: {
    icon: 'fa fa-trash-o',
    dangerous: true
  },
  [ACTION_SEND]: {
    icon: 'fa fa-paper-plane-o'
  },
  [ACTION_UPLOAD]: {
    icon: 'fa fa-upload'
  },
  [ACTION_DOWNLOAD]: {
    icon: 'fa fa-download'
  }
}

// map actions on HTTP methods
const HTTP_ACTIONS = {
  OPTIONS: ACTION_LOAD,
  HEAD:    ACTION_LOAD,
  GET:     ACTION_LOAD,
  POST:    ACTION_CREATE,
  PUT:     ACTION_UPDATE,
  PATCH:   ACTION_UPDATE,
  DELETE:  ACTION_DELETE
}

export const constants = {
  ACTIONS,
  HTTP_ACTIONS,
  ACTION_GENERIC,
  ACTION_LOAD,
  ACTION_REFRESH,
  ACTION_SAVE,
  ACTION_CREATE,
  ACTION_UPDATE,
  ACTION_DELETE,
  ACTION_SEND,
  ACTION_UPLOAD,
  ACTION_DOWNLOAD
}
