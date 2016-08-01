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
import sessionEventFormTemplate from '../Partial/session_event_form_modal.html'

export default class SessionEventService {
  constructor ($http, $sce, $uibModal, ClarolineAPIService) {
    this.$http = $http
    this.$sce = $sce
    this.$uibModal = $uibModal
    this.ClarolineAPIService = ClarolineAPIService
    this.sessionEvents = {}
    this.openSessionEvents = {}
    this.closedSessionEvents = {}
    this._addSessionEventCallback = this._addSessionEventCallback.bind(this)
    this._updateSessionEventCallback = this._updateSessionEventCallback.bind(this)
    this._removeSessionEventCallback = this._removeSessionEventCallback.bind(this)
  }

  _addSessionEventCallback(data) {
    const eventJson = JSON.parse(data)

    if (eventJson['session']['id']) {
      const sessionId = eventJson['session']['id']
      this.sessionEvents[sessionId].push(eventJson)
      this.computeSessionEventsStatusBySession(sessionId)
    }
  }

  _updateSessionEventCallback(data) {
    const eventJson = JSON.parse(data)
    const sessionId = eventJson['session']['id']
    const eventIndex = this.sessionEvents[sessionId].findIndex(e => e['id'] === eventJson['id'])

    if (eventIndex > -1) {
      this.sessionEvents[sessionId][eventIndex] = eventJson
    }
    this.computeSessionEventsStatusBySession(sessionId)
  }

  _removeSessionEventCallback(data) {
    const eventJson = JSON.parse(data)
    const sessionId = eventJson['session']['id']
    const eventIndex = this.sessionEvents[sessionId].findIndex(e => e['id'] === eventJson['id'])

    if (eventIndex > -1) {
      this.sessionEvents[sessionId].splice(eventIndex, 1)
    }
    this.computeSessionEventsStatusBySession(sessionId)
  }

  getSessionEvents () {
    return this.sessionEvents
  }

  getOpenSessionEvents () {
    return this.openSessionEvents
  }

  getOpenSessionEventsBySession (sessionId) {
    if (!this.openSessionEvents[sessionId]) {
      this.openSessionEvents[sessionId] = []
    }

    return this.openSessionEvents[sessionId]
  }

  getClosedSessionEvents () {
    return this.closedSessionEvents
  }

  getClosedSessionEventsBySession (sessionId) {
    if (!this.closedSessionEvents[sessionId]) {
      this.closedSessionEvents[sessionId] = []
    }

    return this.closedSessionEvents[sessionId]
  }

  loadEventsBySession (sessionId, callback = null) {
    if (this.sessionEvents[sessionId] !== undefined) {
      this.computeSessionEventsStatusBySession(sessionId)
    } else {
      const route = Routing.generate('api_get_session_events_by_session', {session: sessionId})
      this.$http.get(route).then(d => {
        if(d['status'] === 200) {
          this.sessionEvents[sessionId] = d['data']
          this.computeSessionEventsStatusBySession(sessionId)

          if (callback !== null) {
            callback(d['data'])
          }
        }
      })
    }
  }

  createSessionEvent (session, callback = null) {
    const addCallback = (callback !== null) ? callback : this._addSessionEventCallback
    this.$uibModal.open({
      template: sessionEventFormTemplate,
      controller: 'SessionEventCreationModalCtrl',
      controllerAs: 'cmc',
      resolve: {
        title: () => { return Translator.trans('session_event_creation', {}, 'cursus') },
        session: () => { return session },
        callback: () => { return addCallback }
      }
    })
  }

  editSessionEvent (sessionEvent, callback = null) {
    const updateCallback = callback !== null ? callback : this._updateSessionEventCallback
    this.$uibModal.open({
      template: sessionEventFormTemplate,
      controller: 'SessionEventEditionModalCtrl',
      controllerAs: 'cmc',
      resolve: {
        title: () => { return Translator.trans('session_event_edition', {}, 'cursus') },
        sessionEvent: () => { return sessionEvent },
        callback: () => { return updateCallback }
      }
    })
  }

  deleteSessionEvent (sessionEventId, callback = null) {
    const url = Routing.generate('api_delete_session_event', {sessionEvent: sessionEventId})
    const deleteCallback = (callback !== null) ? callback : this._removeSessionEventCallback

    this.ClarolineAPIService.confirm(
      {url, method: 'DELETE'},
      deleteCallback,
      Translator.trans('delete_session_event', {}, 'cursus'),
      Translator.trans('delete_session_event_confirm_message', {}, 'cursus')
    )
  }

  getSessionEventStatus (start, end, now = null) {
    let status = ''
    const startDate = new Date(start)
    const endDate = new Date(end)
    const currentDate = (now === null) ? new Date() : now
    //startDate.setHours(0, 0, 0, 0, 0)
    //endDate.setHours(0, 0, 0, 0, 0)
    //currentDate.setHours(0, 0, 0, 0, 0)

    if (startDate.getTime() > currentDate.getTime()) {
      status = 'not_started'
    } else if (startDate.getTime() <= currentDate.getTime() && endDate.getTime() > currentDate.getTime()) {
      status = 'ongoing'
    } else if (endDate.getTime() < currentDate.getTime()) {
      status = 'closed'
    }

    return status
  }

  computeSessionEventsStatusBySession (sessionId) {
    const now = new Date()

    if (this.openSessionEvents[sessionId]) {
      this.openSessionEvents[sessionId].splice(0, this.openSessionEvents[sessionId].length)
    } else {
      this.openSessionEvents[sessionId] = []
    }

    if (this.closedSessionEvents[sessionId]) {
      this.closedSessionEvents[sessionId].splice(0, this.closedSessionEvents[sessionId].length)
    } else {
      this.closedSessionEvents[sessionId] = []
    }

    this.sessionEvents[sessionId].forEach(e => {
      e['status'] = this.getSessionEventStatus(e['startDate'], e['endDate'], now)

      if (e['status'] === 'closed') {
        this.closedSessionEvents[sessionId].push(e)
      } else {
        this.openSessionEvents[sessionId].push(e)
      }
    })
  }
}