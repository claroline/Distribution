import get from 'lodash/get'

function getInfo(course, session, path) {
  if (session && get(session, path)) {
    return get(session, path)
  } else if (get(course, path)) {
    return get(course, path)
  }

  return null
}

export {
  getInfo
}
