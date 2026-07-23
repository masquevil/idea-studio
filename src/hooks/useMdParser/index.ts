import { Marked } from 'marked';
import type { Tokens } from 'marked';
import { baseUrl } from 'marked-base-url';
import createValidityTagExtension from './validity-tag-extension';
import createClassViewExtension from './class-view-extension';
import createAlertExtension from './alert-extension';
import createMetaExtension from './meta-extension';

const marked = new Marked({
  breaks: true,
  gfm: true,
  async: false,
});

// common extensions
marked.use(baseUrl(import.meta.env.BASE_URL));

// custom extensions
marked.use(createValidityTagExtension());
marked.use(createClassViewExtension(marked));
marked.use(createAlertExtension(marked));
marked.use(createMetaExtension());

// basic renderers
marked.use({
  renderer: {
    heading({ tokens, depth }) {
      const text = this.parser.parseInline(tokens);
      return (
        `<h${depth} id="${createHeadingId(text)}" class="md-heading md-h${depth}">` +
        `<span class="md-heading-text">${text}</span></h${depth}>`
      );
    },
    paragraph({ tokens }) {
      const isStandaloneImage = tokens.length === 1 && tokens[0].type === 'image';
      if (isStandaloneImage) {
        const token = tokens[0] as Tokens.Image;
        return (
          `<figure class="md-img-container">` +
          (token.title ? `<figcaption class="md-img-caption">${token.title}</figcaption>` : '') +
          renderInlineImage(token) +
          `</figure>`
        );
      }

      const text = this.parser.parseInline(tokens);
      return `<p class="md-p">${text}</p>`;
    },
    hr() {
      return '<hr class="md-hr">';
    },
    strong({ tokens }) {
      const text = this.parser.parseInline(tokens);
      return `<strong class="md-strong">${text}</strong>`;
    },
    list(token) {
      const tag = token.ordered ? 'ol' : 'ul';
      const items = token.items
        .map((item) => {
          const content = this.parser.parseInline(item.tokens);
          return `<li class="md-li">${content}</li>`;
        })
        .join('');
      return `<${tag} class="md-${tag}">${items}</${tag}>`;
    },
    image(token) {
      return renderInlineImage(token);
    },
  },
});

function renderInlineImage(token: Tokens.Image) {
  return (
    `<img src="${token.href}" alt="${token.text}"` +
    (token.title ? ` title="${token.title}"` : '') +
    ` class="md-img">`
  );
}

function normalizeHeadingText(rawText: string) {
  const html = marked.parseInline(rawText) as string;
  const text = html.replace(/<[^>]*>/g, '');
  return text.trim().replace(/\s+/g, ' ');
}

function createHeadingId(rawText: string) {
  return normalizeHeadingText(rawText).replace(/\s+/g, '-');
}

export default function useMdParser() {
  return {
    parse: (content: string) => marked.parse(content) as string,
    extractHeadings: (content: string) => {
      const tokens = marked.lexer(content);
      return tokens
        .filter((token) => token.type === 'heading' && token.depth >= 1 && token.depth <= 3)
        .map((token) => {
          const { depth, text } = token as Tokens.Heading;
          return {
            depth,
            text: normalizeHeadingText(text),
            id: createHeadingId(text),
          };
        });
    },
  };
}
