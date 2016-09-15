
 class StepOneCtrl {
  /**
   * Constructor.
   *
   * @param {object}  Translator
   */
   constructor(Translator) {
     this.Translator = Translator
     this.selected = 'MY'

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

   /**
   * Add or remove worksapce id from dashboard selected workspace(s)
   */
   checkChange(id){
     this.dashboard.workspace = this.filtered.find(el => el.id === id)
   }

   filterList(){
     this.dashboard.workspace = {}
     if(this.selected === 'MY'){
       this.filtered = this.workspaces.filter(el => el.creatorId === this.user.id)
     } else {
       this.filtered = this.workspaces.filter(el => el.creatorId !== this.user.id)
     }

   }
}

 export default StepOneCtrl
