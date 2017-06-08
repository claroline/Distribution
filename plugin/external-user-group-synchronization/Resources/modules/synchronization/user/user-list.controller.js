/**
 * Created by panos on 5/30/17.
 */
import userSyncModalTemplate from './user-sync-modal.partial.html'
import { UserSyncModalController } from './user-sync-modal.controller'

export class UserListController {
  constructor(UserListService, $uibModal) {
    this._UserListService = UserListService
    this._$uibModal = $uibModal
    this.initialized = false
  }

  $onInit() {
    this.users = []
    this.platformRoles = []
    this.totalUsers = 0
    this.totalExternalUsers = 0
    this.syncInProgress = false
    this.fieldNames = [ 'username', 'firstName', 'lastName', 'mail', 'administrativeCode' ]
    this.getUsers()
    this.getTotalExternalUsers()
    this.getPlatformRoles()
  }

  openUserSyncModal() {
    let modalInstance = this._$uibModal.open({
      animation: true,
      template: userSyncModalTemplate,
      controller: UserSyncModalController,
      controllerAs: '$ctrl',
      bindToController: true,
      resolve: {
        roles: () => { return this.platformRoles }
      }
    })

    modalInstance.result.then( params => {
      this.synchronizeUsers(1, params.cas, params.role.name)
    })
  }



  getTotalExternalUsers() {
    this._UserListService.getTotalExternalUsers().then(data => {
      this.totalExternalUsers = data
    })
  }

  getPlatformRoles() {
    this._UserListService.getPlatformRoles().then(data => {
      this.platformRoles = data
    })
  }

  getUsers(search) {
    search = search || {}
    this._UserListService.getUsers(search).then(data => {
      this.totalUsers = data.totalItems
      this.users = data.items
    }, () => {
      this.onAlert({'$alert': {'type' : 'danger', 'msg' : 'user_list_load_error'}})
    }).finally(() => { this.initialized = true })
  }

  synchronizeUsers(batch, cas, role) {
    this.syncInProgress = true
    batch = batch || 1
    this._UserListService.synchronizeUsers(batch, cas, role).then(data => {
      this.onAlert({'$alert': {'type': 'warning', 'msg': 'user_sync_from_'+data.first+'_to_'+data.last}})
      if (!data.next) {
        this.onAlert({'$alert': {'type': 'success', 'msg': 'user_sync_success'}})
        this.syncInProgress = false
        this.getUsers()
      } else {
        this.synchronizeUsers(data.next)
      }
    }, () => {
      this.onAlert({'$alert': {'type' : 'danger', 'msg' : 'user_sync_error'}})
      this.syncInProgress = false
      this.getUsers()
    })
  }
}

UserListController.$inject = [ 'UserListService', '$uibModal' ]