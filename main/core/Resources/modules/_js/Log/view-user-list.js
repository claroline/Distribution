import $ from 'jquery'
import 'jqplot'

var bg_color = "transparent";
if (navigator.userAgent.match(/msie/i) && navigator.userAgent.match(/8/)) bg_color = "#fff";

var drawUserBarChart = function(chartData, containerId, maxValue) {
    if (chartData.length>0) {
        var barWidth = Math.max(Math.floor($("#"+containerId).width()/chartData.length) - 3, 3);
        var actionsPlot = $.jqplot(
                containerId,
                [chartData],
                {
                    title: {show: false},
                    grid: {
                        drawGridlines: false,
                        drawBorder: false,
                        shadow: false,
                        background: bg_color
                    },
                    axesDefaults: {
                        labelRenderer: $.jqplot.CanvasAxisLabelRenderer,
                        tickRenderer: $.jqplot.CanvasAxisTickRenderer,
                        tickOptions: {
                            showGridline: false,
                            show: true,
                            showMark: false,
                            fontSize: '10px'
                        }
                    },
                    axes: {
                        xaxis: {
                            renderer: $.jqplot.DateAxisRenderer,
                            tickOptions: {
                                formatString: Translator.trans('jqplot_date_output_format', {}, 'platform')
                            },
                            numberTicks: 2,
                            max: chartData[chartData.length-1][0]
                        },
                        yaxis: {
                            min: 0,
                            max: maxValue,
                            numberTicks: 1
                        }
                    },
                    highlighter: {
                        show: true,
                        showMarker:false,
                        tooltipOffset:5,
                        tooltipLocation:'n',
                        tooltipAxes:'xy',
                        formatString:'%s <br/> %d',
                        tooltipFadeSpeed:'fast'
                    },
                    cursor: {
                        show: false
                    },
                    seriesDefaults: {
                        renderer: $.jqplot.BarRenderer,
                        shadow:false,
                        useNegativeColors: false,
                        rendererOptions:{
                            highlightMouseOver: true,
                            highlightMouseDown: true,
                            barWidth: barWidth,
                            barMargin: 3
                        }
                    }
                }
        );
    }
};

window.drawUserBarChart = drawUserBarChart
