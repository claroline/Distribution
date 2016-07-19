

export default class DomUtils {

    getHelpModalContent(current, previous, shared) {
        var html = '';
        //                  FIRST PANE
        html += '           <div role="tabpanel" class="tab-pane active" id="help-region-choice">';
        html += '               <div class="row">';
        html += '                   <div class="col-md-12 text-center">';
        html += Translator.trans('help_modal_intro', {}, 'media_resource');
        html += '                   </div>';
        html += '               </div>';
        html += '               <hr>';
        //                      CURRENT REGION
        html += '               <div class="form-inline">';
        html += '                   <div class="form-group">';
        html += '                       <div class="input-group">';
        html += '                         <label class="input-group-addon" style="width:250px;">' + Translator.trans('current_segment', {}, 'media_resource') + '</label>';
        html += '                         <div class="input-group-addon">';
        html += '                           <input type="radio" name="segment" value="current" checked>';
        html += '                         </div>';
        html += '                         <button class="btn btn-default play-help" style="margin:5px;" title="' + Translator.trans('region_help_segment_playback', {}, 'media_resource') + '"   data-start="' + current.start + '" data-end="' + current.end + '" data-mode="' + shared.playMode.PLAY_NORMAL + '" >';
        html += '                           <i class="fa fa-play"></i> ';
        html += '                             / ';
        html += '                           <i class="fa fa-pause"></i>';
        html += '                         </button>';
        html += '                       </div>';
        html += '                   </div>';
        html += '               </div>';
        //                      PREVIOUS REGION
        if (previous) {
            html += '           <hr>';
            html += '           <div class="form-inline">';
            html += '               <div class="form-group">';
            html += '                   <div class="input-group">';
            html += '                       <label class="input-group-addon" style="width:250px;">' + Translator.trans('previous_segment', {}, 'media_resource') + '</label>';
            html += '                       <div class="input-group-addon">';
            html += '                           <input type="radio" name="segment" value="previous">';
            html += '                       </div>';
            html += '                       <button disabled style="margin:5px;" class="btn btn-default play-help" title="' + Translator.trans('region_help_segment_playback', {}, 'media_resource') + '" data-start="' + previous.start + '" data-end="' + previous.end + '" data-mode="' + shared.playMode.PLAY_NORMAL + '">';
            html += '                           <i class="fa fa-play"></i> ';
            html += '                           / ';
            html += '                           <i class="fa fa-pause"></i>';
            html += '                       </button>';
            html += '                   </div>';
            html += '               </div>';
            html += '           </div>';
        }
        html += '            </div>'; // END OF FIRST PANE
        //                  SECOND PANE = Available help for selected region (current or previous)
        html += '           <div role="tabpanel" class="tab-pane" id="region-help-available">';
        html += '           </div>';
        return html;
    }

    /**
     * append available help in the help modal specific tab
     */
    appendHelpModal(modal, region, shared) {
        var root = $(modal).find('#region-help-available');
        $(root).empty();
        var html = '';
        if (region.hasHelp) {
            if (region.loop) {
                html += '<div class="row">';
                html += '   <div class="col-md-12">';
                html += '       <button class="btn btn-default play-help" title="' + Translator.trans('region_help_segment_playback_loop', {}, 'media_resource') + '" data-start="' + region.start + '" data-end="' + region.end + '" data-mode="' + shared.playMode.PLAY_LOOP + '" style="margin:5px;">';
                html += '           <i class="fa fa-retweet"></i> ';
                html += '       </button>';
                html += '       <label>' + Translator.trans('region_help_segment_playback_loop', {}, 'media_resource') + '</label>';
                html += '   </div>';
                html += '</div>';
            }
            if (region.backward) {
                html += '<hr/>';
                html += '<div class="row">';
                html += '   <div class="col-md-12">';
                html += '       <button class="btn btn-default play-backward" title="' + Translator.trans('region_help_segment_playback_backward', {}, 'media_resource') + '" data-note="' + region.note + '" style="margin:5px;">';
                html += '           <i class="fa fa-exchange"></i> ';
                html += '       </button>';
                html += '       <label>' + Translator.trans('region_help_segment_playback_backward', {}, 'media_resource') + '</label>';
                html += '   </div>';
                html += '</div>';
            }
            if (region.rate) {
                html += '<hr/>';
                html += '<div class="row">';
                html += '   <div class="col-md-12">';
                html += '       <button class="btn btn-default play-help" title="' + Translator.trans('region_help_segment_playback_rate', {}, 'media_resource') + '" data-start="' + region.start + '" data-end="' + region.end + '" data-mode="' + shared.playMode.PLAY_SLOW + '">x0.8</button>';
                html += '       <label>' + Translator.trans('region_help_segment_playback_rate', {}, 'media_resource') + '</label>';
                html += '   </div>';
                html += '</div>';
            }
            if (region.texts.length > 0) {
                html += '<hr/>';
                html += '<div class="row">';
                html += '   <div class="col-md-12">';
                html += '       <button id="btn-show-help-text" class="btn btn-default" title="' + Translator.trans('region_help_help_text_label', {}, 'media_resource') + '" style="margin:5px;">';
                html += Translator.trans('region_help_help_text_label', {}, 'media_resource');
                html += '       </button>';
                html += '       <label id="help-modal-help-text" style="display:none;"></label>';
                html += '   </div>';
                html += '</div>';
            }

            if (region.links.length > 0) {
                html += '<hr/>';
                html += '<h4>' + Translator.trans('region_help_help_links_label', {}, 'media_resource') + '</h4>';
                html += '<div class="row">';
                html += '   <div class="col-md-12">';
                html += '       <ul class="help-links-ul">';
                for (var i = 0; i < region.links.length; i++) {
                    var index = i + 1;
                    html += '       <li>';
                    html += '         <a target="_blank" href="' + region.links[i] + '">lien ' + index + '</a>';
                    html += '       </li>';
                }
                html += '       </ul>';
                html += '   </div>';
                html += '</div>';
            }
            if (region.helpUuid) {
                var helpRegionData = this.getHelpRelatedRegionData(region.helpUuid);
                html += '<hr/>';
                html += '<div class="row">';
                html += '   <div class="col-md-12">';
                html += '       <button class="btn btn-default play-help" title="' + Translator.trans('region_help_related_segment_playback', {}, 'media_resource') + '" data-start="' + helpRegionData.start + '" data-end="' + helpRegionData.end + '" data-mode="' + shared.playMode.PLAY_NORMAL + '" style="margin:5px;">';
                html += '           <i class="fa fa-play"></i> ';
                html += '           / ';
                html += '           <i class="fa fa-pause"></i>';
                html += '       </button>';
                html += '       <label>' + Translator.trans('region_help_related_segment_playback', {}, 'media_resource') + '</label>';
                html += '   </div>';
                html += '</div>';
            }

        } else {
            html += '<div class="row">';
            html += '   <div class="col-md-12">';
            html += '       <h4>' + Translator.trans('region_help_no_help_available', {}, 'media_resource') + '</h4>';
            html += '   </div>';
            html += '</div>';
        }
        $(html).appendTo(root);
        var currentLevel = 0;
        $("#btn-show-help-text").on('click', function() {
            $('#help-modal-help-text').hide();
            currentLevel = currentLevel === region.texts.length ? 0 : currentLevel;
            $('#help-modal-help-text').text(region.texts[currentLevel]);
            currentLevel++;
            $('#help-modal-help-text').show();
        });
    }

    /**
     * $regionRow the row that called the action
     */
    setRegionConfigModalContent($regionRow) {
        // get regions dom rows
        var rRows = [];
        $('.region').each(function() {
            var row = {};
            row = {
                uid: $(this).data('uuid'),
                hstart: $(this).find('.time-text.start').text(),
                hend: $(this).find('.time-text.end').text(),
                start: $(this).find('input.hidden-start').val(),
                end: $(this).find('input.hidden-end').val()
            };
            rRows.push(row);

        });

        // get current region row start text
        var currentRegionStart = $regionRow.find('.time-text.start').text();
        // find region config hidden inputs
        var helpRegionUuid = $regionRow.find('.hidden-config-help-region-uuid');
        //loop elem
        var loop = $regionRow.find('.hidden-config-loop');
        //backward
        var backward = $regionRow.find('.hidden-config-backward');
        //rate
        var rate = $regionRow.find('.hidden-config-rate');

        var texts = [];
        // retrieve existing texts
        $regionRow.find('.hidden-help-texts').each(function() {
            var val = $(this).val() ? $(this).val() : '';
            texts.push(val);
        });
        var links = [];
        // retrieve existing links
        $regionRow.find('.hidden-help-links').each(function() {
            var val = $(this).val() ? $(this).val() : '';
            links.push(val);
        });

        var html = '';
        html += '<div class="row">';
        html += '   <div class="col-md-12">';
        html += '       <div class="form-horizontal">';
        html += '           <div class="checkbox">';
        html += '               <label>';
        if (loop.val() === '1')
            html += '               <input type="checkbox" name="loop"  value="loop" checked>';
        else
            html += '               <input type="checkbox" name="loop" value="loop">';
        html += Translator.trans('region_config_allow_loop', {}, 'media_resource');
        html += '               </label>';
        html += '           </div>';
        html += '           <div class="checkbox">';
        html += '               <label>';
        if (backward.val() === '1')
            html += '               <input type="checkbox" name="backward" value="backward" checked>';
        else
            html += '               <input type="checkbox" name="backward" value="backward">';
        html += Translator.trans('region_config_allow_bwb', {}, 'media_resource');
        html += '               </label>';
        html += '           </div>';
        html += '           <div class="checkbox">';
        html += '               <label>';
        if (rate.val() === '1')
            html += '               <input type="checkbox" name="rate" value="rate" checked>';
        else
            html += '               <input type="checkbox" name="rate" value="rate">';
        html += Translator.trans('region_config_allow_rate', {}, 'media_resource');
        html += '               </label>';
        html += '           </div>';
        html += '           <hr/>';
        // help texts
        html += '           <div class="row">';
        html += '             <div class="col-md-12">';
        html += '               <h4>' + Translator.trans('region_config_help_texts', {}, 'media_resource') + '</h4>';
        for (var i = 0; i < 3; i++) {

            if (texts[i] !== '') {
                html += '                 <input type="text" name="modal-help-texts[]" class="form-control modal-help-texts" value="' + texts[i] + '">';
            } else {
                html += '                 <input type="text" name="modal-help-texts[]" placeholder="' + Translator.trans('region_config_help_texts_placeholder', {}, 'media_resource') + '" class="form-control modal-help-texts" value="">';
            }
            if (i < 2) {
                html += '           <hr>';
            }
        }
        html += '             </div>';
        html += '           </div>'; // help texts end
        html += '           <hr>';
        // help links
        html += '           <div class="row">';
        html += '             <div class="col-md-12">';
        html += '               <h4>' + Translator.trans('region_config_help_links', {}, 'media_resource') + '&nbsp;<small>' + Translator.trans('region_config_help_links_small', {}, 'media_resource') + '</small></h4>';
        for (var i = 0; i < 3; i++) {
            if (links[i] !== '') {
                html += '       <input type="url" pattern="https?://[a-z0-9\-_]+(\.[a-z0-9\-_]+)+([a-z0-9\-\.,@\?^=%&;:/~\+#]*[a-z0-9\-@\?^=%&;/~\+#])?" name="modal-help-links[]" class="form-control modal-help-links" value="' + links[i] + '">';
            } else {
                html += '       <input type="url" pattern="https?://[a-z0-9\-_]+(\.[a-z0-9\-_]+)+([a-z0-9\-\.,@\?^=%&;:/~\+#]*[a-z0-9\-@\?^=%&;/~\+#])?" value="" name="modal-help-links[]" placeholder="' + Translator.trans('region_config_help_links_placeholder', {}, 'media_resource') + '" class="form-control modal-help-links">';
            }
            if (i < 2) {
                html += '      <hr>';
            }
        }
        html += '             </div>'; // col-md-12 end
        html += '           </div>'; // row help links end
        html += '           <hr>';
        // related region dropdown
        html += '           <h4>' + Translator.trans('region_config_help_region_title', {}, 'media_resource') + '</h4>';
        html += '           <div class="row">';
        html += '             <div class="col-md-10">';
        html += '               <select name="region" class="form-control" id="select-help-related-region">';
        html += '                   <option value="-1">' + Translator.trans('none', {}, 'media_resource') + '</option>';
        // loop
        for (var i = 0; i < rRows.length; i++) {
            // we do not want the current region to appear in this list
            if (currentRegionStart !== rRows[i].hstart) {
                var selected = '';
                if (helpRegionUuid.val() === rRows[i].uid) {
                    selected = 'selected';
                    var time = Number(rRows[i].start) + 0.1;
                }
                html += '           <option value="' + rRows[i].uid + '" ' + selected + '>' + rRows[i].hstart + ' - ' + rRows[i].hend + '</option>';
            }
        }
        html += '               </select>';
        html += '             </div>';
        html += '             <div class="col-md-2">';
        html += '               <button class="btn btn-default" role="button" type="button" id="btn-help-related-region-play">';
        html += '               <i class="fa fa-play"></i> ';
        html += '                / ';
        html += '               <i class="fa fa-pause"></i>';
        html += '               </button>';
        html += '             </div>';
        html += '           </div>'; // end select row
        html += '       </div>'; // end form
        html += '   </div>'; // end col
        html += '</div>'; // end row

        return html;
    }

    /**
     * region current region to create
     * utils
     * appendTo dom row jquery object the row after witch we need to add the new region row
     */
    addRegionToDom(region, javascriptUtils, $appendTo) {

        // HTML to append
        var html = '';
        html += '<div class="row form-row region" id="' + region.uuid + '" data-uuid="' + region.uuid + '">';
        // start input
        html += '       <div class="col-xs-1 text-center">';
        html += '           <div class="time-text start">' + javascriptUtils.secondsToHms(region.start) + '</div>';
        html += '       </div>';
        // end input
        html += '       <div class="col-xs-1 text-center">';
        html += '           <div class="time-text end">' + javascriptUtils.secondsToHms(region.end) + '</div>';
        html += '       </div>';
        // text input
        html += '       <div class="col-xs-7">';
        html += '           <div contenteditable="true" class="text-left note">' + region.note + '</div>';
        html += '       </div>';
        // row index info (ie region order)
        html += '       <div class="col-xs-1 text-right">';
        html += '             <span class="badge row-index"></span>';
        html += '       </div>';
        // region config buttons
        html += '       <div class="col-xs-2 text-right">';
        html += '           <div class="btn-group" role="group">';
        html += '               <button type="button" class="btn btn-default region-play" title="' + Translator.trans('play_pause_region', {}, 'media_resource') + '">';
        html += '                 |-&nbsp;<i class="fa fa-play"></i>&nbsp;-|';
        html += '               </button>';
        html += '               <button role="button" type="button" class="btn btn-default region-config" title="' + Translator.trans('region_config', {}, 'media_resource') + '">';
        html += '                 <i class="fa fa-cog"></i>';
        html += '               </button>';
        html += '               <button type="button" name="del-region-btn" class="btn btn-danger region-delete" data-uuid="' + region.uuid + '" title="' + Translator.trans('region_delete', {}, 'media_resource') + '">';
        html += '                 <i class="fa fa-trash-o"></i>';
        html += '               </button>';
        html += '           </div>';
        html += '       </div>';
        // hidden fields
        html += '       <input type="hidden" class="hidden-start" name="start[]" value="' + region.start + '" required="required">';
        html += '       <input type="hidden" class="hidden-end" name="end[]" value="' + region.end + '" required="required">';
        html += '       <input type="hidden" class="hidden-note" name="note[]" value="' + region.note + '">';
        html += '       <input type="hidden" class="hidden-region-id" name="region-id[]" value="" >';
        html += '       <input type="hidden" class="hidden-region-uuid" name="region-uuid[]" value="' + region.uuid + '" >';

        html += '       <input type="hidden" class="hidden-config-help-region-uuid" name="help-region-uuid[]" value="" >';
        html += '       <input type="hidden" class="hidden-config-loop" name="loop[]" value="0" >';
        html += '       <input type="hidden" class="hidden-config-backward" name="backward[]" value="0" >';
        html += '       <input type="hidden" class="hidden-config-rate" name="rate[]" value="0" >';

        html += '       <input type="hidden" class="hidden-help-texts" name="help-texts[]" value="">';
        html += '       <input type="hidden" class="hidden-help-texts" name="help-texts[]" value="">';
        html += '       <input type="hidden" class="hidden-help-texts" name="help-texts[]" value="">';

        html += '       <input type="hidden" class="hidden-help-links" name="help-links[]" value="">';
        html += '       <input type="hidden" class="hidden-help-links" name="help-links[]" value="">';
        html += '       <input type="hidden" class="hidden-help-links" name="help-links[]" value="">';
        html += '</div>';

        // append the row in the right place
        $(html).insertAfter($appendTo);
    }

    /**
     * get regions that are using the given regionUuid as help region
     * @param {type} uuid the region uuid
     * @returns {Array of region uuid}
     */
    getRegionsUsedInHelp(uuid) {
        var results = [];
        // for each region row
        $('.region').each(function() {
            // if one or more region have the hidden input setted the deleted region is used in help
            var searched = $(this).find('input.hidden-config-help-region-uuid').val();
            if (searched == uuid) {
                // push the input in result array
                results.push(searched);
            }
        });
        return results;
    }

    /**
     * For a given region uuid, find the dom row, find the region start info
     * @param string rowUuid
     * @returns region start value
     */
    getHelpRelatedRegionStart(rowUuid) {
        return Number($('#' + rowUuid).find('.hidden-start').val());
    }

    getHelpRelatedRegionData(rowUuid){
      let region = {}
      $('.region').each(function(){
        console.log($(this).attr('data-uuid'));
        console.log('searched ' + rowUuid);
        if($(this).attr('data-uuid') === rowUuid){
          region.start = Number($(this).find('.hidden-start').val());
          region.end = Number($(this).find('.hidden-end').val());
        }
      })
      return region
    }

    /**
     * Get the region associatied row (ie DOM object)
     * @param start
     * @param end
     * @returns the row
     */
    getRegionRow(start, end) {
        var row;
        $('.region').each(function() {
            var temp = $(this);
            // current row start
            var sinput = $(this).find("input.hidden-start");
            // current row end
            var einput = $(this).find("input.hidden-end");
            if (start && end && Number(sinput.val()) <= Number(start) && Number(einput.val()) >= Number(end)) {
                row = temp;
            } else if (!end && start && Number(sinput.val()) === Number(start)) {
                row = temp;
            } else if (!start && end && Number(einput.val()) === Number(end)) {
                row = temp;
            }
        });
        return row;
    }

    /**
     * Highlight a row
     * @param region
     */
    highlightRegionRow(region) {
        var row = this.getRegionRow(region.start + 0.1, region.end - 0.1);
        if (row) {
            $('.active-row').each(function() {
                $(this).removeClass('active-row');
            });
            $(row).find('.note').addClass('active-row');
        }
    }

    /**
     * Update Hidden inputs values for contenteditable=true divs (ie region notes divs)
     * @param {type} elem
     */
    updateHiddenNoteInput(elem) {
        // find associated input[name="note"] input and set val
        var hiddenNoteInput = $(elem).closest(".region").find('input.hidden-note');
        var content = $(elem).html() ? $(elem).html() : $(elem).text();
        content.replace('<br>', '');
        $(hiddenNoteInput).val(content);
    }

    getSimpleHelpModalContent(current, audioData, shared) {
        var html = '<div class="row">';
        html += '       <div class="col-md-12 text-center">';
        //html += '           <audio id="help-audio-player" src="' + audioData + '"></audio>'; // will not show as no controls are defined
        html += '           <div class="row">';
        html += '               <div class="col-md-12">';
        html += '                   <div class="btn-group">';
        html += '                       <button class="btn btn-default play-help" title="' + Translator.trans('region_help_segment_playback', {}, 'media_resource') + '" data-start="' + current.start + '" data-end="' + current.end + '" data-mode="' + shared.playMode.PLAY_NORMAL + '">';
        html += '                           <i class="fa fa-play"></i> ';
        html += '                           / ';
        html += '                           <i class="fa fa-pause"></i>';
        html += '                       </button>';
        html += '                       <button class="btn btn-default play-help" title="' + Translator.trans('region_help_segment_playback_loop', {}, 'media_resource') + '"  data-start="' + current.start + '" data-end="' + current.end + '" data-mode="' + shared.playMode.PLAY_LOOP + '">';
        html += '                           <i class="fa fa-retweet"></i> ';
        html += '                       </button>';
        html += '                       <button class="btn btn-default play-help" title="' + Translator.trans('region_help_segment_playback_rate', {}, 'media_resource') + '"  data-start="' + current.start + '" data-end="' + current.end + '" data-mode="' + shared.playMode.PLAY_SLOW + '">x0.8</button>';
        html += '                   </div>';
        html += '               </div>';
        html += '           </div>';
        html += '       </div>';
        html += '</div>';
        return html;
    }
}
