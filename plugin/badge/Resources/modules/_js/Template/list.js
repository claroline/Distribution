import $ from 'jquery'
import 'jqplot'

var s1 = window.s1

var jqplotInitialized = false;
$('a[data-toggle="tab"]').on('shown.bs.tab', function (e) {
    $target = $(e.target).attr("href");
    if ($target == "#stats" && !jqplotInitialized) {
        var plot = $.jqplot('globalAttrib', [s1], {
            grid: {
                drawBorder: false,
                background: 'white',
                shadow: false
            },
            seriesDefaults: {
                // make this a donut chart.
                renderer:$.jqplot.DonutRenderer,
                rendererOptions:{
                    shadow: false,
                    sliceMargin: 3,
                    startAngle: 90,
                    color:'white',
                    showDataLabels: true,
                    dataLabels: 'value',
                    padding: 5,
                    animation:{show:!$.jqplot.use_excanvas}
                }
            },
            legend: { show:true, location: 'e' }
        });

        $.jqplot.config.enablePlugins = true;
        var badges_per_user = window.badges_per_user;
        var dataLength = badges_per_user.length;
        var maxNbBadge = parseInt(badges_per_user[dataLength-1][0]);
        var barchartWidth = $("#badgesPerUsers").width()-50;

        plot1 = $.jqplot('badgesPerUsers', [badges_per_user], {
            axesDefaults: {
                labelRenderer: $.jqplot.CanvasAxisLabelRenderer,
                min: 0,
                tickOptions: {
                    formatString: '%d'
                }
            },
            animate: !$.jqplot.use_excanvas,
            grid: {
                drawBorder: false,
                background: 'white',
                shadow: false
            },
            seriesDefaults:{
                shadow: false,
                renderer:$.jqplot.BarRenderer,
                pointLabels: { show: true },
                rendererOptions: {
                    barWidth: Math.floor(barchartWidth/(maxNbBadge+10)),
                    animation:{show:!$.jqplot.use_excanvas}
                }
            },
            axes: {
                xaxis: {
                    label: Translator.trans('badges_number', {}, "icap_badge"),
                    renderer: $.jqplot.LinearAxisRenderer,
                    tickInterval: 1,
                    numberTicks: maxNbBadge+2
                },
                yaxis: {
                    label: Translator.trans('user_number', {}, "icap_badge"),
                    forceTickAt0: true
                }
            },
            highlighter: { show: false }
        });

        $('#badgesPerUsers').bind('jqplotDataClick',
                function (ev, seriesIndex, pointIndex, data) {
                    $('#info1').html('series: '+seriesIndex+', point: '+pointIndex+', data: '+data);
                }
        );

        //On recupere le nom du badge attribué, ainsi que son nombre
        var plot2 = $.jqplot('repartitionBadges', window.mostAwarded, {
            grid: {
                drawBorder: false,
                background: 'white',
                shadow: false
            },
            animate: !$.jqplot.use_excanvas,
            seriesDefaults:{
                shadow: false,
                renderer:$.jqplot.PieRenderer,
                rendererOptions: {
                    showDataLabels: true,
                    dataLabels: 'value',
                    padding:5
                },
                trendline:{
                    show: true
                }
            },
            legend:{
                show: true
            }
        });

        jqplotInitialized = true;
    }
});
