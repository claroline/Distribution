
function getMainFacet(facets) {
  return facets.find(facet => facet.meta.main) || facets[0]
}

export {
  getMainFacet
}
