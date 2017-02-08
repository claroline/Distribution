import $ from 'jquery'
import modal from '#/main/core/_old/modal'

/* global Routing */

var colors = []
$.ajax({
  url: Routing.generate('formalibre_presence_listingstatus'),
  type: 'GET',
  async: false,
  success: function (data) {
    colors = data
  }
})

$('.OneForm').each(function () {
  var image = $('td', this)

  $(this).find('input').each(function () {
    if ($(this).prop('checked')) {
      var valeurCheck = $(this).val()

      image.css('background-color', colors[valeurCheck]['color'])
    }
  })
})

$('input').on('click', function () {
  var OneForm = $(this).closest('.OneForm')
  var image = OneForm.find('td')
  var valeurCheck = $(this).val()
  image.css('background-color', colors[valeurCheck]['color'])
  var oTable = $('#studentList').dataTable()
  oTable.fnFilter('')
})

var status
$('#form_singleStatus').on('change', function () {
  status = $(this).val()
})

var element = document.getElementById('form_valider')

element.onclick = function () {
  $('input').each(function () {
    var actualStatus = $(this).val()
    if (actualStatus === status) {
      $(this).prop('checked', true)
      var OneForm = $(this).closest('.OneForm')
      var image = OneForm.find('td')
      image.css('background-color', colors[status]['color'])
    } else {
      $(this).prop('checked', false)
    }
  })
}

var statusByDefault = []
$.ajax({
  url: Routing.generate('formalibre_presence_listingstatusbydefaultnoadmin'),
  type: 'GET',
  async: false,
  success: function (data) {
    statusByDefault = data
  }
})

$('input').each(function () {
  var label = $(this).parent('label')
  var actualStatus = $(this).val()
  if (actualStatus in statusByDefault) {
    var OneForm = $(this).closest('.OneForm')
    var oneOtherStatus = OneForm.find('ul')
    oneOtherStatus.append(label)
  }
})

$(document).ready(function () {
  $('#studentList').DataTable({
    dom: 'Bftlp',
    buttons: true,
    'pageLength': 25,
    'language': {
      'lengthMenu': 'Nombre d\'étudiants par page _MENU_',
      'zeroRecords': 'Rien trouvé - Désolé',
      'info': 'Affichage de la page _PAGE_ sur _PAGES_',
      'infoEmpty': 'Pas de présence valide',
      'infoFiltered': '(filtered from _MAX_ total records)',
      'search': 'Trouver un élève '
    }
  })
})

var savebt = document.getElementById('CollReleve_Valider')

var btvalue = true

window.onchange = function () {
  btvalue = false
}

savebt.onclick = function () {
  btvalue = true
}
window.onbeforeunload = function () {
  if (btvalue == false) {
    return 'En quittant cette page, vous risquez de perdre des données non enregistrées.'
  }
}

$('.modifier-classe-btn').on('click', function () {
  var periodId = $(this).data('period-id')
  var periodDate = $(this).data('period-date')

  modal.displayForm(
    Routing.generate('formalibre_choix_classe', {'period': periodId,'date': periodDate}),
    function () {
      window.location.reload()
    },
    function () {}
  )
})
