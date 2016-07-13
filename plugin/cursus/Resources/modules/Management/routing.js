/*global Translator*/

import rootCursusManagementTemplate from './Partial/root_cursus_management.html'
import cursusManagementTemplate from './Partial/cursus_management.html'
import coursesManagementTemplate from './Partial/courses_management.html'
import sessionsManagementTemplate from './Partial/sessions_management.html'
import courseTemplate from './Partial/course_management.html'
import sessionTemplate from './Partial/session_management.html'
import configurationTemplate from './Partial/configuration.html'

export default function($stateProvider, $urlRouterProvider) {
  $stateProvider
    .state ('root_cursus_management', {
      url: '/cursus',
      template: rootCursusManagementTemplate,
      controller: 'RootCursusManagementCtrl',
      controllerAs: 'cmc',
      ncyBreadcrumb: {
        label: Translator.trans('cursus_management', {}, 'cursus')
      }
    })
    .state ('cursus', {
      url: '/cursus/{cursusId}',
      template: cursusManagementTemplate,
      controller: 'CursusManagementCtrl',
      controllerAs: 'cmc',
      ncyBreadcrumb: {
        label: '{{ cmc.breadCrumbLabel }}',
        parent: 'root_cursus_management'
      }
    })
    .state ('courses_management', {
      url: '/courses',
      template: coursesManagementTemplate,
      controller: 'CoursesManagementCtrl',
      controllerAs: 'cmc',
      ncyBreadcrumb: {
        label: Translator.trans('courses_management', {}, 'cursus')
      }
    })
    .state ('sessions_management', {
      url: '/sessions',
      template: sessionsManagementTemplate,
      controller: 'SessionsManagementCtrl',
      controllerAs: 'cmc',
      ncyBreadcrumb: {
        label: Translator.trans('sessions_management', {}, 'cursus')
      }
    })
    .state ('course', {
      url: '/courses/{courseId}',
      template: courseTemplate,
      controller: 'CourseManagementCtrl',
      controllerAs: 'cmc',
      ncyBreadcrumb: {
        label: '{{ cmc.breadCrumbLabel }}',
        parent: 'courses_management'
      }
    })
    .state ('session', {
      url: '/sessions/{sessionId}',
      template: sessionTemplate,
      controller: 'SessionManagementCtrl',
      controllerAs: 'cmc',
      ncyBreadcrumb: {
        label: '{{ cmc.breadCrumbLabel }}',
        parent: 'sessions_management'
      }
    })
    .state ('configuration', {
      url: '/configuration',
      template: configurationTemplate,
      ncyBreadcrumb: {
        label: Translator.trans('configuration', {}, 'platform')
      }
    })

  $urlRouterProvider.otherwise('/courses')
}
