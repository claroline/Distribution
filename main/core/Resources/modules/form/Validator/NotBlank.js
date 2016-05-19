export default class NotBlank {
  constructor () {}

  validate (el) {
    return !(el === undefined || el === '' || el === null)
  }

  getErrorMessage (el) {
    return 'value_not_blank'
  }
}
