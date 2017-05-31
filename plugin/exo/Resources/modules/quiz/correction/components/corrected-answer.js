class Answerable {
  constructor(el) {
    this.el = el
  }

  getScore() {
    return this.el.score ? this.el.score: this.el._score
  }

  getPenalty() {
    //console.log(this.el)
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
    this.expected.push(new Answerable(expected))
  }

  getMissing() {
    return this.missing
  }

  addMissing(missing) {
    this.missing = this.missing.push(new Answerable(missing))
  }

  getUnexpected() {
    return this.unexpected
  }

  addUnexpected(unexpected) {
    this.unexpected.push(new Answerable(unexpected))
  }

  getPenalties() {
    return this.penalties
  }

  addPenalty(penalty) {
    this.penalty.push(new Answerable(penalty))
  }
}
