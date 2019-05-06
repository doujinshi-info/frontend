/**
 * Converts a form data array into an array.
 *
 * @param  {[type]} obj [description]
 * @return {[type]}     [description]
 */
export default function(obj) {
  const result = [];

  for (let i = 0; i < obj.length; i++) {
    result.push(obj[i].value);
  }

  return result;
}
