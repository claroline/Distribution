
 class CreateDashboardsCtrl {
  /**
   * Constructor.
   *
   * @param {object}  workspaces
   */
   constructor(workspaces, user) {
     this.workspaces = workspaces
     this.user = user
     console.log(this.user)
   }
}


 export default CreateDashboardsCtrl
