function UnsafeFilter($sce) {
  //console.log('$sce')
  //console.log($sce)
    return $sce.trustAsHtml
}

export default UnsafeFilter
