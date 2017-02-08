import $ from 'jquery'

var bg_color = 'transparent'
var pieChartData = window.pieChartData
var numberRows = window.numberRows

if (pieChartData.length>0) {
  $.jqplot(
            'resources-pie-chart',
            [pieChartData],
    {
      grid: {
        drawBorder: false,
        shadow: false,
        background: bg_color,
        useNegativeColors: false
      },
      seriesDefaults: {
        show: true,
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
        location: 's',
        border: 'none',
        renderer: $.jqplot.CanvasTextRenderer,
        show: true,
        showMarker: true,
        rendererOptions: {
          numberRows: numberRows
        },
        backgroundColor: bg_color,
        placement: 'outsideGrid'
      }
    }
        )
}
