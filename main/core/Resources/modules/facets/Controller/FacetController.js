import NotBlank from '../../form/Validator/NotBlank'

export default class FacetController {
  constructor ($http, $uibModal, FormBuilderService, ClarolineAPIService, dragulaService, $scope) {
    this.$http = $http
    this.$uibModal = $uibModal
    this.FormBuilderService = FormBuilderService
    this.ClarolineAPIService = ClarolineAPIService
    this.dragulaService = dragulaService
    this.facets = []
    this.platformRoles = []
    this.profilePreferences = []
    this.$scope = $scope
    $http.get(Routing.generate('api_get_facets')).then(d => this.facets = d.data)
    $http.get(Routing.generate('api_get_platform_roles')).then(d => this.platformRoles = d.data)
    // build the profile preferences array. This could be done on the server side.
    $http.get(Routing.generate('api_get_profile_preferences')).then(d => {
      const missingRoles = this.platformRoles.filter(element => {
        let found = false
        d.data.forEach(profilePreference => {
          if (element.id === profilePreference.role.id) found = true
        })
        return !found
      }).forEach(element => {
        d.data.push(
          {
            base_data: false,
            mail: false,
            phone: false,
            send_message: false,
            role: element
          }
        )
      })
      this.profilePreferences = d.data
    })

    // form definitions
    this.formFacet = {
      fields: [
        ['name', 'text', {validators: [new NotBlank()], label: Translator.trans('name', {}, 'platform')}],
        ['force_creation_form', 'checkbox', {label: Translator.trans('display_at_registration', {}, 'platform' )}],
        ['is_main', 'checkbox', {label: Translator.trans('is_main_facet_label', {}, 'platform')}]
      ]
    }

    this.formPanel = {
      fields: [
        ['name', 'text', {validators: [new NotBlank()],  label: Translator.trans('name', {}, 'platform')}],
        ['is_default_collapsed', 'checkbox', {label: Translator.trans('collapse', {}, 'platform')}]
      ]
    }

    this.formField = {
      fields: [
        ['name', 'text', {validators: [new NotBlank()], label: Translator.trans('name', {}, 'platform')}],
        [
          'type',
          'select',
          {
            values: [
              // these values currently come from the Entity/Facet/FieldFacet class
              { value: 1, label: 'text'},
              { value: 2, label: 'number'},
              { value: 3, label: 'date'},
              { value: 4, label: 'radio'},
              { value: 5, label: 'select'},
              { value: 6, label: 'checkboxes'},
              { value: 7, label: 'country'}
            ],
            default: 1,
            label: ''
          }
        ]
      ]
    }

    this.formPanelRole = {
      translation_domain: 'platform',
      fields: [
        ['can_open', 'checkbox', {label: ''}],
        ['can_edit', 'checkbox', {label: ''}]
      ]
    }

    this.formProfilePreference = {
      translation_domain: 'platform',
      fields: [
        [ 'base_data', 'checkbox', {label: ''}],
        [ 'mail', 'checkbox', {label: ''}],
        [ 'phone', 'checkbox', {label: ''}],
        [ 'send_message', 'checkbox', {label: ''}]
      ]
    }

    dragulaService.options($scope, 'facet-bag', {
      moves: function (el, container, handle) {
        return handle.className === 'handle'
      }
    })

    $scope.$on('facet-bag.drop', (e, el) => {

    })

    $scope.$on('panel-bag.drop', (el, target, source, siblings) => {
      // this is dirty but I can't retrieve the facet list otherwise
      const facetId = parseInt(source.attr('data-facet-id'))
      let container = null

      this.facets.forEach(facet => {
        console.log(facet, facetId)
        if (facet.id === facetId) container = facet
      })

      if (container) {
        const list = []
        container.panels.forEach(panel => {
          list.unshift(panel.id)
        })

        const qs = this.FormBuilderService.generateQueryString(list, 'ids')
        this.$http.put(Routing.generate('api_put_panels_order', {facet: facetId}) + '?' + qs).then(
          d => {
          },
          d => {
            ClarolineAPIService.errorModal()
          }
        )
      }
    })

    dragulaService.options($scope, 'panel-bag', {
      // allow nested drag... https://github.com/bevacqua/dragula/issues/31
      moves: function (el, container, target) {
        return !target.classList.contains('list-group-item')
      }
    })

    $scope.$on('field-bag.drop', (el, target, source, siblings) => {
      let container = null
      const panelId = parseInt(target.attr('data-panel-id'))

      this.facets.forEach(facet => {
        facet.panels.forEach(panel => {
          if (panel.id === panelId) container = panel
        })
      })

      if (container) {
        // this is dirty but I can't retrieve the facet list otherwise
        const panelId = parseInt(target.attr('data-panel-id'))
        const list = []

        container.fields.forEach(field => {
          list.unshift(field.id)
        })

        const qs = this.FormBuilderService.generateQueryString(list, 'ids')
        this.$http.put(Routing.generate('api_put_fields_order', {panel: panelId}) + '?' + qs).then(
          d => {
          },
          d => ClarolineAPIService.errorModal()

        )
      }
    })
  }

  onAddFacetFormRequest () {
    const modalInstance = this.$uibModal.open({
      template: require('../Partial/facet_form.html'),
      controller: 'ModalController',
      controllerAs: 'mc',
      resolve: {
        form: () => {
          return this.formFacet},
        title: () => {
          return 'create_facet'},
        submit: () => {
          return 'create'},
        model: () => {
          return {}
        }
      }
    })

    modalInstance.result.then(result => {
      if (!result) return
      this.FormBuilderService.submit(Routing.generate('api_post_facet'), {'facet': result}).then(
        d => this.facets.push(d.data),
        d => ClarolineAPIService.errorModal()
      )
    })
  }

  onEditFacetFormRequest (facet) {
    // for error handling

    const modalInstance = this.$uibModal.open({
      template: require('../Partial/facet_form.html'),
      controller: 'ModalController',
      controllerAs: 'mc',
      resolve: {
        form: () => {
          return this.formFacet},
        title: () => {
          return 'edit_facet'},
        submit: () => {
          return 'edit'},
        model: () => {
          return facet
        }
      }
    })

    modalInstance.result.then(result => {
      if (!result) return
      var data = this.FormBuilderService.submit(
          Routing.generate('api_put_facet', {facet: result.id}),
          {'facet': result},
          'PUT'
      ).then(
        d => {},
        d => ClarolineAPIService.errorModal()
      )
    })
  }

  onDeleteFacet (facet) {
    const url = Routing.generate('api_delete_facet', {facet: facet.id})

    this.ClarolineAPIService.confirm(
      {url, method: 'DELETE'},
      function () {
        this.ClarolineAPIService.removeElements([facet], this.facets)
      }.bind(this),
      Translator.trans('delete_facet', {}, 'platform'),
      Translator.trans('delete_facet_confirm', 'platform')
    )
  }

  onMoveFacetLeft (facet) {}

  onMoveFacetRight (facet) {}

  onSetFacetRoles (facet) {
    const modalInstance = this.$uibModal.open({
      template: require('../Partial/facet_roles_form.html'),
      controller: 'FacetRolesController',
      controllerAs: 'frc',
      resolve: {
        facet: () => {
          return facet},
        platformRoles: () => {
          return this.platformRoles}
      }
    })

    modalInstance.result.then(facet => {
      const roles = facet.roles
      const qs = this.FormBuilderService.generateQueryString(roles, 'ids')
      const route = Routing.generate('api_put_facet_roles', {'facet': facet.id}) + '?' + qs

      this.$http.put(route).then(
        d => {},
        d => ClarolineAPIService.errorModal()
      )
    })
  }

  onAddPanelFormRequest (facet) {
    const modalInstance = this.$uibModal.open({
      template: require('../Partial/panel_form.html'),
      controller: 'ModalController',
      controllerAs: 'mc',
      resolve: {
        form: () => {
          return this.formPanel},
        title: () => {
          return 'create_panel'},
        submit: () => {
          return 'create'},
        model: () => {
          return {}
        }
      }
    })

    modalInstance.result.then(result => {
      if (!result) return
      this.FormBuilderService.submit(Routing.generate('api_post_panel_facet', {facet: facet.id}), {'panel': result}).then(
        d => {
          if (!facet.panels) facet.panels = []
          facet.panels.push(d.data)
        },
        d => ClarolineAPIService.errorModal()
      )
    })
  }

  onEditPanelFormRequest (panel) {
    // for error handling
    const backup = angular.copy(panel)
    this.formPanel.model = panel

    const modalInstance = this.$uibModal.open({
      template: require('../Partial/panel_form.html'),
      controller: 'ModalController',
      controllerAs: 'mc',
      resolve: {
        form: () => {
          return this.formPanel},
        title: () => {
          return 'edit_panel'},
        submit: () => {
          return 'edit'},
        model: () => {
          return panel
        }
      }
    })

    modalInstance.result.then(result => {
      if (!result) return
      this.FormBuilderService.submit(Routing.generate('api_put_panel_facet', {panel: panel.id}), {'panel': result}, 'PUT').then(
        d => {},
        d => ClarolineAPIService.errorModal()
      )
    })
  }

  onDeletePanel (panel) {
    const url = Routing.generate('api_delete_panel_facet', {panel: panel.id})

    this.ClarolineAPIService.confirm(
      {url, method: 'DELETE'},
      function () {
        this.facets.forEach(facet => {
            facet.panels.forEach(el => {
                let idx = facet.panels.indexOf(panel)
                if (idx > -1) facet.panels.splice(idx, 1);
            })
        })
      // this.ClarolineAPIService.removeElements(facet, this.facets)
      }.bind(this),
      Translator.trans('delete_panel', {}, 'platform'),
      Translator.trans('delete_panel_confirm', 'platform')
    )
  }

  onAddFieldFormRequest (panel) {
    const modalInstance = this.$uibModal.open({
      template: require('../Partial/field_form.html'),
      controller: 'FieldModalController',
      controllerAs: 'fmc',
      resolve: {
        form: () => {
          return this.formField},
        title: () => {
          return 'create_field'},
        submit: () => {
          return 'create'},
        model: () => {
          return {}
        }
      }
    })

    modalInstance.result.then(result => {
      if (!result) return
      this.FormBuilderService.submit(Routing.generate('api_post_field_facet', {panel: panel.id}), {'field': result}).then(
        d => {
          if (!panel.fields) panel.fields = []
          panel.fields.push(d.data)
        },
        d => ClarolineAPIService.errorModal()
      )
    })
  }

  onEditFieldFormRequest (field) {
    // for error handling
    const backup = angular.copy(field)
    this.formField.model = field

    const modalInstance = this.$uibModal.open({
      template: require('../Partial/field_form.html'),
      controller: 'FieldModalController',
      controllerAs: 'fmc',
      resolve: {
        form: () => {
          return this.formField},
        title: () => {
          return 'edit_field'},
        submit: () => {
          return 'edit'},
        model: () => {
          return field
        }
      }
    })

    modalInstance.result.then(result => {
      if (!result) return
      this.FormBuilderService.submit(Routing.generate('api_put_field_facet', {field: field.id}), {'field': result}, 'PUT').then(
        d => {},
        d => ClarolineAPIService.errorModal()
      )
    })
  }

  onDeleteField (field) {
    const url = Routing.generate('api_delete_field_facet', {field: field.id})

    this.ClarolineAPIService.confirm(
      {url, method: 'DELETE'},
      function () {
          this.facets.forEach(facet => {
              facet.panels.forEach(panel => {
                  panel.fields.forEach(el => {
                      let idx = panel.fields.indexOf(field)
                      if (idx > -1) panel.fields.splice(idx, 1);
                  })
              })
          })
      }.bind(this),
      Translator.trans('delete_field', {}, 'platform'),
      Translator.trans('delete_field_confirm', 'platform')
    )
  }

  onSetPanelRoles (panel) {
    const modalInstance = this.$uibModal.open({
      template: require('../Partial/panel_roles_form.html'),
      controller: 'PanelRolesController',
      controllerAs: 'firc',
      resolve: {
        panel: () => {
          return panel},
        platformRoles: () => {
          return this.platformRoles},
        form: () => {
          return this.formPanelRole}
      }
    })

    modalInstance.result.then(panel => {
      this.FormBuilderService.submit(Routing.generate('api_put_panel_roles', {panel: panel.id}), {'roles': panel.panel_facets_role}, 'PUT').then(
        d => {},
        d => ClarolineAPIService.errorModal()
      )
    })
  }

  onSubmitProfilePreferences (form) {
    this.FormBuilderService.submit(Routing.generate('api_put_profile_preferences'), {'preferences': this.profilePreferences}, 'PUT').then(
      d => {},
      d => ClarolineAPIService.errorModal()
    )
  }
}
