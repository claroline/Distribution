import 'angular/angular.min'
import 'angular-bootstrap'
import HelpModalService from './Services/HelpModalService'
import OptionsModalService from './Services/OptionsModalService'

angular
  .module('Modals', [
    'ui.bootstrap'
  ])
  .service('helpModalService', [
    '$uibModal',
    'regionsService',
    'configService',
    HelpModalService
  ])
  .service('optionsModalService', [
    '$uibModal',
    'regionsService',
    OptionsModalService
  ])
