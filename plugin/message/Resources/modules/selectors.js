
const message = (state) => state.currentMessage
const reply = (state) => state.messageForm.reply

export const selectors = {
  message,
  reply
}
