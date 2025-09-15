import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Save } from 'lucide-react';
import { PageHeader, Card, Button } from '../components/ui';
import type { User } from '../types';
import { mockUsers } from '../data';

export default function UserEdit() {
  const navigate = useNavigate();
  const { userId } = useParams<{ userId: string }>();
  
  const [user, setUser] = useState<User | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    role: 'user',
  });

  useEffect(() => {
    // 사용자 찾기
    const foundUser = mockUsers.find(u => u.memberId === userId);
    
    if (foundUser) {
      setUser(foundUser);
      setFormData({
        name: foundUser.name,
        role: foundUser.role,
      });
    }
  }, [userId]);

  const handleSave = () => {
    if (!user) return;
    
    // 실제로는 API 호출
    console.log('Updating user:', {
      ...user,
      ...formData,
    });
    
    // 목록 페이지로 돌아가기
    navigate('/admin/users');
  };

  if (!user) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <h3 className="text-lg font-medium text-gray-900">사용자를 찾을 수 없습니다</h3>
          <p className="text-gray-500 mt-2">요청하신 사용자가 존재하지 않습니다.</p>
          <Button 
            className="mt-4" 
            onClick={() => navigate('/admin/users')}
          >
            목록으로 돌아가기
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title={`${user.name} 수정`}
        description="사용자 정보를 수정하세요."
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
              <label className="block text-sm font-medium text-gray-700 mb-2">사용자 ID</label>
              <input
                type="text"
                className="input bg-gray-100"
                value={user.memberId}
                disabled
              />
            </div>
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
            저장
          </Button>
        </div>
      </div>
    </div>
  );
}
