import angular from 'angular'

import 'angular-bootstrap'
import 'angular-ui-translation'

import '#/main/core/form/module'
import '#/main/core/services/module'

import Interceptors from '#/main/core/interceptorsDefault'
import TracksButtonDirective from './Directive/TracksButtonDirective'
import TracksModalController from './Controller/TracksModalController'
import TrackEditModalController from './Controller/TrackEditModalController'

angular.module('TrackButton', [
  'ui.bootstrap',
  'ui.translation',
  'FormBuilder',
  'ClarolineAPI'
])
  .directive('videoTracks', () => new TracksButtonDirective)
  .controller('TracksModalController', TracksModalController)
  .controller('TrackEditModalController', TrackEditModalController)
  .config(Interceptors)
