import $ from 'jquery'

$(document).ready(function () {
  var $notificationElement = $('#' + window.notificationElementId)
  var href = $notificationElement.children('a').attr('href')
  var notificationsLoaded = false
  $notificationElement.children('a').removeAttr('href')
  $notificationElement.addClass('dropdown')
  $notificationElement.children('a').addClass('pointer-hand dropdown-toggle')
  $notificationElement.children('a').attr('data-toggle', 'dropdown')
  $notificationElement.children('a').after('<div class="notifications-dropdown-list dropdown-menu"><div class="notification-pointer"></div><div class="notification-content"><div style="text-align: center"><img src="' + window.loadingIcon + '"></div></div></div>')
  $notificationElement.children('a').on('click', function () {
    if (notificationsLoaded == false) {
      $.get(href).always(function () { }).done(function (data) {
        $notificationElement.children('div.notifications-dropdown-list').children('div.notification-content').html(data)
        notificationsLoaded = true
        var unviewedNotifications = $notificationElement.find('ul#notification-list').attr('data-count')
        unviewedNotifications = parseInt(unviewedNotifications)
        $notificationElement.children('a').children('span.badge').remove()
        if (unviewedNotifications > 0) {
          $notificationElement.children('a').append('<span class="badge">' + unviewedNotifications + '</span>')
        }
      })

    } else {
      $notificationElement.children('div.notifications-dropdown-list').find('.not-viewed-notification').removeClass('not-viewed-notification')
      $notificationElement.children('a').unbind('click')
    }
  })
})
