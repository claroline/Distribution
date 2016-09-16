
 class StepOneCtrl {
  /**
   * Constructor.
   *
   * @param {object}  Translator
   */
   constructor(Translator, DashboardService) {
     this.Translator = Translator
     this.DashboardService = DashboardService
     this.selectedFilter = 'MY'

     this.filters = [
       {
         value: 'MY',
         name:  Translator.trans('workspaces_filter_my', {}, 'dashboard')
       },
       {
         value: 'FOLLOWING',
         name: Translator.trans('workspaces_filter_attended', {}, 'dashboard')
       }
     ]
     this.filtered = []
     this.filtered = this.workspaces.filter(el => el.creatorId === this.user.id)
   }

   filterList(){
     this.dashboard.workspace = {}
     if(this.selectedFilter === 'MY'){
       this.filtered = this.workspaces.filter(el => el.creatorId === this.user.id)
       // the user will be able to see the stats for all user belonging to this workspace
       this.dashboard.all = true
     } else {
       this.filtered = this.workspaces.filter(el => el.creatorId !== this.user.id)
       // // the user will be able to see it's own stats only
       this.dashboard.all = false
     }

   }
}

 export default StepOneCtrl
