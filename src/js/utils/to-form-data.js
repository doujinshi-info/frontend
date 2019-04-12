'use strict';

/**
 * Converts an object to a formData object.
 *
 * @param  {[type]} obj       [description]
 * @param  {[type]} form      [description]
 * @param  {[type]} namespace [description]
 * @return {[type]}           [description]
 */
export default function toFormData(obj, form, namespace) {
  let fd = form || new FormData();
  let formKey;

  for (let property in obj) {
    if (obj.hasOwnProperty(property) && obj[property]) {
      if (namespace) {
        formKey = namespace + '[' + property + ']';
      } else {
        formKey = property;
      }

      // if the property is an object, but not a File, use recursivity.
      if (obj[property] instanceof Date) {
        fd.append(formKey, obj[property].toISOString());
      } else if (typeof obj[property] === 'object'
        && !(obj[property] instanceof File)) {
        toFormData(obj[property], fd, formKey);
      } else {
        // if it's a string or a File object
        fd.append(formKey, obj[property]);
      }
    } else {
      if (obj[property] !== null && obj[property] !== undefined) {
        fd.append(property, obj[property]);
      }
    }
  }



  return fd;
}
