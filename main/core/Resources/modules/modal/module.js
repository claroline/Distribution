import angular from 'angular'
import 'angular-bootstrap'

import ConfirmModalDirective from './Directive/ConfirmModalDirective'

angular
    .module('ui.modal', [
      'ui.bootstrap'
    ])
    .directive('confirmModal', [
      '$uibModal',
      () => new ConfirmModalDirective
    ])
