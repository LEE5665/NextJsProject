import sanitizeHtml from 'sanitize-html';

// Treat editor output and previously stored posts as untrusted HTML.
export function sanitizePostHtml(html) {
  return sanitizeHtml(typeof html === 'string' ? html : '', {
    allowedTags: ['p', 'br', 'strong', 'b', 'em', 'i', 'u', 's', 'strike',
      'blockquote', 'pre', 'code', 'h1', 'h2', 'h3', 'ol', 'ul', 'li', 'span', 'a', 'img'],
    allowedAttributes: {
      '*': ['class', 'style'],
      a: ['href', 'title'],
      img: ['src', 'alt', 'width', 'height'],
      li: ['data-list'],
    },
    allowedClasses: {
      '*': ['ql-align-center', 'ql-align-right', 'ql-align-justify',
        'ql-size-small', 'ql-size-large', 'ql-size-huge', 'ql-direction-rtl',
        'ql-indent-1', 'ql-indent-2', 'ql-indent-3', 'ql-indent-4',
        'ql-indent-5', 'ql-indent-6', 'ql-indent-7', 'ql-indent-8', 'ql-ui'],
    },
    allowedStyles: {
      '*': {
        color: [/^#[0-9a-f]{3,8}$/i, /^rgb\(\s*\d{1,3},\s*\d{1,3},\s*\d{1,3}\s*\)$/i],
        'background-color': [/^#[0-9a-f]{3,8}$/i, /^rgb\(\s*\d{1,3},\s*\d{1,3},\s*\d{1,3}\s*\)$/i],
        'text-align': [/^(left|right|center|justify)$/],
      },
    },
    allowedSchemes: ['http', 'https', 'mailto'],
    allowedSchemesByTag: { img: ['http', 'https', 'data'] },
    allowProtocolRelative: false,
    exclusiveFilter: ({ tag, attribs }) => tag === 'img' &&
      /^data:/i.test(attribs.src || '') &&
      !/^data:image\/(png|jpeg|gif|webp);base64,[a-z0-9+/=\s]+$/i.test(attribs.src),
  });
}
