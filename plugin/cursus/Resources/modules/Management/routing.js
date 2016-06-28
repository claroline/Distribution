export default function($stateProvider, $urlRouterProvider) {
  const translate = function(key) {
    return window.Translator.trans(key, {}, 'cursus');
  }

  $stateProvider
    .state ('index', {
      url: '/index',
      template: require('./Partial/index.html'),
      ncyBreadcrumb: {
        label: translate('courses_management')
      }
    })
    .state ('root_cursus_management', {
      url: '/cursus',
      template: require('./Partial/root_cursus_management.html'),
      controller: 'RootCursusManagementCtrl',
      controllerAs: 'cmc',
      ncyBreadcrumb: {
        label: translate('cursus_management'),
        parent: 'index'
      }
    })
    .state ('cursus', {
      url: '/cursus/{cursusId}',
      template: require('./Partial/cursus_management.html'),
      controller: 'CursusManagementCtrl',
      controllerAs: 'cmc',
      ncyBreadcrumb: {
        label: '{{ cmc.breadCrumbLabel }}',
        parent: 'root_cursus_management'
      }
    })
    .state ('courses_management', {
      url: '/courses',
      template: require('./Partial/courses_management.html'),
      controller: 'CoursesManagementCtrl',
      controllerAs: 'cmc',
      ncyBreadcrumb: {
        label: translate('courses_management'),
        parent: 'index'
      }
    })
    .state ('sessions_management', {
      url: '/sessions',
      template: require('./Partial/sessions_management.html'),
      controller: 'SessionsManagementCtrl',
      controllerAs: 'cmc',
      ncyBreadcrumb: {
        label: translate('sessions_management'),
        parent: 'index'
      }
    })
    .state ('course', {
      url: '/courses/{courseId}',
      template: require('./Partial/course_management.html'),
      controller: 'CourseManagementCtrl',
      controllerAs: 'cmc',
      ncyBreadcrumb: {
        label: '{{ cmc.breadCrumbLabel }}',
        parent: 'courses_management'
      }
    })
    .state ('session', {
      url: '/sessions/{sessionId}',
      template: require('./Partial/session_management.html'),
      controller: 'SessionManagementCtrl',
      controllerAs: 'cmc',
      ncyBreadcrumb: {
        label: '{{ cmc.breadCrumbLabel }}',
        parent: 'sessions_management'
      }
    })
//        .state ('registration_cursus_list', {
//            url: '/registration/cursus/list',
//            template: require('./Cursus/Partial/cursus_registration_cursus_list.html'),
//            controller: 'CursusRegistrationCtrl',
//            controllerAs: 'crc'
//        })
//        .state ('registration_searched_cursus_list', {
//            url: '/registration/searched/cursus/{search}',
//            template: require('./Cursus/Partial/cursus_registration_searched_cursus_list.html'),
//            controller: 'CursusRegistrationSearchCtrl',
//            controllerAs: 'crsc'
//        })
//        .state ('registration_cursus_management', {
//            url: '/registration/cursus/{cursusId}/management',
//            template: require('./Cursus/Partial/cursus_registration_cursus_management.html'),
//            controller: 'CursusRegistrationManagementCtrl',
//            controllerAs: 'crmc'
//        })
//        .state ('registration_queue_management', {
//            url: '/registration/queue/management',
//            template: require('./Queue/Partial/cursus_queue_management.html'),
//            controller: 'CursusQueueManagementCtrl',
//            controllerAs: 'cqmc'
//        })

  $urlRouterProvider.otherwise('/index')
}
