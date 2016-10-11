import assert from 'assert'
import diff from 'json-diff'

export function assertEqual(actual, expected, message) {
  try {
    assert.deepStrictEqual(actual, expected, message)
  } catch (e) {
    const msg = message || ''
    e.message = `${msg}\n${diff.diffString(e.expected, e.actual)}`
    throw e
  }
}
