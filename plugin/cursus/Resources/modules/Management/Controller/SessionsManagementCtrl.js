/*
 * This file is part of the Claroline Connect package.
 *
 * (c) Claroline Consortium <consortium@claroline.net>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

export default class SessionsManagementCtrl {
  constructor(NgTableParams, SessionService, SessionEventService) {
    //this.CourseService = CourseService
    this.SessionService = SessionService
    this.SessionEventService = SessionEventService
    //this.courses = CourseService.getCourses()
    this.sessions = SessionService.getSessions()
    this.events = SessionEventService.getOpenSessionEvents()
    this.selectedSessions = []
    this.tableParams = new NgTableParams(
      {count: 20},
      {counts: [10, 20, 50, 100], dataset: this.sessions}
    )
    this.filterStartDate = {
      date: null,
      format: 'dd/MM/yyyy',
      open: false
    }
    this.filterEndDate = {
      date: null,
      format: 'dd/MM/yyyy',
      open: false
    }
    this.dateOptions = {
      formatYear: 'yy',
      startingDay: 1,
      placeHolder: 'jj/mm/aaaa'
    }
    this.isCollapsed = {}
    this.initialize()
    //this._addCourseCallback = this._addCourseCallback.bind(this)
    //this._updateCourseCallback = this._updateCourseCallback.bind(this)
    //this._removeCourseCallback = this._removeCourseCallback.bind(this)
  }

  //_addCourseCallback (data) {
  //  const coursesJson = JSON.parse(data)
  //
  //  if (Array.isArray(coursesJson)) {
  //    coursesJson.forEach(c => {
  //      this.courses.push(c)
  //    })
  //  } else {
  //    this.courses.push(coursesJson)
  //  }
  //  this.tableParams.reload()
  //}
  //
  //_updateCourseCallback (data) {
  //  const courseJson = JSON.parse(data)
  //  const index = this.courses.findIndex(c => c['id'] === courseJson['id'])
  //
  //  if (index > -1) {
  //    this.courses[index] = courseJson
  //    this.tableParams.reload()
  //  }
  //}
  //
  //_removeCourseCallback (data) {
  //  const courseJson = JSON.parse(data)
  //  const index = this.courses.findIndex(c => c['id'] === courseJson['id'])
  //
  //  if (index > -1) {
  //    this.courses.splice(index, 1)
  //    this.tableParams.reload()
  //  }
  //}

  initialize() {
    this.SessionService.loadSessions()
  //  this.CourseService.loadCourses()
  }

  isInitialized () {
    return this.SessionService.isInitialized()
  }

  //createCourse () {
  //  this.CourseService.createCourse(this._addCourseCallback)
  //}
  //
  //editCourse (courseId) {
  //  this.CourseService.editCourse(courseId, this._updateCourseCallback)
  //}
  //
  //deleteCourse (courseId) {
  //  this.CourseService.deleteCourse(courseId, this._removeCourseCallback)
  //}
  //
  //viewCourse (courseId) {
  //  this.CourseService.viewCourse(courseId)
  //}
  //
  //importCourses () {
  //  this.CourseService.importCourses(this._addCourseCallback)
  //}
  //
  //test () {
  //  console.log(this.selectedCourses)
  //  const ids = this.selectedCourses.map((el) => {return el.id})
  //  console.log(ids)
  //}

  loadEvents (sessionId) {
    this.SessionEventService.loadEventsBySession(sessionId)
  }

  //createSession (courseId) {
  //  this.loadSessions(courseId)
  //  this.SessionService.createSession(courseId)
  //}

  editSession (sessionId) {
    this.SessionService.editSession(sessionId)
  }

  deleteSession (sessionId) {
    this.SessionService.deleteSession(sessionId)
  }

  createEvent (sessionId) {
    this.SessionEventService.createSessionEvent(sessionId)
  }

  openStartDatePicker () {
    this.filterStartDate['open'] = true
  }

  openEndDatePicker () {
    this.filterEndDate['open'] = true
  }

  isValidStartDate (startDate) {
    let isValid = false

    if (startDate) {
      const startTime = new Date(startDate).getTime()
      const filterStartTime = (this.filterStartDate['date'] === null || this.filterStartDate['date'] === undefined) ?
        null :
        this.filterStartDate['date'].getTime()
      const filterEndTime = (this.filterEndDate['date'] === null || this.filterEndDate['date'] === undefined) ?
        null :
        this.filterEndDate['date'].getTime()

      isValid = (filterStartTime === null || startTime >= filterStartTime) && (filterEndTime === null || startTime <= filterEndTime)
    }

    return isValid
  }
}