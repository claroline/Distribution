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
        ['name', 'text', {validators: [new NotBlank()]}],
        ['force_creation_form', 'checkbox', {label: 'display_at_registration' }],
        ['is_main', 'checkbox', {label: 'is_main' }]
      ]
    }

    this.formPanel = {
      fields: [
        ['name', 'text', {validators: [new NotBlank()]}],
        ['is_default_collapsed', 'checkbox', {label: 'collapse'}]
      ]
    }

    this.formField = {
      fields: [
        ['name', 'text', {validators: [new NotBlank()]}],
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
            default: 1
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
      console.log(e, el)
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
            alert('error handling')
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
          d => {
            alert(Translator.trans('an_error_happened', {}, 'platform'))
          }
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
      const data = this.FormBuilderService.formSerialize('facet', result)

      this.$http.post(
        Routing.generate('api_post_facet'),
        data,
        {headers: {'Content-Type': 'application/x-www-form-urlencoded'}}
      ).then(
        d => {
          this.facets.push(d.data)
        },
        d => alert(Translator.trans('an_error_happened', {}, 'platform'))
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
      var data = this.FormBuilderService.formSerialize('facet', result)

      this.$http.put(
        Routing.generate('api_put_facet', {facet: result.id}),
        data,
        {headers: {'Content-Type': 'application/x-www-form-urlencoded'}}
      ).then(
        d => {
        },
        d => alert(Translator.trans('an_error_happened', {}, 'platform'))
      )
    })
  }

  onDeleteFacet (facet) {
    const url = Routing.generate('api_delete_facet', {facet: facet.id})

    this.ClarolineAPIService.confirm(
      {url, method: 'DELETE'},
      function () {
        alert('meh')
        this.ClarolineAPIService.removeElements(facet, this.facets)
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
        d => {
        },
        d => alert(Translator.trans('an_error_happened', {}, 'platform'))
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
      const data = this.FormBuilderService.formSerialize('panel', result)

      this.$http.post(
        Routing.generate('api_post_panel_facet', {facet: facet.id}),
        data,
        {headers: {'Content-Type': 'application/x-www-form-urlencoded'}}
      ).then(
        d => {
          if (!facet.panels) facet.panels = []
          facet.panels.push(d.data)
        },
        d => alert(Translator.trans('an_error_happened', {}, 'platform'))
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
      const data = this.FormBuilderService.formSerialize('panel', result)

      this.$http.put(
        Routing.generate('api_put_panel_facet', {panel: panel.id}),
        data,
        {headers: {'Content-Type': 'application/x-www-form-urlencoded'}}
      ).then(
        d => {
        },
        d => alert(Translator.trans('an_error_happened', {}, 'platform'))
      )
    })
  }

  onDeletePanel (panel) {
    const url = Routing.generate('api_delete_panel_facet', {panel: panel.id})

    this.ClarolineAPIService.confirm(
      {url, method: 'DELETE'},
      function () {
        alert('meh')
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
      const data = this.FormBuilderService.formSerialize('field', result)

      this.$http.post(
        Routing.generate('api_post_field_facet', {panel: panel.id}),
        data,
        {headers: {'Content-Type': 'application/x-www-form-urlencoded'}}
      ).then(
        d => {
          if (!panel.fields) panel.fields = []
          panel.fields.push(d.data)
        },
        d => alert(Translator.trans('an_error_happened', {}, 'platform'))
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
      const data = this.FormBuilderService.formSerialize('field', result)

      this.$http.put(
        Routing.generate('api_put_field_facet', {field: field.id}),
        data,
        {headers: {'Content-Type': 'application/x-www-form-urlencoded'}}
      ).then(
        d => {
        },
        d => alert('an error occured')
      )
    })
  }

  onDeleteField (field) {
    const url = Routing.generate('api_delete_field_facet', {field: field.id})

    this.ClarolineAPIService.confirm(
      {url, method: 'DELETE'},
      function () {
        field = {}
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
      const data = this.FormBuilderService.formSerialize('roles', panel.panel_facets_role)

      this.$http.put(
        Routing.generate('api_put_panel_roles', {panel: panel.id}),
        data,
        {headers: {'Content-Type': 'application/x-www-form-urlencoded'}}
      ).then(
        d => {
        },
        d => alert(Translator.trans('an_error_happened', {}, 'platform'))
      )
    })
  }

  onSubmitProfilePreferences (form) {
    const data = this.FormBuilderService.formSerialize('preferences', this.profilePreferences)

    this.$http.put(
      Routing.generate('api_put_profile_preferences'),
      data,
      {headers: {'Content-Type': 'application/x-www-form-urlencoded'}}
    ).then(
      d => {
      },
      d => alert(Translator.trans('an_error_happened', {}, 'platform'))
    )
  }
}
