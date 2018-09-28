/* global document */

/**
 * Gets the HTMLElement where we attach the overlays.
 *
 * @param overlayType
 *
 * @return {function}
 */
function getOverlayContainer(overlayType) {
  return () => document.querySelector(`.app-overlays .app-${overlayType}`) || undefined
}

export {
  getOverlayContainer
}
