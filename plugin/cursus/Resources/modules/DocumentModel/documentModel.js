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
import DocumentModelService from './Service/DocumentModelService'
import DocumentModelCreationModalCtrl from './Controller/DocumentModelCreationModalCtrl'
import DocumentModelEditionModalCtrl from './Controller/DocumentModelEditionModalCtrl'

angular.module('DocumentModelModule', [
  'ui.bootstrap',
  'ui.bootstrap.tpls',
  'ui.translation'
])
.service('DocumentModelService', DocumentModelService)
.controller('DocumentModelCreationModalCtrl', DocumentModelCreationModalCtrl)
.controller('DocumentModelEditionModalCtrl', DocumentModelEditionModalCtrl)