import type { Model, Adaptor } from '../types';

export const mockModels: Model[] = [
  {
    id: '1',
    parentEmbeddingModelId: 'parent-1',
    name: 'GPT-3.5-turbo',
    path: '/models/gpt-3.5-turbo',
  },
  {
    id: '2',
    parentEmbeddingModelId: 'parent-2',
    name: 'GPT-4',
    path: '/models/gpt-4',
  },
  {
    id: '3',
    parentEmbeddingModelId: 'parent-3',
    name: 'Claude-3',
    path: '/models/claude-3',
  },
];

export const mockAdaptors: Adaptor[] = [
  {
    id: '1',
    modelId: '1',
    name: 'Customer Service Adaptor',
    path: '/adaptors/customer-service',
  },
  {
    id: '2',
    modelId: '2',
    name: 'Tech Support Adaptor',
    path: '/adaptors/tech-support',
  },
];
