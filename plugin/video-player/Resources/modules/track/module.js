import 'angular/angular.min'

import bootstrap from 'angular-bootstrap'
import translation from 'angular-ui-translation/angular-translation'

import Interceptors from '#/main/core/Resources/modules/interceptorsDefault'
import TracksButtonDirective from './Directive/TracksButtonDirective'

angular.module('TrackButton', [
  'ui.bootstrap',
  'ui.translation'
])
  .directive('videoTracksButton', () => new TracksButtonDirective())
  .config(Interceptors)
