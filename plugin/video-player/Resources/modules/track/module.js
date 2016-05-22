import 'angular/angular.min'

import 'angular-bootstrap'
import 'angular-ui-translation/angular-translation'

import '#/main/core/Resources/modules/form/module'
import '#/main/core/Resources/modules/services/module'

import Interceptors from '#/main/core/Resources/modules/interceptorsDefault'
import TracksButtonDirective from './Directive/TracksButtonDirective'
import TracksModalController from './Controller/TracksModalController'

angular.module('TrackButton', [
  'ui.bootstrap',
  'ui.translation',
  'FormBuilder',
  'ClarolineAPI'
])
  .directive('videoTracks', () => new TracksButtonDirective)
  .controller('TracksModalController', TracksModalController)
  .config(Interceptors)
