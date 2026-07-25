import type { RendererThis, Tokens } from 'marked';
import './types';

function parseYamlLine(line: string): [string, string] | null {
  const match = line.match(/^([a-zA-Z_][a-zA-Z0-9_-]*)\s*:\s*(.*)$/);
  if (!match) return null;

  const [, key, rawValue] = match;
  const value = rawValue.trim();

  // Parse array: [item1, item2, item3]
  if (value.startsWith('[') && value.endsWith(']')) {
    const items = value
      .slice(1, -1)
      .split(',')
      .map((item) => item.trim())
      .filter(Boolean)
      .join(',');
    return [key, items];
  }

  return [key, value];
}

function parseYaml(yaml: string): Record<string, string> {
  const data: Record<string, string> = {};
  for (const line of yaml.split('\n')) {
    const parsed = parseYamlLine(line);
    if (parsed) {
      const [key, value] = parsed;
      data[key] = value;
    }
  }
  return data;
}

export default function createMetaExtension() {
  return {
    extensions: [
      {
        name: 'meta',
        level: 'block' as const,
        start(src: string) {
          return src.match(/^---\n/)?.index;
        },
        tokenizer(src: string) {
          const rule = /^---\n([\s\S]*?)\n---/;
          const match = rule.exec(src);

          // Only match front matter at the very beginning of the document
          if (match && match.index === 0) {
            const [raw, yaml] = match;

            // Validate: every non-empty line must match key:value format (xxx: xxx)
            const lines = yaml.split('\n');
            for (const line of lines) {
              if (line.trim() && !parseYamlLine(line)) {
                return undefined;
              }
            }

            return {
              type: 'meta',
              raw,
              data: parseYaml(yaml),
            };
          }
        },
        renderer(this: RendererThis, token: Tokens.Meta) {
          const { data } = token;
          const attrs = Object.entries(data)
            .map(([key, value]) => {
              const escapedValue = value.replace(/"/g, '&' + 'quot;');
              return `data-${key}="${escapedValue}"`;
            })
            .join(' ');
          return `<div class="md-meta" ${attrs} hidden></div>`;
        },
      },
    ],
  };
}
