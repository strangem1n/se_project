import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Plus, 
  Edit, 
  Trash2, 
  Users as UsersIcon,
  Shield,
  UserCheck,
  UserX
} from 'lucide-react';
import type { User } from '../types';
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
import { mockUsers } from '../data';

export default function Users() {
  const navigate = useNavigate();
  const { data: users = [], loading } = useAsyncData<User[]>(() => mockUsers);

  const { searchTerm, setSearchTerm, filteredItems: filteredUsers } = useSearch(
    users,
    ['name', 'role']
  );

  const handleDelete = (memberId: string) => {
    if (confirm('정말로 이 사용자를 삭제하시겠습니까?')) {
      // 실제로는 API 호출
      console.log('Delete user:', memberId);
    }
  };

  const handleEdit = (user: User) => {
    navigate(`/admin/users/edit/${user.memberId}`);
  };

  const getRoleVariant = (role: string) => {
    switch (role) {
      case 'admin':
        return 'error';
      case 'manager':
        return 'warning';
      case 'user':
        return 'success';
      default:
        return 'default';
    }
  };

  const getRoleText = (role: string) => {
    switch (role) {
      case 'admin':
        return '관리자';
      case 'manager':
        return '매니저';
      case 'user':
        return '사용자';
      default:
        return '알 수 없음';
    }
  };

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'admin':
        return Shield;
      case 'manager':
        return UserCheck;
      case 'user':
        return UserX;
      default:
        return UsersIcon;
    }
  };

  if (loading) {
    return <LoadingPage />;
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="사용자 관리"
        description="시스템 사용자와 권한을 관리하세요."
      >
        <Button onClick={() => navigate('/admin/users/create')}>
          <Plus className="h-4 w-4 mr-2" />
          새 사용자
        </Button>
      </PageHeader>

      {/* 검색 */}
      <div className="flex space-x-4">
        <div className="flex-1">
          <SearchInput
            placeholder="사용자 검색..."
            value={searchTerm}
            onChange={setSearchTerm}
          />
        </div>
      </div>

      {/* 사용자 목록 */}
      <div className="grid grid-cols-1 gap-4">
        {filteredUsers.map((user) => {
          const RoleIcon = getRoleIcon(user.role);
          return (
            <Card key={user.memberId}>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center">
                      <RoleIcon className="h-6 w-6 text-gray-600" />
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-lg font-medium text-gray-900">
                      {user.name}
                    </h3>
                    <p className="text-sm text-gray-500">
                      ID: {user.memberId}
                    </p>
                    <div className="mt-2">
                      <StatusBadge
                        status={getRoleText(user.role)}
                        variant={getRoleVariant(user.role)}
                      />
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleEdit(user)}
                  >
                    <Edit className="h-4 w-4 mr-1" />
                    편집
                  </Button>
                  <Button
                    variant="danger"
                    size="sm"
                    onClick={() => handleDelete(user.memberId)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      {filteredUsers.length === 0 && (
        <EmptyState
          icon={UsersIcon}
          title="사용자가 없습니다"
          description="새로운 사용자를 추가해보세요."
          actionLabel="새 사용자 추가"
          onAction={() => navigate('/admin/users/create')}
        />
      )}
    </div>
  );
}