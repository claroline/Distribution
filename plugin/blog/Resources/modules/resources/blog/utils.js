function getCommentsNumber(canEdit, publisedNumber, unpublishedNumber) {
  return canEdit ? publisedNumber + unpublishedNumber : publisedNumber
}

export {getCommentsNumber}