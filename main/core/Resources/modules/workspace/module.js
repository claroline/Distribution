import angular from 'angular'
import WorkspaceService from './Services/WorkspaceService'


angular.module('workspace', [])
  .service('WorkspaceService', [
    '$http',
    '$q',
    'url',
    WorkspaceService
  ])
