
const explanation = (state) => {
  console.log(state)
  return state.explanation
}
const log = (state) => state.log

export const select = {
  explanation,
  log
}
