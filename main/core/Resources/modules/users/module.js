import 'angular/angular.min'

import dataTable from 'angular-data-table/release/dataTable.helpers.min'
import bootstrap from 'angular-bootstrap'
import translation from 'angular-ui-translation/angular-translation'
import UIRouter from 'angular-ui-router'
import breadcrumbs from 'angular-breadcrumb'

import UserController from './Controller/UserController'
import UserInfoModalController from './Controller/UserInfoModalController'
import RemoveByCsvModalController from './Controller/RemoveByCsvModalController'
import UserAPIService from './Service/UserAPIService'
import GroupManager from '../groups/module'
import clarolineSearch from '../search/module'
import clarolineAPI from '../services/module'
import Routing from './routing.js'
import bazinga from '../fos-js-router/module'
import '../form/module'

angular.module('UsersManager', [
    'ClarolineSearch',
    'ui.fos-js-router',
    'data-table',
    'ui.bootstrap.tpls',
    'ClarolineAPI',
    'ui.translation',
    'ui.router',
    'GroupsManager',
    'FormBuilder',
    'ncy-angular-breadcrumb'
]) .controller('UserController', ['$http', 'ClarolineSearchService', 'ClarolineAPIService', '$uibModal', UserController])
   .controller('RemoveByCsvModalController', RemoveByCsvModalController)
   .controller('UserInfoModalController', UserInfoModalController)
   .service('UserAPIService', UserAPIService)
   .config(Routing)
