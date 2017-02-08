import $ from 'jquery'
import {} from 'jscroll/jquery.jscroll.min'

export class Jscroll {
  constructor(action, deleteUrl, prepend) {
    this.action = action
    this.deleteUrl = deleteUrl || null
    this.prepend = prepend || false
    this.init()
  }

  init() {
    // On document ready
    $(document).ready(() => {
      //Initialize jscroll
      $('.jscroll-' + this.action + '-list').jscroll({
        loadingHtml: '<div class="text-center list-group-item-loading"><i class="fa fa-spinner fa-pulse"></i></div>',
        padding: 20,
        nextSelector: 'a.jscroll-' + this.action + '-list-next',
        contentSelector: 'div',
        autoTrigger: false,
        callback: this._removeParentClass.bind(this)
      })

      //Remove item
      if (this.deleteUrl !== null) {
        $('.jscroll-' + this.action + '-list').on(
          'click',
          '.close',
          this._deleteItem.bind(this)
        )
      }
    })
  }

  _deleteItem(e) {
    let itemId = $(e.currentTarget).attr('data-item-id')
    $.ajax({
      url: this.deleteUrl.replace('000', itemId),
      method: 'DELETE'
    }).done(() => {
      $('#socialmedia-' + this.action + '-item-' + itemId).remove()
    }).fail(() => {
      alert(window.Translator.trans('error_deleting', {}, 'icap_socialmedia'))
    })
  }

  _removeParentClass() {
    $('div.jscroll-'+this.action+'-list').find('.jscroll-added').each(function(index, value) {
      if (this.prepend) {
        $(value).parent().prepend($(value))
      }
      var contents = $(value).contents()
      $(value).replaceWith(contents)
    }.bind(this))
  }
}