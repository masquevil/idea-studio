import {} from 'marked';

// marked 的 Tokens 是 namespace，模块增强必须用 namespace 语法（no-namespace 的合法例外）
/* eslint-disable @typescript-eslint/no-namespace */
// 扩展 Tokens 命名空间，添加自定义 token 类型
declare module 'marked' {
  namespace Tokens {
    interface ValidityTag {
      type: 'validity-tag';
      raw: string;
      year: string;
      month: string;
    }

    interface ClassView {
      type: 'class-view';
      raw: string;
      className: string;
      content: string;
    }

    interface Alert {
      type: 'alert';
      raw: string;
      title: string;
      body: string;
      variant?: string;
    }

    interface Meta {
      type: 'meta';
      raw: string;
      data: Record<string, string>;
    }
  }
}
