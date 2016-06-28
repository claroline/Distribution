/*
 * This file is part of the Claroline Connect package.
 *
 * (c) Claroline Consortium <consortium@claroline.net>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

export default class SessionService {
  constructor ($http, $sce, $uibModal) {
    this.$http = $http
    this.$sce = $sce
    this.$uibModal = $uibModal
    this.initialized = false
    this.session = {}
    this.sessions = []
    this.courseSessions = {}
    this.openCourseSessions = {}
    this.closedCourseSessions = {}
    this._addSessionCallback = this._addSessionCallback.bind(this)
    this._updateSessionCallback = this._updateSessionCallback.bind(this)
    this._removeSessionCallback = this._removeSessionCallback.bind(this)
    this._resetDefaultSessionCallback = this._resetDefaultSessionCallback.bind(this)
  }

  _addSessionCallback(data) {
    if (this.initialized) {
      const sessionsJson = JSON.parse(data)

      if (Array.isArray(sessionsJson)) {
        sessionsJson.forEach(s => {
          if (s['course']['id']) {
            const courseId = s['course']['id']
            s['course_title'] = s['course']['title']
            s['course_code'] = s['course']['code']

            if (s['default_session']) {
              this._resetDefaultSessionCallback(courseId, s['id'])
            }
            this.courseSessions[courseId].push(s)
            this.computeSessionsStatusByCourse(courseId)
          }
          this.sessions.push(s)
        })
      } else {
        if (sessionsJson['course']['id']) {
          const courseId = sessionsJson['course']['id']
          sessionsJson['course_title'] = sessionsJson['course']['title']
          sessionsJson['course_code'] = sessionsJson['course']['code']

          if (sessionsJson['default_session']) {
            this._resetDefaultSessionCallback(courseId, sessionsJson['id'])
          }
          this.courseSessions[courseId].push(sessionsJson)
          this.computeSessionsStatusByCourse(courseId)
        }
        this.sessions.push(sessionsJson)
      }
    }
  }

  _updateSessionCallback(data) {
    if (this.initialized) {
      const sessionJson = JSON.parse(data)
      sessionJson['course_title'] = sessionJson['course']['title']
      sessionJson['course_code'] = sessionJson['course']['code']
      const isDefault = sessionJson['default_session']
      const sessionId = sessionJson['id']
      const courseId = sessionJson['course']['id']
      const index = this.sessions.findIndex(s => s['id'] === sessionId)
      const sessionIndex = this.courseSessions[courseId].findIndex(s => s['id'] === sessionId)

      if (isDefault) {
        this.resetDefaultSession(courseId, sessionId)
      }

      if (index > -1) {
        this.sessions[index] = sessionJson
      }

      if (sessionIndex > -1) {
        this.courseSessions[courseId][sessionIndex] = sessionJson
      }
      this.computeSessionsStatusByCourse(courseId)
    }
  }

  _removeSessionCallback(data) {
    if (this.initialized) {
      const sessionJson = JSON.parse(data)
      const courseId = sessionJson['course']['id']
      const index = this.sessions.findIndex(s => s['id'] === sessionJson['id'])
      const sessionIndex = this.courseSessions[courseId].findIndex(s => s['id'] === sessionJson['id'])

      if (index > -1) {
        this.sessions.splice(index, 1)
      }

      if (sessionIndex > -1) {
        this.courseSessions[courseId].splice(sessionIndex, 1)
      }
      this.computeSessionsStatusByCourse(courseId)
    }
  }

  _resetDefaultSessionCallback (courseId, sessionId) {
    this.courseSessions[courseId].forEach(s => {
      if (s['default_session'] && s['id'] !== sessionId) {
        s['default_session'] = false
      }
    })
  }

  isInitialized () {
    return this.initialized
  }

  getSession () {
    return this.session
  }

  getSessions () {
    return this.sessions
  }

  getCourseSessions () {
    return this.courseSessions
  }

  getOpenCourseSessions () {
    return this.openCourseSessions
  }

  getClosedCourseSessions () {
    return this.closedCourseSessions
  }

  getOpenCourseSessionsByCourse (courseId) {
    if (!this.openCourseSessions[courseId]) {
      this.openCourseSessions[courseId] = []
    }

    return this.openCourseSessions[courseId]
  }

  getClosedCourseSessionsByCourse (courseId) {
    if (!this.closedCourseSessions[courseId]) {
      this.closedCourseSessions[courseId] = []
    }

    return this.closedCourseSessions[courseId]
  }

  loadSessions (callback = null) {
    if (!this.initialized) {
      this.sessions.splice(0, this.sessions.length)
      const route = Routing.generate('api_get_sessions')

      return this.$http.get(route).then(d => {
        if (d['status'] === 200) {
          angular.merge(this.sessions, d['data'])
          this.computeSessionsStatus()
          this.generateCourseInfos()
          this.generateCourseSessions()
          this.initialized = true

          if (callback !== null) {
            callback(d['data'])
          }
        }
      })
    }
  }

  loadSessionsByCourse(courseId, callback = null) {
    if (this.courseSessions[courseId] !== undefined) {
      this.computeSessionsStatusByCourse(courseId)
    } else {
      const route = Routing.generate('api_get_sessions_by_course', {course: courseId})
      this.$http.get(route).then(d => {
        if(d['status'] === 200) {
          this.courseSessions[courseId] = d['data']
          this.computeSessionsStatusByCourse(courseId)

          if (callback !== null) {
            callback(d['data'])
          }
        }
      })
    }
  }

  createSession (courseId, callback = null) {
    const addCallback = callback !== null ? callback : this._addSessionCallback
    const modal = this.$uibModal.open({
      templateUrl: Routing.generate('api_get_session_creation_form', {course: courseId}),
      controller: 'SessionCreationModalCtrl',
      controllerAs: 'cmc',
      resolve: {
        courseId: () => { return courseId },
        callback: () => { return addCallback }
      }
    })

    modal.result.then(result => {
      if (!result) {
        return
      } else {
        addCallback(result)
      }
    })
  }

  editSession (sessionId, callback = null) {
    const updateCallback = callback !== null ? callback : this._updateSessionCallback
    const modal = this.$uibModal.open({
      templateUrl: Routing.generate('api_get_session_edition_form', {session: sessionId}) + '?bust=' + Math.random().toString(36).slice(2),
      controller: 'SessionEditionModalCtrl',
      controllerAs: 'cmc',
      resolve: {
        sessionId: () => { return sessionId },
        callback: () => { return updateCallback }
      }
    })

    modal.result.then(result => {
      if (!result) {
        return
      } else {
        updateCallback(result)
      }
    })
  }

  deleteSession (sessionId, callback = null) {
    const deleteCallback = callback !== null ? callback : this._removeSessionCallback
    const modal = this.$uibModal.open({
      template: require('../Partial/session_delete_modal.html'),
      controller: 'SessionDeletionModalCtrl',
      controllerAs: 'cmc',
      resolve: {
        sessionId: () => { return sessionId },
        callback: () => { return deleteCallback }
      }
    })
  }

  resetDefaultSession (courseId, sessionId) {
    const route = Routing.generate('api_put_session_default_reset', {course: courseId, session: sessionId})
    this.$http.put(route).then(d => {
      if (d['status'] === 200) {
        this._resetDefaultSessionCallback(courseId, sessionId)
      }
    })
  }

  getSessionStatus (start, end, now = null) {
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

  generateCourseInfos () {
    this.sessions.forEach(s => {
      const courseTitle = s['course']['title']
      const courseCode = s['course']['code']
      s['course_title']= courseTitle
      s['course_code']= courseCode
    })
  }

  generateCourseSessions () {
    let coursesDone = {}
    this.sessions.forEach(s => {
      const courseId = s['course']['id']

      if (!coursesDone[courseId]) {
        if (this.courseSessions[courseId]) {
          this.courseSessions[courseId].splice(0, this.courseSessions[courseId].length)
        } else {
          this.courseSessions[courseId] = []
        }
        coursesDone[courseId] = true
      }
      this.courseSessions[courseId].push(s)
    })
  }

  computeSessionsStatus () {
    const now = new Date()

    this.sessions.forEach(s => {
      s['status'] = this.getSessionStatus(s['start_date'], s['end_date'], now)
    })
  }

  computeSessionsStatusByCourse (courseId) {
    const now = new Date()

    if (this.openCourseSessions[courseId]) {
      this.openCourseSessions[courseId].splice(0, this.openCourseSessions[courseId].length)
    } else {
      this.openCourseSessions[courseId] = []
    }

    if (this.closedCourseSessions[courseId]) {
      this.closedCourseSessions[courseId].splice(0, this.closedCourseSessions[courseId].length)
    } else {
      this.closedCourseSessions[courseId] = []
    }

    this.courseSessions[courseId].forEach(s => {
      s['status'] = this.getSessionStatus(s['start_date'], s['end_date'], now)

      if (s['status'] === 'closed') {
        this.closedCourseSessions[courseId].push(s)
      } else {
        this.openCourseSessions[courseId].push(s)
      }
    })
  }

  getWorkspaceFromSessionId (sessionId) {
    const route = Routing.generate('api_get_workspace_id_from_session', {session: sessionId})

    return this.$http.get(route).then(d => {
      if (d['status'] === 200) {
        return d['data']
      }
    })
  }

  getSessionById (sessionId) {
    const index = this.sessions.findIndex(s => s['id'] === sessionId)

    if (index > -1) {
      this.session = this.sessions[index]

      return 'initialized'
    } else {
      for (const key in this.session) {
        delete this.session[key]
      }
      const route = Routing.generate('api_get_session_by_id', {session: sessionId})
      return this.$http.get(route).then(d => {
        if (d['status'] === 200) {
          const datas = JSON.parse(d['data'])

          for (const key in datas) {
            this.session[key] = datas[key]
          }

          return 'initialized'
        }
      })
    }
  }
}