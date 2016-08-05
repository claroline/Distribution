/*
 * This file is part of the Claroline Connect package.
 *
 * (c) Claroline Consortium <consortium@claroline.net>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

/*global Routing*/
/*global Translator*/

export default class SessionEventRepeatModalCtrl {
  constructor($http, $uibModalInstance, sessionEvent, callback) {
    this.$http = $http
    this.$uibModalInstance = $uibModalInstance
    this.sessionEvent = sessionEvent
    this.callback = callback
    this.repeatOptions = {
      iteration: null,
      endDate: null,
      duration: null
    }
    this.repeatOptionsErrors = {
      iteration: null,
      endDate: null,
      duration: null
    }
    this.dateOptions = {
      formatYear: 'yy',
      startingDay: 1,
      placeHolder: 'jj/mm/aaaa'
    }
    this.dateOptions = {formatYear: 'yy', startingDay: 1, placeHolder: 'jj/mm/aaaa'}
    this.endDate = {date: null, format: 'dd/MM/yyyy', open: false}
    this.iterations = [
      {name: Translator.trans('every_day', {}, 'cursus'), value: 0},
      {name: Translator.trans('every_week', {}, 'cursus'), value: 1}
    ]
    this.iteration = null
  }

  submit () {
    this.repeatOptions['endDate'] = null
    this.resetErrors()

    if (!this.iteration) {
      this.repeatOptionsErrors['iteration'] = Translator.trans('form_not_blank_error', {}, 'cursus')
      this.repeatOptions['iteration'] = null
    } else {
      this.repeatOptions['iteration'] = this.iteration['value']
    }

    if (!this.endDate['date'] && !this.repeatOptions['duration']) {
      if (this.endDate['date'] === null) {
        this.repeatOptionsErrors['endDate'] = Translator.trans('form_not_blank_error', {}, 'cursus')
      } else {
        this.repeatOptionsErrors['endDate'] = Translator.trans('form_not_valid_error', {}, 'cursus')
      }
      this.repeatOptionsErrors['duration'] = Translator.trans('form_not_blank_error', {}, 'cursus')
    }

    if (this.repeatOptions['duration']) {
      this.repeatOptions['duration'] = parseInt(this.repeatOptions['duration'])

      if (this.repeatOptions['duration'] < 1) {
        this.repeatOptionsErrors['duration'] = Translator.trans('form_number_superior_error', {value: 1}, 'cursus')
      }
    }

    if (this.isValid()) {
      if (this.endDate['date']) {
        this.repeatOptions['endDate'] = this.endDate['date'].toString()
        this.repeatOptions['endDate'] = this.repeatOptions['endDate'].replace(/\+.*$/, '')
      }
      const url = Routing.generate('api_post_session_event_repeat', {sessionEvent: this.sessionEvent['id']})
      this.$http.post(url, {repeatOptionsDatas: this.repeatOptions}).then(d => {
        this.callback(d['data'])
        this.$uibModalInstance.close()
      })
    }
  }

  resetErrors () {
    for (const key in this.repeatOptionsErrors) {
      this.repeatOptionsErrors[key] = null
    }
  }

  isValid () {
    let valid = true

    for (const key in this.repeatOptionsErrors) {
      if (this.repeatOptionsErrors[key]) {
        valid = false
        break
      }
    }

    return valid
  }

  openDatePicker () {
    this.endDate['open'] = true
  }
}
