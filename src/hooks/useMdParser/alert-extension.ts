import type { Marked, RendererThis, Tokens } from 'marked';
import './types';

export default function createAlertExtension(marked: Marked) {
  return {
    extensions: [
      {
        name: 'alert',
        level: 'block' as const,
        start(src: string) {
          return src.match(/^!!!/)?.index;
        },
        tokenizer(src: string) {
          const rule =
            /^!!![ \t]*(?:(?:([A-Za-z][A-Za-z0-9_-]*)[ \t]*:[ \t]*([^\n]*?))|([^\n]*?))[ \t]*\n([\s\S]*?)\n!!!/;
          const match = rule.exec(src);

          if (match) {
            const [raw, variant, titleWithVariant, titleWithoutVariant, body] = match;
            return {
              type: 'alert',
              raw,
              title: (variant ? titleWithVariant : titleWithoutVariant)?.trim() || '',
              body: body.trim(),
              variant: variant || '',
            };
          }
        },
        renderer(this: RendererThis, token: Tokens.Alert) {
          const titleHTML = token.title ? `<div class="md-alert-title">${token.title}</div>` : '';
          const variantClass = token.variant ? ` md-alert-${token.variant}` : ' md-alert-default';
          const contentHTML = marked.parse(token.body) as string;
          return `<div class="md-alert${variantClass}">${titleHTML}<div class="md-alert-content">${contentHTML}</div></div>`;
        },
      },
    ],
  };
}
