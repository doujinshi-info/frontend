import uri from 'urijs';

/**
 * [isPath description]
 * @param  {[type]}  path [description]
 * @return {Boolean}      [description]
 */
export default function isPath(path) {
  return uri().path(true) == path ? true : false;
}
