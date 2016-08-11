/*
 * This file is part of the Claroline Connect package.
 *
 * (c) Claroline Consortium <consortium@claroline.net>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

/*global Translator*/

export default class SessionMailModalCtrl {
  constructor($http, $uibModalInstance, CourseService, session) {
    this.$http = $http
    this.$uibModalInstance = $uibModalInstance
    this.session = session
    this.mail = {
      object: null,
      body: null,
      internal: true,
      external: true
    }
    this.mailErrors = {
      object: null,
      body: null
    }
    this.tinymceOptions = CourseService.getTinymceConfiguration()
  }

  submit () {
    this.resetErrors()

    if (!this.mail['object']) {
      this.mailErrors['object'] = Translator.trans('form_not_blank_error', {}, 'cursus')
    } else {
      this.mailErrors['object'] = null
    }

    if (!this.mail['body']) {
      this.mailErrors['body'] = Translator.trans('form_not_blank_error', {}, 'cursus')
    } else {
      this.mailErrors['body'] = null
    }

    if (this.isValid()) {
      this.$uibModalInstance.close()
    }
  }

  resetErrors () {
    for (const key in this.mailErrors) {
      this.mailErrors[key] = null
    }
  }

  isValid () {
    let valid = true

    for (const key in this.mailErrors) {
      if (this.mailErrors[key]) {
        valid = false
        break
      }
    }

    return valid
  }
}
