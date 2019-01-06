/**
 * [description]
 * @param  {[type]}  title       [description]
 * @param  {[type]}  description [description]
 * @param  {Boolean} image       [description]
 */
export default function(title, description, image = false) {
  document.head.innerHTML += `
    <meta property="og:title" content="`+title+`">
    <meta property="og:description" content="`+description+`">
    `+(image ? '<meta property="og:image" content="`+image+`">' : '')+`
    <meta property="og:url" content="`+[
      location.protocol, '//',
      location.host,
      location.pathname,
      ].join('')+`
    ">
    <meta name="twitter:title" content="`+title+`">
    <meta name="twitter:description" content="`+description+`">
    `+(image ? '<meta property="twitter:image" content="`+image+`">' : '')+`
    <meta name="twitter:card" content="summary_large_image">
  `;
}
