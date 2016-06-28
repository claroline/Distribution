/*
 * This file is part of the Claroline Connect package.
 *
 * (c) Claroline Consortium <consortium@claroline.net>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

export default class SessionManagementCtrl {
  constructor($stateParams, NgTableParams, SessionService, SessionEventService) {
    this.SessionService = SessionService
    this.SessionEventService = SessionEventService
    this.sessionId = $stateParams.sessionId
    this.session = SessionService.getSession()
    this.openEvents = SessionEventService.getOpenSessionEventsBySession(this.sessionId)
    this.closedEvents = SessionEventService.getClosedSessionEventsBySession(this.sessionId)
    this.learners = []
    this.tutors = []
    this.breadCrumbLabel = ''
    this.isCollapsed = {
      description: true,
      learners: false,
      tutors: false,
      openEvents: false,
      closedEvents: false
    }
    this.tableParams = {
      learners: new NgTableParams(
        {count: 20},
        {counts: [10, 20, 50, 100], dataset: this.learners}
      ),
      tutors: new NgTableParams(
        {count: 20},
        {counts: [10, 20, 50, 100], dataset: this.tutors}
      ),
      openEvents: new NgTableParams(
        {count: 20},
        {counts: [10, 20, 50, 100], dataset: this.openEvents}
      ),
      closedEvents: new NgTableParams(
        {count: 20},
        {counts: [10, 20, 50, 100], dataset: this.closedEvents}
      )
    }
    this.initialize()
    this._updateSessionCallback = this._updateSessionCallback.bind(this)
    this._addSessionEventCallback = this._addSessionEventCallback.bind(this)
    this._updateSessionEventCallback = this._updateSessionEventCallback.bind(this)
    this._removeSessionEventCallback = this._removeSessionEventCallback.bind(this)
  }

  _updateSessionCallback(data) {
    this.SessionService._updateSessionCallback(data)
    const sessionJson = JSON.parse(data)
    this.session = sessionJson
    this.breadCrumbLabel = sessionJson['name']
  }

  _addSessionEventCallback(data) {
    this.SessionEventService._addSessionEventCallback(data)
    this.refreshEventsTables()
  }

  _updateSessionEventCallback(data) {
    this.SessionEventService._updateSessionEventCallback(data)
    this.refreshEventsTables()
  }

  _removeSessionEventCallback(data) {
    this.SessionEventService._removeSessionEventCallback(data)
    this.refreshEventsTables()
  }

  initialize() {
    let result = this.SessionService.getSessionById(this.sessionId)

    if (result === 'initialized') {
        this.breadCrumbLabel = this.session['name']
    } else {
      result.then(d => {
        if (d === 'initialized' && this.session) {
          this.breadCrumbLabel = this.session['name']
        }
      })
    }
    this.SessionEventService.loadEventsBySession(this.sessionId)
  }

  editSession () {
    this.SessionService.editSession(this.sessionId, this._updateSessionCallback)
  }

  editEvent (eventId) {
    this.SessionEventService.editSessionEvent(eventId, this._updateSessionEventCallback)
  }

  deleteEvent (eventId) {
    this.SessionEventService.deleteSessionEvent(eventId, this._removeSessionEventCallback)
  }

  refreshEventsTables () {
    this.tableParams['openEvents'].reload()
    this.tableParams['closedEvents'].reload()
  }
}