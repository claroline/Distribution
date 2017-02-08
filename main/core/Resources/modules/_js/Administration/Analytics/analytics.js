import $ from 'jquery'

var bg_color = 'transparent'
var chartData = window.chartData
var userPieChartData = window.userPieChartData

$(document).ready(function () {
  if (chartData.length > 0) {
    $.jqplot(
      'activity-bar-chart',
      [chartData],
      {
        title: {show: false},
        grid: {
          drawBorder: false,
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
            pad: 1.2,
            tickOptions: {
              formatString: '%d %b',
              showGridline: false,
              showMark: true,
              angle: 0,
              fontSize: '11px'
            },
            numberTicks: 7
          },
          yaxis: {
            min: 0,
            showTickMarks: true,
            numberTicks: 7,
            tickOptions: {
              fontSize: '11px'
            }
          }
        },
        highlighter: {
          show: true,
          showMarker: false,
          sizeAdjust: 0,
          tooltipOffset: 10,
          tooltipLocation: 'n',
          tooltipAxes: 'xy',
          formatString: '%s <br/> %d',
          tooltipFadeSpeed: 'fast'
        },
        cursor: {
          show: false,
          zoom: false,
          style: 'pointer'
        },
        seriesDefaults: {
          showMarker: false,
          renderer: $.jqplot.BarRenderer,
          showLabel: false,
          pointLabels: { show: false },
          rendererOptions: {
            barPadding: 0,
            barMargin: 10,
            barDirection: 'vertical',
            barWidth: 20
          },
          shadow: false
        }
      }
    )
  }

  if (userPieChartData.length > 0) {
    $.jqplot(
      'users-pie-chart',
      [userPieChartData],
      {
        title: {show: false},
        grid: {
          drawBorder: false,
          shadow: false,
          background: bg_color,
          useNegativeColors: false
        },
        highlighter: {
          show: false
        },
        cursor: {
          show: false,
          zoom: false,
          showTooltip: false
        },
        seriesDefaults: {
          showMarker: true,
          renderer: $.jqplot.PieRenderer,
          rendererOptions: {
            showDataLabels: true,
            dataLabelThreshold: 2,
            dataLabels: 'percent',
            sliceMargin: 0.3,
            dataLabelFormatString: '%.1f%%',
            highlightMouseOver: false
          },
          shadow: false
        },
        legend: {
          location: 'e',
          border: 'none',
          renderer: $.jqplot.CavasTextRenderer,
          show: true,
          showMarker: true,
          rendererOptions: {
            numberRows: 7
          },
          backgroundColor: bg_color,
          placement: 'outsideGrid'
        }
      }
    )
  }
})
