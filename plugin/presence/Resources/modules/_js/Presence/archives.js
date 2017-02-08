import $ from 'jquery'
import 'datatables'
import modal from '#/main/core/_old/modal'

/* global Routing */

$(document).ready(function () {
  $('#archivesList').DataTable({
    dom: 'Bftp',
    buttons: true,
    'pageLength': 50,
    'language': {
      'lengthMenu': 'Nombre d\'étudiants par page _MENU_',
      'zeroRecords': 'Rien trouvé - Désolé',
      'info': 'Affichage de la page _PAGE_ sur _PAGES_',
      'infoEmpty': 'Pas de présence valide',
      'infoFiltered': '(filtered from _MAX_ total records)',
      'search': 'Trier les présences'
    }
  })
})

$('.modifier-presence-btn').on('click', function () {
  var presenceId = $(this).data('presence-id')
  modal.displayForm(
    Routing.generate('formalibre_presence_modif', {'id': presenceId}),
    function () {
      window.location.reload()
    },
    function () {}
  )
})

$('.supprimer-presence-btn').on('click', function () {
  var presenceId = $(this).data('presence-id')
  modal.displayForm(
    Routing.generate('formalibre_presence_supp', {'id': presenceId}),
    function () {
      window.location.reload()
    },
    function () {}
  )
})
