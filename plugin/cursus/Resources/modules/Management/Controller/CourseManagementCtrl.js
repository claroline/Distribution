/*
 * This file is part of the Claroline Connect package.
 *
 * (c) Claroline Consortium <consortium@claroline.net>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

/*global Routing*/

export default class CourseManagementCtrl {
  constructor($stateParams, NgTableParams, CourseService, SessionService) {
    this.CourseService = CourseService
    this.SessionService = SessionService
    this.courseId = $stateParams.courseId
    this.course = CourseService.getCourse()
    this.openSessions = SessionService.getOpenCourseSessionsByCourse(this.courseId)
    this.closedSessions = SessionService.getClosedCourseSessionsByCourse(this.courseId)
    this.breadCrumbLabel = ''
    this.isCollapsed = {
      description: true,
      openSessions: false,
      closedSessions: false
    }
    this.tableParams = {
      openSessions: new NgTableParams(
        {count: 20},
        {counts: [10, 20, 50, 100], dataset: this.openSessions}
      ),
      closedSessions: new NgTableParams(
        {count: 20},
        {counts: [10, 20, 50, 100], dataset: this.closedSessions}
      )
    }
    this.initialize()
    this._updateCourseCallback = this._updateCourseCallback.bind(this)
    this._addSessionCallback = this._addSessionCallback.bind(this)
    this._updateSessionCallback = this._updateSessionCallback.bind(this)
  }

  _updateCourseCallback (data) {
    this.CourseService._updateCourseCallback(data)
    const courseJson = JSON.parse(data)
    this.course = courseJson
    this.breadCrumbLabel = courseJson['title']
  }

  _addSessionCallback (data) {
    this.SessionService._addSessionCallback(data)
    this.refreshSessionsTables()
  }

  _updateSessionCallback(data) {
    this.SessionService._updateSessionCallback(data)
    this.refreshSessionsTables()
  }

  initialize() {
    let result = this.CourseService.getCourseById(this.courseId)

    if (result === 'initialized') {
      this.breadCrumbLabel = this.course['title']
    } else {
      result.then(d => {
        if (d === 'initialized' && this.course) {
          this.breadCrumbLabel = this.course['title']
        }
      })
    }
    this.SessionService.loadSessionsByCourse(this.courseId)
  }

  editCourse () {
    console.log(this.course)
    this.CourseService.editCourse(this.course, this._updateCourseCallback)
  }

  createSession () {
    this.SessionService.createSession(this.course, this._addSessionCallback)
  }

  editSession (session) {
    this.SessionService.editSession(session, this._updateSessionCallback)
  }

  deleteSession (sessionId) {
    this.SessionService.deleteSession(sessionId)
  }

  openWorkspace (sessionId) {
    this.SessionService.getWorkspaceFromSessionId(sessionId).then(d => {
      if (d) {
        window.location = Routing.generate('claro_workspace_open', {workspaceId: d})
      }
    })
  }

  refreshSessionsTables () {
    this.tableParams['openSessions'].reload()
    this.tableParams['closedSessions'].reload()
  }
}