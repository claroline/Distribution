/*global Translator*/

import menuTemplate from './Partial/menu.html'
import generalConfigurationTemplate from './Partial/general_configuration.html'
import fieldsManagementTemplate from './Partial/fields_management.html'
import categoriesManagementTemplate from './Partial/categories_management.html'
import templateManagementTemplate from './Partial/template_management.html'

export default function($stateProvider, $urlRouterProvider) {
  $stateProvider
    .state ('menu', {
      url: '/menu',
      template: menuTemplate,
      controller: 'MenuCtrl',
      controllerAs: 'cfc'
    })
    .state ('general_configuration', {
      url: '/general_configuration',
      template: generalConfigurationTemplate,
      controller: 'GeneralConfigurationCtrl',
      controllerAs: 'cfc'
    })
    .state ('fields_management', {
      url: '/fields_management',
      template: fieldsManagementTemplate,
      controller: 'FieldsManagementCtrl',
      controllerAs: 'cfc'
    })
    .state ('categories_management', {
      url: '/categories_management',
      template: categoriesManagementTemplate,
      controller: 'CategoriesManagementCtrl',
      controllerAs: 'cfc'
    })
    .state ('template_management', {
      url: '/template_management',
      template: templateManagementTemplate,
      controller: 'TemplateManagementCtrl',
      controllerAs: 'cfc'
    })

  $urlRouterProvider.otherwise('/menu')
}
