export function Break({ time = "500ms" } = {}) {
  const ms = parseInt(time || '0', 10);
    if (!isNaN(ms)) {
    __$enqueueSpeech({ type: 'break', time: ms })
    // speechQueue.push();
    }
  return " ";
}