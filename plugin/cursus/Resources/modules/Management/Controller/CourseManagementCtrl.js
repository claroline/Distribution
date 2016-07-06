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
    this._updateSessionCallback = this._updateSessionCallback.bind(this)
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

  editSession (sessionId) {
    this.SessionService.editSession(sessionId, this._updateSessionCallback)
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
    this.openTableParams.reload()
    this.closedTableParams.reload()
  }
}