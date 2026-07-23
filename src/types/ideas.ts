export interface HomeIdea {
  /** 唯一标识，对应 ideas 目录下的子目录名 */
  id: string;
  /** 显示名称 */
  name: string;
  /** 所属分类标识 */
  category: string;
  /** 简短描述 */
  description: string;
  /** 设计状态，用英文标识，通过 statusText 获取中文显示 */
  status: string;
}
