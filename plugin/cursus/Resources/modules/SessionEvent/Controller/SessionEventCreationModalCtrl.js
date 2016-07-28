/*
 * This file is part of the Claroline Connect package.
 *
 * (c) Claroline Consortium <consortium@claroline.net>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

/*global Routing*/

export default class SessionEventCreationModalCtrl {
  constructor($http, $uibModalInstance, CourseService, session, callback) {
    this.$http = $http
    this.$uibModalInstance = $uibModalInstance
    this.CourseService = CourseService
    this.session = session
    this.callback = callback
    this.sessionEvent = {
      name: null,
      startDate: null,
      endDate: null,
      description: null,
      location: null,
      internalLocation: false,
      locationResource: null
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
    this.locationResources = []
    this.locationResource = null
    this.initializeSessionEvent()
  }

  initializeSessionEvent () {
    this.sessionEvent['startDate'] = this.session['startDate'].replace(/\+.*$/, '')
    this.sessionEvent['endDate'] = this.session['endDate'].replace(/\+.*$/, '')
    this.CourseService.getLocationResources().then(d => {
      d.forEach(r => this.locationResources.push(r))
    })
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

    if (this.locationResource) {
      this.sessionEvent['locationResource'] = this.locationResource['id']
    } else {
      this.sessionEvent['locationResource'] = null
    }

    if (this.isValid()) {
      const url = Routing.generate('api_post_session_event_creation', {session: this.session['id']})
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
