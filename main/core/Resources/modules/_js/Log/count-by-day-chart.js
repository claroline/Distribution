import $ from 'jquery'

/* global Translator */

var bg_color = 'transparent'
chartData = window.chartData

if (chartData.length>0) {
  var actionsPlot = $.jqplot(
            'actions-line-chart',
            [chartData],
    {
      title: {show: false},
      grid: {
        drawBorder: true,
        borderWidth: 1.0,
        shadow: false,
        background: bg_color
      },
      axesDefaults: {
        labelRenderer: $.jqplot.CanvasAxisLabelRenderer,
        tickRenderer: $.jqplot.CanvasAxisTickRenderer
      },
      axes: {
        xaxis: {
          renderer: $.jqplot.DateAxisRenderer,
          tickOptions: {
            formatString: Translator.trans('jqplot_date_output_format', {}, 'platform'),
            showGridline: false,
            showMark: true,
            angle: -20,
            fontSize: '10px'
          },
          numberTicks:10
        },
        yaxis: {
          min:0,
          showTickMarks: true,
          numberTicks: 5
        }
      },
      highlighter: {
        show: true,
        sizeAdjust: 1,
        tooltipOffset:12,
        tooltipLocation:'n',
        tooltipAxes:'xy',
        formatString:'%s <br/> %d',
        tooltipFadeSpeed:'fast'
      },
      cursor: {
        show: true,
        zoom: true,
        showTooltip: false
      },
      seriesDefaults: {
        showMarker:((chartData.length<10)?true:false),
        markerOptions:{shadow:false},
        shadow:false,
        showLine:true,
        useNegativeColors: false,
        fill: true,
        lineWidth: 1.5,
        fillAndStroke: true,
        fillAlpha: 0.12,
        rendererOptions:{highlightMouseOver: true, highlightMouseDown: true}
      }
    }
        )
}
