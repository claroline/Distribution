import indexTemplate from './Partial/index.html'
import rootCursusManagementTemplate from './Partial/root_cursus_management.html'
import cursusManagementTemplate from './Partial/cursus_management.html'
import coursesManagementTemplate from './Partial/courses_management.html'
import sessionsManagementTemplate from './Partial/sessions_management.html'
import courseTemplate from './Partial/course_management.html'
import sessionTemplate from './Partial/session_management.html'

export default function($stateProvider, $urlRouterProvider) {
  const translate = function(key) {
    return window.Translator.trans(key, {}, 'cursus')
  }

  $stateProvider
    .state ('index', {
      url: '/index',
      template: indexTemplate,
      ncyBreadcrumb: {
        label: translate('courses_management')
      }
    })
    .state ('root_cursus_management', {
      url: '/cursus',
      template: rootCursusManagementTemplate,
      controller: 'RootCursusManagementCtrl',
      controllerAs: 'cmc',
      ncyBreadcrumb: {
        label: translate('cursus_management'),
        parent: 'index'
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
        label: translate('courses_management'),
        parent: 'index'
      }
    })
    .state ('sessions_management', {
      url: '/sessions',
      template: sessionsManagementTemplate,
      controller: 'SessionsManagementCtrl',
      controllerAs: 'cmc',
      ncyBreadcrumb: {
        label: translate('sessions_management'),
        parent: 'index'
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

  $urlRouterProvider.otherwise('/index')
}
