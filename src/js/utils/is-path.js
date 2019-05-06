import uri from 'urijs';

/**
 * [isPath description]
 * @param  {[type]}  path   [description]
 * @param  {Boolean} strict [description]
 * @return {Boolean}        [description]
 */
export default function isPath(path, strict = true) {
  if (strict) {
    return uri().path(true) == path ? true : false;
  } else {
    if (window.location.href.indexOf(path) > -1) {
      return true;
    } else {
      return false;
    }
  }
}
