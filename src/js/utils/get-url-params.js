import uri from 'urijs';

/**
 * Get params from the url.
 *
 * @param  {string} param The param to extract from.
 * @return {string}       The param's value.
 */
export default function getUrlParam(param) {
  return uri().query(true)[param];
}
