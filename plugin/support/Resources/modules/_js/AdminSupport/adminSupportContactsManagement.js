import $ from 'jquery'
import UserPicker from '#/main/core/_old/user/userPicker'

/* global Translator */
/* global Routing */

var contactsIds = window.contacts

$('#contacts-management-body').on('click', '#add-support-contact-btn', function () {
  var userPicker = new UserPicker()
  var params = {
    picker_name: 'support_contacts_picker',
    picker_title: Translator.trans('select_support_contacts', {}, 'support'),
    multiple: true,
    blacklist: contactsIds,
    show_mail: true
  }
  userPicker.configure(params, addContacts)
  userPicker.open()
})

$('#contacts-management-body').on('click', '.remove-support-contact-btn', function () {
  var userId = $(this).data('user-id')
  removeContact(userId)
})

function addContacts (userIds) {
  if (userIds !== null) {
    var contactsIdsTxt = ''

    for (var i = 0; i < userIds.length; i++) {
      contactsIdsTxt += userIds[i] + ','
    }
    contactsIdsTxt = contactsIdsTxt.substring(0, contactsIdsTxt.length - 1)

    $.ajax({
      url: Routing.generate(
        'formalibre_admin_support_contacts_add',
        {'contactIds': contactsIdsTxt}
      ),
      type: 'POST',
      success: function () {
        window.location.reload()
      }
    })
  }
}

function removeContact (userId) {
  $.ajax({
    url: Routing.generate(
      'formalibre_admin_support_contact_remove',
      {'contactId': userId}
    ),
    type: 'DELETE',
    success: function () {
      window.location.reload()
    }
  })
}
