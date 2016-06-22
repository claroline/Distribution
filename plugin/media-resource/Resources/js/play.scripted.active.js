'use strict';

var problems = [];
var audioPlayer;
var step = 1;
var currentTime = 0;

// ======================================================================================================== //
// ACTIONS BOUND WHEN DOM READY (PLAY / PAUSE, MOVE BACKWARD / FORWARD, ADD MARKER, CALL HELP, ANNOTATE)
// ======================================================================================================== //
var actions = {
    playFirstStep: function() {
        audioPlayer.play();
        $('#btn-flag').prop('disabled', false);
        $('#btn-play').prop('disabled', true);
        audioPlayer.addEventListener('ended', function(){
          //$('#btn-play').prop('disabled', false);
          showFullView();
        });
        document.activeElement.blur();
    },
    flag: function() {
        // add a problem (time)
        console.log('add a problem to collection');
        document.activeElement.blur();
        addProblem();
    }
};

// ======================================================================================================== //
// ACTIONS BOUND WHEN DOM READY END
// ======================================================================================================== //

// ======================================================================================================== //
// DOCUMENT READY
// ======================================================================================================== //
$(document).ready(function() {

    // bind data-action events
    $("button[data-action]").click(function() {
        var action = $(this).data('action');
        if (actions.hasOwnProperty(action)) {
            actions[action]($(this));
        }
    });
    $('#btn-flag').prop('disabled', true);
    audioPlayer = document.getElementById('active-scripted-audio-player');
    commonVars.audioData = Routing.generate('innova_get_mediaresource_resource_file', {
        workspaceId: commonVars.wId,
        id: commonVars.mrId
    });

    audioPlayer.src = commonVars.audioData;
    var label = Translator.trans('scripted_active_identified_problems_label', {'number':problems.length}, 'media_resource');
    $('.nb-problems-label').text(label);
});

$('body').on('keypress', function(e){
  if(e.which === 32){
    console.log('add problem');
    addProblem();
  }
});

function addProblem(){
  var time = audioPlayer.currentTime;
  problems.push(time);
  console.log(time);
  var label = Translator.trans('scripted_active_identified_problems_label', {'number':problems.length}, 'media_resource');
  $('.nb-problems-label').text(label);
}

function showFullView(){
  audioPlayer.currentTime = 0;
  if(problems.length > 0){
    var url = Routing.generate('mediaresource_get_regions_helps', {
        workspaceId: commonVars.wId,
        id: commonVars.mrId,
        data: problems
    });
    $.ajax( url )
    .done(function() {
      console.log( "success" );
    })
    .fail(function() {
      console.log( "error" );
    })
    .always(function() {
      console.log( "complete" );
    });
    // get infos that will allow the construction of help rows according to problem detected

    // add rows to the domUtils

    // hide step 1 container
    $('.step-1-container').hide();

    // show step 2 container
    $('.step-2-container').show();
  }


}

/*
loop true/false
backward true/false
rate true/false
texts array (might be empty)
links array (might be empty)
connex array start / end (might be empty)

*/
function appendHelpRows(data){
  $root = $('.regions-row-container');
  data.forEach(entry){
    console.log(entry);
    var row = '';
    row += '<div class="row">';
    row += '  <div class="col-md-12">';
    row += '    <div class="btn-group">';
    row += '      <button class="btn btn-default" onclick="playRegion(' + data.start + ', ' + data.end + ')"><i class="fa fa-play"></i>/<i class="fa fa-pause"></i></button>';
    row += '      <button class="btn btn-default"><i class="fa fa-question"></i></button>';
    row += '    </div>';// end btn-group
    row += '    <div class="row">';
    row += '      <div class="col-md-12">';
    row += '      </div>';
    row += '    </div>';// end help row
    row += '  </div>';
    row += '</div>'; // end row
    $root.append(row);
  }
}

function playRegion(from, to){

}

function testAjax(){
  var problems = ['4.196643', '5.9', '7.9', '14.888571', '20.806507', '24.349841'];
  var url = Routing.generate('mediaresource_get_regions_helps', {
      workspaceId: commonVars.wId,
      id: commonVars.mrId,
      data: problems
  });
  $.ajax( url )
  .done(function(result) {
    console.log(result);
    appendHelpRows(result);
    /*
    loop true/false
    backward true/false
    rate true/false
    texts array (might be empty)
    links array (might be empty)
    connex array start / end (might be empty)

    */
    console.log( "success" );
  })
  .fail(function() {
    console.log( "error" );
  })
  .always(function() {
    console.log( "complete" );
  });
}
