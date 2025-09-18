import React from 'react';
import { Button } from './ui';

interface ToolApprovalProps {
  toolName?: string;
  onApprove: () => void;
  onReject: () => void;
}

export default function ToolApproval({
  toolName,
  onApprove,
  onReject
}: ToolApprovalProps) {
  return (
    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
      <div className="mb-4">
        <h4 className="text-lg font-medium text-gray-900">
          {toolName ? `${toolName} 도구 실행` : '도구 실행'}
        </h4>
        <p className="text-sm text-gray-600 mt-1">
          이 도구를 실행하시겠습니까?
        </p>
      </div>

      <div className="flex justify-end space-x-3">
        <Button
          variant="outline"
          onClick={onReject}
        >
          취소
        </Button>
        <Button
          onClick={onApprove}
        >
          승인
        </Button>
      </div>
    </div>
  );
}
