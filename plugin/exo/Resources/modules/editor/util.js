import nprogress from 'nprogress/nprogress'

nprogress.configure({ parent: '.section-content' })

let loadingQueue = 0

// Counter for temporary id generation
let idCount = 0

// Asserts a condition is met. If not, throws an exception
// with a given error message.
export function assert(test, message) {
  if (!message) {
    throw new Error('An assertion failure message is required')
  }

  if (!test) {
    const error = new Error(message)
    error.name = 'Assertion failure'
    throw error
  }
}

// Generates a temporary id based on an integer counter.
export function newId() {
  return `generated-id-${++idCount}`
}

// Returns the last generated id (mainly for test purposes)
export function lastId() {
  return `generated-id-${idCount}`
}

// Resets the id integer counter (*TEST PURPOSE ONLY*)
export function resetIdCount() {
  idCount = 0
}

export function startLoading() {
  if (++loadingQueue === 1) {
    nprogress.start()
  }
}

export function endLoading() {
  if (--loadingQueue == 0) {
    nprogress.done()
  } else {
    nprogress.inc()
  }
}
