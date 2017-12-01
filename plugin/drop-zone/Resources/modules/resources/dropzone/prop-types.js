import {PropTypes as T} from 'prop-types'

const CriterionType = {
  propTypes: {
    id: T.string.isRequired,
    dropzone: T.string.isRequired,
    instruction: T.string
  }
}

const DropzoneType = {
  propTypes: {
    id: T.string.isRequired,
    parameters: T.shape({
      editionState: T.number.isRequired,
      workspaceResourceEnabled: T.bool.isRequired,
      uploadEnabled: T.bool.isRequired,
      urlEnabled: T.bool.isRequired,
      richTextEnabled: T.bool.isRequired,
      peerReview: T.bool.isRequired,
      expectedCorrectionTotal: T.number.isRequired,
      scoreMax: T.number.isRequired,
      scoreToPass: T.number.isRequired,
      dropType: T.number.isRequired,
      manualPlanning: T.bool.isRequired,
      manualState: T.number.isRequired,
      dropStartDate: T.string,
      dropEndDate: T.string,
      reviewStartDate: T.string,
      reviewEndDate: T.string,
      commentInCorrectionEnabled: T.bool.isRequired,
      commentInCorrectionForced: T.bool.isRequired,
      correctionDenialEnabled: T.bool.isRequired,
      criteriaEnabled: T.bool.isRequired,
      criteriaTotal: T.number.isRequired,
      autoCloseDropsAtDropEndDate: T.bool.isRequired,
      autoCloseState: T.number.isRequired
    }).isRequired,
    display: T.shape({
      instruction: T.string,
      correctionInstruction: T.string,
      successMessage: T.string,
      failMessage: T.string,
      displayNotationToLearners: T.bool.isRequired,
      displayNotationMessageToLearners: T.bool.isRequired,
      displayCorrectionsToLearners: T.bool.isRequired
    }).isRequired,
    notifications: T.shape({
      enabled: T.bool.isRequired,
      actions: T.arrayOf(T.string)
    }).isRequired,
    criteria: T.arrayOf(T.shape(CriterionType.propTypes))
  }
}

const DropzoneToolDocumentType = {
  propTypes: {
    id: T.string.isRequired,
    document: T.string.isRequired,
    tool: T.string.isRequired,
    data: T.shape({
      idDocument: T.string,
      reportUrl: T.string
    })
  }
}

const DocumentType = {
  propTypes: {
    id: T.string.isRequired,
    type: T.number.isRequired,
    drop: T.string.isRequired,
    user: T.shape({
      id: T.number.isRequired,
      username: T.string.isRequired,
      firstName: T.string.isRequired,
      lastName: T.string.isRequired
    }),
    dropDate: T.string,
    toolDocuments: T.arrayOf(T.shape(DropzoneToolDocumentType.propTypes))
  }
}

const GradeType = {
  propTypes: {
    id: T.string.isRequired,
    value: T.number,
    correction: T.string.isRequired,
    criterion: T.string.isRequired
  }
}

const CorrectionType = {
  propTypes: {
    id: T.string.isRequired,
    drop: T.string.isRequired,
    user: T.shape({
      id: T.number.isRequired,
      username: T.string.isRequired,
      firstName: T.string.isRequired,
      lastName: T.string.isRequired
    }),
    role: T.shape({
      id: T.number.isRequired,
      name: T.string.isRequired,
      translationKey: T.string.isRequired
    }),
    score: T.number,
    comment: T.string,
    valid: T.bool.isRequired,
    startDate: T.string.isRequired,
    lastOpenDate: T.string.isRequired,
    endDate: T.string,
    finished: T.bool.isRequired,
    editable: T.bool.isRequired,
    reported: T.bool.isRequired,
    reportedComment: T.string,
    correctionDenied: T.bool.isRequired,
    correctionDeniedComment: T.string,
    grades: T.arrayOf(T.shape(GradeType.propTypes))
  }
}

const DropType = {
  propTypes: {
    id: T.string.isRequired,
    dropzone: T.string.isRequired,
    user: T.shape({
      id: T.number.isRequired,
      username: T.string.isRequired,
      firstName: T.string.isRequired,
      lastName: T.string.isRequired
    }),
    role: T.shape({
      id: T.number.isRequired,
      name: T.string.isRequired,
      translationKey: T.string.isRequired
    }),
    dropDate: T.string,
    score: T.number,
    reported: T.bool.isRequired,
    finished: T.bool.isRequired,
    number: T.number,
    autoClosedDrop: T.bool.isRequired,
    unlockedDrop: T.bool.isRequired,
    unlockedUser: T.bool.isRequired,
    documents: T.arrayOf(T.shape(DocumentType.propTypes)),
    corrections: T.arrayOf(T.shape(CorrectionType.propTypes))
  }
}

export {
  CriterionType,
  DropzoneType,
  DropzoneToolDocumentType,
  DocumentType,
  GradeType,
  CorrectionType,
  DropType
}
