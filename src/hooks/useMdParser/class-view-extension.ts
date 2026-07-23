import type { Marked, RendererThis, Tokens } from 'marked';
import './types';

export default function createClassViewExtension(marked: Marked) {
  return {
    extensions: [
      {
        name: 'class-view',
        level: 'block' as const,
        start(src: string) {
          return src.match(/~~~class-view:[^\n]+/)?.index;
        },
        tokenizer(src: string) {
          const rule = /^~~~class-view:([^\n]+)\n([\s\S]*?)\n~~~/;
          const match = rule.exec(src);

          if (match) {
            const [raw, className, content] = match;
            return {
              type: 'class-view',
              raw,
              className: className.trim(),
              content: content.trim(),
            };
          }
        },
        renderer(this: RendererThis, token: Tokens.ClassView) {
          const { className, content } = token;
          const parsedContent = marked.parse(content) as string;
          return `<div class="${className}">${parsedContent}</div>`;
        },
      },
    ],
  };
}
