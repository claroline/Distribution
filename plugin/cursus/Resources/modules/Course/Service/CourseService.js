/*
 * This file is part of the Claroline Connect package.
 *
 * (c) Claroline Consortium <consortium@claroline.net>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

export default class CourseService {
  constructor ($http, $sce, $uibModal, ClarolineAPIService) {
    this.$http = $http
    this.$sce = $sce
    this.$uibModal = $uibModal
    this.ClarolineAPIService = ClarolineAPIService
    this.course = {}
    this.courses = []
    this.initialized = false
    this.currentCursusId = null,
    this.hasChanged = false
    this._addCourseCallback = this._addCourseCallback.bind(this)
    this._updateCourseCallback = this._updateCourseCallback.bind(this)
    this._removeCourseCallback = this._removeCourseCallback.bind(this)
  }

  _addCourseCallback(data) {
    const coursesJson = JSON.parse(data)

    if (Array.isArray(coursesJson)) {
      coursesJson.forEach(c => {
        this.courses.push(c)
      })
    } else {
      this.courses.push(coursesJson)
    }
  }

  _updateCourseCallback(data) {
    const courseJson = JSON.parse(data)
    const index = this.courses.findIndex(c => c['id'] === courseJson['id'])

    if (index > -1) {
      this.courses[index] = courseJson
    }
  }

  _removeCourseCallback(data) {
    const courseJson = JSON.parse(data)
    const index = this.courses.findIndex(c => c['id'] === courseJson['id'])

    if (index > -1) {
      this.courses.splice(index, 1)
    }
  }

  getCourse () {
    return this.course
  }

  getCourses () {
    return this.courses
  }

  isInitialized () {
    return this.initialized
  }

  loadCourses (cursusId = null) {
    if (this.initialized && !this.hasChanged && this.currentCursusId === cursusId) {
      console.log('Nothing to load')

      return null
    } else {
      this.initialized = false
      this.courses.splice(0, this.courses.length)
      const route = cursusId ? Routing.generate('api_get_all_unmapped_courses', {cursus: cursusId}) : Routing.generate('api_get_all_courses')

      return this.$http.get(route).then(d => {
        if (d['status'] === 200) {
          angular.merge(this.courses, d['data'])
          this.currentCursusId = cursusId
          this.hasChanged = false
          this.initialized = true

          return 'initialized'
        }
      })
    }
  }

  removeCourse (courseId) {
    const index = this.courses.findIndex(c => c['id'] === courseId)

    if (index > -1) {
      this.courses.splice(index, 1)
      this.hasChanged = true
    }
  }

  createCourse (callback = null) {
    const addCallback = callback !== null ? callback : this._addCourseCallback
    const modal = this.$uibModal.open({
      templateUrl: Routing.generate('api_get_course_creation_form'),
      controller: 'CourseCreationModalCtrl',
      controllerAs: 'cmc',
      resolve: {
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

  editCourse (courseId, callback = null) {
    const updateCallback = callback !== null ? callback : this._updateCourseCallback
    const modal = this.$uibModal.open({
      templateUrl: Routing.generate('api_get_course_edition_form', {course: courseId}) + '?bust=' + Math.random().toString(36).slice(2),
      controller: 'CourseEditionModalCtrl',
      controllerAs: 'cmc',
      resolve: {
        courseId: () => { return courseId },
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

  deleteCourse (courseId, callback = null) {
    const url = Routing.generate('api_delete_course', {course: courseId})
    const deleteCallback = callback !== null ? callback : this._removeCourseCallback

    this.ClarolineAPIService.confirm(
      {url, method: 'DELETE'},
      deleteCallback,
      Translator.trans('delete_course', {}, 'cursus'),
      Translator.trans('delete_course_confirm_message', {}, 'cursus')
    )
  }

  viewCourse (courseId) {
    const index = this.courses.findIndex(c => c['id'] === courseId)

    if (index > -1) {
      const modal = this.$uibModal.open({
        template: require('../Partial/course_view_modal.html'),
        controller: 'CourseViewModalCtrl',
        controllerAs: 'cmc',
        resolve: {
          course: () => { return this.courses[index] }
        }
      })
    }
  }

  importCourses (callback = null) {
    const addCallback = callback !== null ? callback : this._addCourseCallback
    const modal = this.$uibModal.open({
      template: require('../Partial/courses_import_form.html'),
      controller: 'CoursesImportModalCtrl',
      controllerAs: 'cmc',
      resolve: {
        callback: () => { return addCallback }
      }
    })
  }

  getCourseById (courseId) {
    const index = this.courses.findIndex(c => c['id'] === courseId)

    if (index > -1) {
      this.course = this.courses[index]

      return 'initialized'
    } else {
      for (const key in this.course) {
        delete this.course[key]
      }
      const route = Routing.generate('api_get_course_by_id', {course: courseId})
      return this.$http.get(route).then(d => {
        if (d['status'] === 200) {
          const datas = JSON.parse(d['data'])

          for (const key in datas) {
            this.course[key] = datas[key]
          }

          return 'initialized'
        }
      })
    }
  }
}