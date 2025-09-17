import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { Button } from './ui';
import type { User } from '../types';

interface UserModalProps {
  isOpen: boolean;
  user: User | null;
  onClose: () => void;
  onSave: (user: User) => void;
}

export default function UserModal({
  isOpen,
  user,
  onClose,
  onSave
}: UserModalProps) {
  const [formData, setFormData] = useState({
    memberId: '',
    name: '',
    role: 'user'
  });

  useEffect(() => {
    if (user) {
      setFormData({
        memberId: user.memberId,
        name: user.name,
        role: user.role
      });
    } else {
      setFormData({
        memberId: '',
        name: '',
        role: 'user'
      });
    }
  }, [user]);

  const handleSave = () => {
    if (!formData.memberId.trim()) {
      alert('사용자 ID를 입력해주세요.');
      return;
    }

    if (!formData.name.trim()) {
      alert('사용자 이름을 입력해주세요.');
      return;
    }

    const updatedUser: User = {
      memberId: formData.memberId,
      name: formData.name,
      role: formData.role
    };

    onSave(updatedUser);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-screen items-center justify-center p-4">
        <div className="fixed inset-0 backdrop-blur-sm" onClick={onClose} />
        
        <div className="relative bg-white rounded-lg shadow-xl max-w-md w-full">
          {/* 헤더 */}
          <div className="flex items-center justify-between p-6 border-b">
            <h2 className="text-xl font-semibold text-gray-900">
              {user ? '사용자 수정' : '사용자 생성'}
            </h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600"
            >
              <X className="h-6 w-6" />
            </button>
          </div>

          {/* 내용 */}
          <div className="p-6 space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                사용자 ID *
              </label>
              <input
                type="text"
                value={formData.memberId}
                onChange={(e) => setFormData(prev => ({ ...prev, memberId: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="사용자 ID를 입력하세요"
                disabled={!!user} // 수정 시에는 ID 변경 불가
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                사용자 이름 *
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="사용자 이름을 입력하세요"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                역할
              </label>
              <select
                value={formData.role}
                onChange={(e) => setFormData(prev => ({ ...prev, role: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="user">사용자</option>
                <option value="admin">관리자</option>
                <option value="moderator">모더레이터</option>
              </select>
            </div>
          </div>

          {/* 푸터 */}
          <div className="flex justify-end space-x-3 p-6 border-t bg-gray-50">
            <Button variant="outline" onClick={onClose}>
              취소
            </Button>
            <Button onClick={handleSave}>
              {user ? '수정' : '생성'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
