/**
 * Extracts tags of a specific type into their own array.
 *
 * @param  {string} category The tag type slug.
 * @param  {array} tags      The array of tags.
 * @return {array}           The array containing only tags of the type.
 */
export default function(category, tags) {
  const results = tags.data.map((tag) => {
    if (tag.type.slug == category) {
      return tag;
    }
  }).filter(Boolean);

  if (results.length) {
    return results;
  } else {
    return false;
  }
}
