let _handler = null;

export function setToastHandler(fn) {
  _handler = fn;
}

export function toast(message, type = "info") {
  if (typeof _handler === "function") _handler(message, type);
  else console.log("TOAST:", type, message);
}

export default { setToastHandler, toast };
