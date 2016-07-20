export default class JsUtils {
    // get selected text in the current window
  getSelectedText () {
    var txt = ''
    if (window.getSelection) {
      txt = window.getSelection()
    } else if (window.document.getSelection) {
      txt = window.document.getSelection()
    } else if (window.document.selection) {
      txt = window.document.selection.createRange().text
    }
    return txt
  }

    /**
     * format decimal time into human readable time
     * @param d decimal
     * @returns formated time
     */
  secondsToHms (d) {
    d = Number(d)
    if (d > 0) {

      var hours = Math.floor(d / 3600)
      var minutes = Math.floor(d % 3600 / 60)
      var seconds = Math.floor(d % 3600 % 60)

            // ms
      var str = d.toString()
      var substr = str.split('.')
      var ms = substr[1].substring(0, 2)

      if (hours < 10) {
        hours = '0' + hours
      }
      if (minutes < 10) {
        minutes = '0' + minutes
      }
      if (seconds < 10) {
        seconds = '0' + seconds
      }
           // var time = hours + ':' + minutes + ':' + seconds + ':' + ms;
      var time = minutes + ':' + seconds + ':' + ms
      return time
    }
    else {

      return '00:00:00'
    }
  }
    // get selected text and parent element in the current window
  getSelectionTextAndContainerElement () {
    var text = '', containerElement = null
    if (typeof window.getSelection !== 'undefined') {
      var sel = window.getSelection()
      if (sel.rangeCount) {
        var node = sel.getRangeAt(0).commonAncestorContainer
        containerElement = node.nodeType === 1 ? node : node.parentNode
        text = sel.toString()
      }
    } else if (typeof document.selection !== 'undefined' &&
                document.selection.type !== 'Control') {
      var textRange = document.selection.createRange()
      containerElement = textRange.parentElement()
      text = textRange.text
    }
    return {
      text: text,
      containerElement: containerElement
    }
  }

  toggleFullScreen (elem) {
        // https://developer.mozilla.org/fr/docs/Web/Guide/DOM/Using_full_screen_mode
    if (!document.fullscreenElement && // alternative standard method
                !document.mozFullScreenElement && !document.webkitFullscreenElement) {  // current working methods
      if (document.documentElement.requestFullscreen) {
        document.documentElement.requestFullscreen()
      } else if (document.documentElement.mozRequestFullScreen) {
        document.documentElement.mozRequestFullScreen()
      } else if (document.documentElement.webkitRequestFullscreen) {
        document.documentElement.webkitRequestFullscreen(Element.ALLOW_KEYBOARD_INPUT)
      }
    } else {
      if (document.cancelFullScreen) {
        document.cancelFullScreen()
      } else if (document.mozCancelFullScreen) {
        document.mozCancelFullScreen()
      } else if (document.webkitCancelFullScreen) {
        document.webkitCancelFullScreen()
      }
    }


    if (elem.requestFullscreen) {
      elem.requestFullscreen()
    } else if (elem.msRequestFullscreen) {
      elem.msRequestFullscreen()
    } else if (elem.mozRequestFullScreen) {
      elem.mozRequestFullScreen()
    } else if (elem.webkitRequestFullscreen) {
      elem.webkitRequestFullscreen()
    }
  }
}
