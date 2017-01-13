/* global Routing */

export function generateUrl(route, parameters = {}) {
  return Routing.generate(route, parameters)
}
