/*
 * This file is part of the Claroline Connect package.
 *
 * (c) Claroline Consortium <consortium@claroline.net>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

/*global Routing*/

export default class SessionEventEditionModalCtrl {
  constructor($http, $uibModalInstance, CourseService, sessionEvent, callback) {
    this.$http = $http
    this.$uibModalInstance = $uibModalInstance
    this.callback = callback
    this.source = sessionEvent
    this.sessionEvent = {
      name: null,
      startDate: null,
      endDate: null,
      description: null,
      location: null
    }
    this.sessionEventErrors = {
      name: null,
      startDate: null,
      endDate: null
    }
    this.dateOptions = {
      formatYear: 'yy',
      startingDay: 1,
      placeHolder: 'jj/mm/aaaa'
    }
    this.dates = {
      start: {format: 'dd/MM/yyyy', open: false},
      end: {format: 'dd/MM/yyyy', open: false}
    }
    this.tinymceOptions = CourseService.getTinymceConfiguration()
    this.initializeSessionEvent()
  }

  initializeSessionEvent () {
    this.sessionEvent['name'] = this.source['name']
    this.sessionEvent['startDate'] = this.source['startDate'].replace(/\+.*$/, '')
    this.sessionEvent['endDate'] = this.source['endDate'].replace(/\+.*$/, '')

    if (this.source['description']) {
      this.sessionEvent['description'] = this.source['description']
    }

    if (this.source['location']) {
      this.sessionEvent['location'] = this.source['location']
    }
  }

  submit () {
    this.resetErrors()

    if (!this.sessionEvent['name']) {
      this.sessionEventErrors['name'] = Translator.trans('form_not_blank_error', {}, 'cursus')
    } else {
      this.sessionEventErrors['name'] = null
    }

    if (!this.sessionEvent['startDate']) {
      if (this.sessionEvent['startDate'] === null) {
        this.sessionEventErrors['startDate'] = Translator.trans('form_not_blank_error', {}, 'cursus')
      } else {
        this.sessionEventErrors['startDate'] = Translator.trans('form_not_valid_error', {}, 'cursus')
      }
    } else {
      this.sessionEventErrors['startDate'] = null
    }

    if (!this.sessionEvent['endDate']) {
      if (this.sessionEvent['endDate'] === null) {
        this.sessionEventErrors['endDate'] = Translator.trans('form_not_blank_error', {}, 'cursus')
      } else {
        this.sessionEventErrors['endDate'] = Translator.trans('form_not_valid_error', {}, 'cursus')
      }
    } else {
      this.sessionEventErrors['endDate'] = null
    }

    if (this.isValid()) {
      const url = Routing.generate('api_put_session_event_edition', {sessionEvent: this.source['id']})
      this.$http.post(url, {sessionEventDatas: this.sessionEvent}).then(d => {
        this.callback(d['data'])
        this.$uibModalInstance.close()
      })
    } else {
      console.log('Form is not valid.')
    }
  }

  resetErrors () {
    for (const key in this.sessionEventErrors) {
      this.sessionEventErrors[key] = null
    }
  }

  isValid () {
    let valid = true

    for (const key in this.sessionEventErrors) {
      if (this.sessionEventErrors[key]) {
        valid = false
        break
      }
    }

    return valid
  }

  openDatePicker (type) {
    if (type === 'start') {
      this.dates['start']['open'] = true
    } else if (type === 'end') {
      this.dates['end']['open'] = true
    }
  }
}
