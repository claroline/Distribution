/*
 * This file is part of the Claroline Connect package.
 *
 * (c) Claroline Consortium <consortium@claroline.net>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

export default class CursusService {
  constructor ($http, $sce, $uibModal, ClarolineAPIService, CourseService) {
    this.$http = $http
    this.$sce = $sce
    this.$uibModal = $uibModal
    this.ClarolineAPIService = ClarolineAPIService
    this.CourseService = CourseService
    this.cursus = []
    this.hierarchy = {}
    this.rootCursusId = null
    this.initialized = false
    this._addCursusCallback = this._addCursusCallback.bind(this)
    this._updateCursusCallback = this._updateCursusCallback.bind(this)
    this._removeCursusCallback = this._removeCursusCallback.bind(this)
  }

  _addCursusCallback(data) {
    const cursusJson = JSON.parse(data)

    if (Array.isArray(cursusJson)) {
      cursusJson.forEach(c => {
        this.cursus.push(c)
        this.addCursusToHierarchy(c)
      })
    } else {
      this.cursus.push(cursusJson)
      this.addCursusToHierarchy(cursusJson)
    }
  }

  _updateCursusCallback(data) {
    const cursusJson = JSON.parse(data)
    const cursusIndex = this.cursus.findIndex(c => c['id'] === cursusJson['id'])

    if (cursusIndex > -1) {
      this.cursus[cursusIndex] = cursusJson
    }

    const parentId = cursusJson['parentId'] ? cursusJson['parentId'] : 'root'
    const hierarchyIndex = this.hierarchy[parentId].findIndex(c => c['id'] === cursusJson['id'])

    if (hierarchyIndex > -1) {
      this.hierarchy[parentId][hierarchyIndex] = cursusJson
    }
  }

  _removeCursusCallback(data) {
    const cursusJson = JSON.parse(data)
    const index = this.cursus.findIndex(c => c['id'] === cursusJson['id'])

    if (index > -1) {
      this.cursus.splice(index, 1)
    }

    const parentId = cursusJson['parentId'] ? cursusJson['parentId'] : 'root'
    const hierarchyIndex = this.hierarchy[parentId].findIndex(c => c['id'] === cursusJson['id'])

    if (hierarchyIndex > -1) {
      this.hierarchy[parentId].splice(hierarchyIndex, 1)
    }
  }

  getCursus () {
    return this.cursus
  }

  getHierarchy () {
    return this.hierarchy
  }

  initialize (cursusId = null) {
    if (this.initialized && cursusId === this.rootCursusId) {
      console.log('cursus already initialized')

      return null
    } else {
      console.log('initializing cursus...')
      this.cursus.splice(0, this.cursus.length)
      const route = cursusId === null ? Routing.generate('api_get_all_root_cursus') : Routing.generate('api_get_one_cursus', {cursus: cursusId});

      return this.$http.get(route).then(d => {
        if (d['status'] === 200) {
          angular.merge(this.cursus, d['data'])
          this.rootCursusId = cursusId
          this.initializeHierarchy()
          this.initialized = true

          return 'initialized'
        }
      })
    }
  }

  initializeHierarchy () {
    for (const key in this.hierarchy) {
      delete this.hierarchy[key]
    }
    this.generateHierarchy(this.cursus)
  }

  generateHierarchy(cursusList) {
    cursusList.forEach(c => {
      const index = c['parentId'] ? c['parentId'] : 'root'

      if (!this.hierarchy[index]) {
        this.hierarchy[index] = []
      }
      this.hierarchy[index].push(c)

      if (c['children']) {
        this.generateHierarchy(c['children'])
      }
    })
  }

  createCursus(cursusId = null) {
    const modal = this.$uibModal.open({
      templateUrl: Routing.generate('api_get_cursus_creation_form'),
      controller: 'CursusCreationModalCtrl',
      controllerAs: 'cmc',
      resolve: {
        cursusId: () => { return cursusId },
        callback: () => { return this._addCursusCallback }
      }
    })

    modal.result.then(result => {
      if (!result) {
        return
      } else {
        this._addCursusCallback(result)
      }
    })
  }

  editCursus(cursusId) {
    const modal = this.$uibModal.open({
      templateUrl: Routing.generate('api_get_cursus_edition_form', {cursus: cursusId}) + '?bust=' + Math.random().toString(36).slice(2),
      controller: 'CursusEditionModalCtrl',
      controllerAs: 'cmc',
      resolve: {
        cursusId: () => { return cursusId },
        callback: () => { return this._updateCursusCallback }
      }
    })

    modal.result.then(result => {
      if (!result) {
        return
      } else {
        this._updateCursusCallback(result)
      }
    })
  }

  deleteCursus(cursusId) {
    const url = Routing.generate('api_delete_cursus', {cursus: cursusId})

    this.ClarolineAPIService.confirm(
      {url, method: 'DELETE'},
      this._removeCursusCallback,
      Translator.trans('delete_cursus', {}, 'cursus'),
      Translator.trans('delete_cursus_confirm_message', {}, 'cursus')
    )
  }

  importCursus () {
    const modal = this.$uibModal.open({
      template: require('../Partial/cursus_import_form.html'),
      controller: 'CursusImportModalCtrl',
      controllerAs: 'cmc',
      resolve: {
        callback: () => { return this._addCursusCallback }
      }
    })
  }

  viewRootCursus (cursusId) {
    const index = this.cursus.findIndex(c => c['id'] === cursusId)

    if (index > -1) {
      this.$uibModal.open({
        template: require('../Partial/cursus_hierarchy_modal.html'),
        controller: 'CursusHierarchyModalCtrl',
        controllerAs: 'cmc',
        resolve: {
          title: () => { return this.cursus[index]['title'] },
          cursus: () => { return [this.cursus[index]] },
          hierarchy: () => { return this.hierarchy }
        }
      })
    }
  }

  addCursusToHierarchy (cursus) {
    const index = cursus['parentId'] ? cursus['parentId'] : 'root'

    if (!this.hierarchy[index]) {
      this.hierarchy[index] = []
    }
    this.hierarchy[index].push(cursus)
  }

  createCursusCourse(cursusId) {
    const modal = this.$uibModal.open({
      templateUrl: Routing.generate('api_get_course_creation_form'),
      controller: 'CursusCourseCreationModalCtrl',
      controllerAs: 'cmc',
      resolve: {
        cursusId: () => { return cursusId },
        callback: () => { return this._addCursusCallback }
      }
    })

    modal.result.then(result => {
      if (!result) {
        return
      } else {
        this._addCursusCallback(result)
      }
    })
  }

  showCoursesListForCursus (cursusId, title) {
    const modal = this.$uibModal.open({
      template: require('../Partial/cursus_course_selection_modal.html'),
      controller: 'CursusCourseSelectionModalCtrl',
      controllerAs: 'cmc',
      resolve: {
        cursusId: () => { return cursusId },
        title: () => { return title }
      }
    })
  }

  addCourseToCursus (cursusId, courseId) {
    const route = Routing.generate('api_post_cursus_course_add', {cursus: cursusId, course: courseId})
    this.$http.post(route).then(d => {
      if (d['status'] === 200) {
        this._addCursusCallback(d['data'])
        const cursusJson = JSON.parse(d['data'])
        cursusJson.forEach(c => {
          if (c['course']) {
            this.CourseService.removeCourse(c['course']['id'])
          }
        })
      }
    })
  }

  removeCourseFromCursus (cursusId) {
    const url = Routing.generate('api_delete_cursus', {cursus: cursusId})

    this.ClarolineAPIService.confirm(
      {url, method: 'DELETE'},
      this._removeCursusCallback,
      Translator.trans('remove_course', {}, 'cursus'),
      Translator.trans('remove_course_confirm_message', {}, 'cursus')
    )
  }
}