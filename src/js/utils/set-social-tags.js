/**
 * [description]
 * @param  {[type]}  title       [description]
 * @param  {[type]}  description [description]
 * @param  {Boolean} image       [description]
 */
export default function(title, description, image = false) {
  const link = [
    location.protocol, '//',
    location.host,
    location.pathname,
  ].join('');

  let tags = '';

  tags += '<meta property="og:title" content="'+title+'">';
  tags += '<meta property="og:description" content="'+description+'">';
  tags += '<meta property="og:url" content="'+link+'">';
  tags += '<meta name="twitter:title" content="'+title+'">';
  tags += '<meta name="twitter:description" content="'+description+'">';

  if (image) {
    tags += '<meta property="og:image" content="'+image+'">';
    tags += '<meta property="twitter:image" content="'+image+'">';
    tags += '<meta name="twitter:card" content="summary_large_image">';
  }

  document.head.innerHTML += tags;
}
