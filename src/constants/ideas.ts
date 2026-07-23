import type { HomeIdea } from '@/types/ideas';

export const statusText: Record<string, string> = {
  drafting: '草稿',
  designing: '设计中',
  testing: '测试中',
  completed: '已完成',
};

// 分类定义：分类标识 -> 中文名
export const categoryLabels: Record<string, string> = {
  boardgame: '桌游',
  trip: '旅行',
  test: '测试',
};

const _homeIdeasPublic: HomeIdea[] = [
  {
    id: '罪恶都市',
    name: '罪恶都市',
    category: 'boardgame',
    description: '任何人数都可以开玩的非对称桌游',
    status: 'drafting',
  },
  {
    id: '2026新疆攻略',
    name: '2026新疆攻略',
    category: 'trip',
    description: '2026新疆攻略',
    status: 'drafting',
  },
  {
    id: '国家宝藏',
    name: '国家宝藏',
    category: 'boardgame',
    description: '一款以文物收藏为主题的策略桌游，玩家扮演不同国家英雄收集宝藏。',
    status: 'drafting',
  },
];

const _homeIdeasPrivate: HomeIdea[] = [
  {
    id: '测试1',
    name: '测试1',
    category: 'test',
    description: '测试',
    status: 'drafting',
  },
  {
    id: '测试2',
    name: '测试2',
    category: 'test',
    description: '测试样式用的：一款以文物收藏为主题的策略桌游，玩家扮演不同国家英雄收集宝藏。',
    status: 'designing',
  },
  {
    id: '测试3',
    name: '测试3',
    category: 'test',
    description: '测试',
    status: 'testing',
  },
  {
    id: '测试4',
    name: '测试4',
    category: 'test',
    description: '测试',
    status: 'completed',
  },
];

export const homeIdeas: HomeIdea[] = [
  ..._homeIdeasPublic,
  ...(import.meta.env.DEV ? _homeIdeasPrivate : []),
];
