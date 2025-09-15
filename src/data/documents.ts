import type { Document } from '../types';

export const mockDocuments: Document[] = [
  {
    docsId: '1',
    serviceId: 'service-1',
    documentName: '고객 서비스 FAQ',
    type: 'faq',
    documentPath: '/docs/faq/customer-service.pdf',
  },
  {
    docsId: '2',
    serviceId: 'service-1',
    documentName: '제품 사용 가이드',
    type: 'guide',
    documentPath: '/docs/guide/product-usage.pdf',
  },
  {
    docsId: '3',
    serviceId: 'service-2',
    documentName: '기술 지원 FAQ',
    type: 'faq',
    documentPath: '/docs/faq/tech-support.pdf',
  },
  {
    docsId: '4',
    serviceId: 'service-2',
    documentName: 'API 문서',
    type: 'guide',
    documentPath: '/docs/guide/api-documentation.pdf',
  },
  {
    docsId: '5',
    serviceId: 'service-3',
    documentName: '영업 프로세스 가이드',
    type: 'guide',
    documentPath: '/docs/guide/sales-process.pdf',
  },
];
