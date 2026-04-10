import { logError } from "../loggers/errorLogger.js";
export async function tryCatchSmart(label, fn, ...args) {
  try {
    return await fn(...args);
  } catch (err) {
    logError(label, err, args);
  }
}