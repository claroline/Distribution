/*
 * This file is part of the Claroline Connect package.
 *
 * (c) Claroline Consortium <consortium@claroline.net>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import angular from 'angular/index'

import 'angular-bootstrap'
import 'angular-ui-translation/angular-translation'

import SessionEventService from './Service/SessionEventService'
import SessionEventCreationModalCtrl from './Controller/SessionEventCreationModalCtrl'
import SessionEventEditionModalCtrl from './Controller/SessionEventEditionModalCtrl'

angular.module('SessionEventModule', [
  'ui.bootstrap',
  'ui.bootstrap.tpls',
  'ui.translation'
])
.service('SessionEventService', SessionEventService)
.controller('SessionEventCreationModalCtrl', SessionEventCreationModalCtrl)
.controller('SessionEventEditionModalCtrl', SessionEventEditionModalCtrl)