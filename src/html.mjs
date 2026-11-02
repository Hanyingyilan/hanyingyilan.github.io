// Shared escaping for build-time HTML text and double-quoted attributes.
export const escapeHTML = value => String(value).replace(/[&<>"]/g, character => ({
 '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;'
}[character]));
