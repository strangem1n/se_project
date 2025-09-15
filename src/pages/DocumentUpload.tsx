import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Upload, FileText } from 'lucide-react';
import { PageHeader, Card, Button, Input } from '../components/ui';

export default function DocumentUpload() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    serviceId: '',
    type: 'faq',
    documentName: '',
  });
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const handleSave = () => {
    if (!selectedFile) {
      alert('파일을 선택해주세요.');
      return;
    }

    // 실제로는 API 호출
    console.log('Uploading document:', {
      ...formData,
      file: selectedFile,
    });
    
    // 목록 페이지로 돌아가기
    navigate('/admin/documents');
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setFormData(prev => ({
        ...prev,
        documentName: file.name,
      }));
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="문서 업로드"
        description="새로운 문서를 업로드하세요."
      >
        <Button variant="outline" onClick={() => navigate('/admin/documents')}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          목록으로
        </Button>
      </PageHeader>

      <div className="max-w-2xl">
        <Card>
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">서비스 ID</label>
              <input
                type="text"
                className="input"
                value={formData.serviceId}
                onChange={(e) => setFormData(prev => ({ ...prev, serviceId: e.target.value }))}
                placeholder="서비스 ID를 입력하세요"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">문서 타입</label>
              <select
                className="input"
                value={formData.type}
                onChange={(e) => setFormData(prev => ({ ...prev, type: e.target.value }))}
              >
                <option value="faq">FAQ</option>
                <option value="guide">가이드</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">문서 이름</label>
              <input
                type="text"
                className="input"
                value={formData.documentName}
                onChange={(e) => setFormData(prev => ({ ...prev, documentName: e.target.value }))}
                placeholder="문서 이름을 입력하세요"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">파일</label>
              <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md hover:border-gray-400 transition-colors">
                <div className="space-y-1 text-center">
                  <Upload className="mx-auto h-12 w-12 text-gray-400" />
                  <div className="flex text-sm text-gray-600">
                    <label className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-blue-500">
                      <span>파일 선택</span>
                      <input 
                        type="file" 
                        className="sr-only" 
                        accept=".pdf,.doc,.docx"
                        onChange={handleFileChange}
                      />
                    </label>
                    <p className="pl-1">또는 드래그 앤 드롭</p>
                  </div>
                  <p className="text-xs text-gray-500">PDF, DOC, DOCX 파일 지원</p>
                  {selectedFile && (
                    <div className="mt-2 flex items-center justify-center text-sm text-green-600">
                      <FileText className="h-4 w-4 mr-1" />
                      {selectedFile.name}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </Card>

        {/* 하단 버튼 */}
        <div className="flex justify-end space-x-3 mt-6">
          <Button variant="outline" onClick={() => navigate('/admin/documents')}>
            취소
          </Button>
          <Button onClick={handleSave}>
            <Upload className="h-4 w-4 mr-2" />
            업로드
          </Button>
        </div>
      </div>
    </div>
  );
}
