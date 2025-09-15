import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Save } from 'lucide-react';
import { PageHeader, Card, Button } from '../components/ui';

export default function UserCreate() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    role: 'user',
  });

  const handleSave = () => {
    // 실제로는 API 호출
    console.log('Creating user:', formData);
    
    // 목록 페이지로 돌아가기
    navigate('/admin/users');
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="새 사용자 생성"
        description="새로운 사용자를 생성하세요."
      >
        <Button variant="outline" onClick={() => navigate('/admin/users')}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          목록으로
        </Button>
      </PageHeader>

      <div className="max-w-md">
        <Card>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">이름</label>
              <input
                type="text"
                className="input"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                placeholder="사용자 이름을 입력하세요"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">권한</label>
              <select
                className="input"
                value={formData.role}
                onChange={(e) => setFormData(prev => ({ ...prev, role: e.target.value }))}
              >
                <option value="user">사용자</option>
                <option value="manager">매니저</option>
                <option value="admin">관리자</option>
              </select>
            </div>
          </div>
        </Card>

        {/* 하단 버튼 */}
        <div className="flex justify-end space-x-3 mt-6">
          <Button variant="outline" onClick={() => navigate('/admin/users')}>
            취소
          </Button>
          <Button onClick={handleSave}>
            <Save className="h-4 w-4 mr-2" />
            생성
          </Button>
        </div>
      </div>
    </div>
  );
}
