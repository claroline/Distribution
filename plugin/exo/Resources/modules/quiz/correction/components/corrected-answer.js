export class Answerable {
  constructor(score = null, penalty = null) {
    this.score = score
    this.penalty = penalty
  }

  getScore() {
    return this.score
  }

  getPenalty() {
    return this.penalty
  }
}

export class CorrectedAnswer {
  constructor(expected = [], missing = [], unexpected = [], penalties = []) {
    this.expected = expected
    this.missing = missing
    this.unexpected = unexpected
    this.penalties = penalties
  }

  getExpected() {
    return this.expected
  }

  addExpected(expected) {
    this.expected.push(expected)
  }

  getMissing() {
    return this.missing
  }

  addMissing(missing) {
    this.missing.push(missing)
  }

  getUnexpected() {
    return this.unexpected
  }

  addUnexpected(unexpected) {
    this.unexpected.push(unexpected)
  }

  getPenalties() {
    return this.penalties
  }

  addPenalty(penalty) {
    this.penalty.push(penalty)
  }
}
