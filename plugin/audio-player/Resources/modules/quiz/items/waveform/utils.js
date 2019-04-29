function isOverlayed(sections, start, end, excludedIndex) {
  let overlayed = false

  sections.forEach((s, idx) => {
    const startTolerance = s.startTolerance ? s.startTolerance : 0
    const endTolerance = s.endTolerance ? s.endTolerance : 0

    if (idx !== excludedIndex && (
      (start >= s.start - startTolerance && start <= s.end + endTolerance) ||
      (end >= s.start - startTolerance && end <= s.end + endTolerance) ||
      (start <= s.start - startTolerance && end >= s.end + endTolerance)
    )) {
      overlayed = true
    }
  })

  return overlayed
}

export {
  isOverlayed
}
