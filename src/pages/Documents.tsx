import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Upload, 
  Download, 
  Trash2, 
  FileText
} from 'lucide-react';
import type { Document } from '../types';
import { 
  PageHeader, 
  Card, 
  Button, 
  SearchInput, 
  StatusBadge, 
  EmptyState,
  LoadingPage
} from '../components/ui';
import { useAsyncData, useSearch } from '../hooks';
import { mockDocuments } from '../data';

export default function Documents() {
  const navigate = useNavigate();
  const [filterType, setFilterType] = useState<'all' | 'faq' | 'guide'>('all');
  
  const { data: documents = [], loading } = useAsyncData<Document[]>(() => mockDocuments);

  const { searchTerm, setSearchTerm, filteredItems } = useSearch(
    documents,
    ['documentName']
  );

  const filteredDocuments = filteredItems.filter(doc => 
    filterType === 'all' || doc.type === filterType
  );

  const handleDelete = (docsId: string) => {
    if (confirm('정말로 이 문서를 삭제하시겠습니까?')) {
      // 실제로는 API 호출
      console.log('Delete document:', docsId);
    }
  };

  const handleDownload = (document: Document) => {
    // 실제로는 API를 통해 파일을 다운로드
    console.log('Downloading:', document.documentName);
  };

  const getTypeVariant = (type: string) => {
    switch (type) {
      case 'faq':
        return 'info';
      case 'guide':
        return 'success';
      default:
        return 'default';
    }
  };

  const getTypeText = (type: string) => {
    switch (type) {
      case 'faq':
        return 'FAQ';
      case 'guide':
        return '가이드';
      default:
        return '알 수 없음';
    }
  };

  if (loading) {
    return <LoadingPage />;
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="문서 관리"
        description="FAQ와 가이드 문서를 관리하세요."
      >
        <Button onClick={() => navigate('/admin/documents/upload')}>
          <Upload className="h-4 w-4 mr-2" />
          문서 업로드
        </Button>
      </PageHeader>

      {/* 검색 및 필터 */}
      <div className="flex space-x-4">
        <div className="flex-1">
          <SearchInput
            placeholder="문서 검색..."
            value={searchTerm}
            onChange={setSearchTerm}
          />
        </div>
        <div className="flex space-x-2">
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value as 'all' | 'faq' | 'guide')}
            className="input"
          >
            <option value="all">모든 타입</option>
            <option value="faq">FAQ</option>
            <option value="guide">가이드</option>
          </select>
        </div>
      </div>

      {/* 문서 목록 */}
      <div className="grid grid-cols-1 gap-4">
        {filteredDocuments.map((document) => (
          <Card key={document.docsId}>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                    <FileText className="h-6 w-6 text-gray-600" />
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-lg font-medium text-gray-900">
                    {document.documentName}
                  </h3>
                  <p className="text-sm text-gray-500">
                    서비스 ID: {document.serviceId}
                  </p>
                  <div className="mt-2 flex items-center space-x-4">
                    <StatusBadge
                      status={getTypeText(document.type)}
                      variant={getTypeVariant(document.type)}
                    />
                    <span className="text-xs text-gray-500">
                      경로: {document.documentPath}
                    </span>
                  </div>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleDownload(document)}
                >
                  <Download className="h-4 w-4 mr-1" />
                  다운로드
                </Button>
                <Button
                  variant="danger"
                  size="sm"
                  onClick={() => handleDelete(document.docsId)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {filteredDocuments.length === 0 && (
        <EmptyState
          icon={FileText}
          title="문서가 없습니다"
          description="새로운 문서를 업로드해보세요."
          actionLabel="문서 업로드"
          onAction={() => navigate('/admin/documents/upload')}
        />
      )}
    </div>
  );
}