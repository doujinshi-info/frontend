/**
 * Converts Base64 strings into a unsigned integer array.
 *
 * @param {string} base64String The Base64 string to convert to Int8 array.
 * @return {Array}
 */
export default function base64toInt8(base64String) {
  const padding = '='.repeat((4 - base64String.length % 4) % 4);

  const base64 = (base64String + padding)
    .replace(/\-/g, '+')
    .replace(/_/g, '/');

  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }

  return outputArray;
}
