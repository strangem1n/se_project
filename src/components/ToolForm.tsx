import React from 'react';
import { Button } from './ui';
import type { ToolFormSchema } from '../types';

interface ToolFormProps {
  schema: ToolFormSchema;
  currentValues: Record<string, any>;
  onSubmit: (values: Record<string, any>) => void;
  onCancel: () => void;
  toolName?: string;
}

export default function ToolForm({
  schema,
  currentValues,
  onSubmit,
  onCancel,
  toolName
}: ToolFormProps) {
  const [formValues, setFormValues] = React.useState<Record<string, any>>(currentValues);

  const handleInputChange = (fieldName: string, value: any) => {
    setFormValues(prev => ({
      ...prev,
      [fieldName]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formValues);
  };

  const renderField = (fieldName: string, fieldSchema: any) => {
    const isRequired = schema.required?.includes(fieldName);
    const value = formValues[fieldName] ?? fieldSchema.default ?? '';

    switch (fieldSchema.type) {
      case 'string':
        if (fieldSchema.enum) {
          return (
            <select
              value={value}
              onChange={(e) => handleInputChange(fieldName, e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required={isRequired}
            >
              <option value="">선택하세요</option>
              {fieldSchema.enum.map((option: string) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          );
        }
        return (
          <input
            type="text"
            value={value}
            onChange={(e) => handleInputChange(fieldName, e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder={fieldSchema.description || fieldName}
            required={isRequired}
          />
        );

      case 'number':
        return (
          <input
            type="number"
            value={value}
            onChange={(e) => handleInputChange(fieldName, parseFloat(e.target.value) || 0)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder={fieldSchema.description || fieldName}
            required={isRequired}
          />
        );

      case 'boolean':
        return (
          <div className="flex items-center">
            <input
              type="checkbox"
              checked={value}
              onChange={(e) => handleInputChange(fieldName, e.target.checked)}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label className="ml-2 text-sm text-gray-700">
              {fieldSchema.description || fieldName}
            </label>
          </div>
        );

      case 'array':
        return (
          <textarea
            value={Array.isArray(value) ? value.join('\n') : value}
            onChange={(e) => handleInputChange(fieldName, e.target.value.split('\n').filter(item => item.trim()))}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder={fieldSchema.description || `${fieldName} (한 줄에 하나씩 입력)`}
            rows={3}
            required={isRequired}
          />
        );

      default:
        return (
          <textarea
            value={value}
            onChange={(e) => handleInputChange(fieldName, e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder={fieldSchema.description || fieldName}
            rows={3}
            required={isRequired}
          />
        );
    }
  };

  return (
    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
      <div className="mb-4">
        <h4 className="text-lg font-medium text-gray-900">
          {toolName ? `${toolName} 도구 설정` : '도구 설정'}
        </h4>
        <p className="text-sm text-gray-600 mt-1">
          필요한 파라미터를 입력해주세요.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {Object.entries(schema.properties).map(([fieldName, fieldSchema]) => (
          <div key={fieldName}>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {fieldSchema.description || fieldName}
              {schema.required?.includes(fieldName) && (
                <span className="text-red-500 ml-1">*</span>
              )}
            </label>
            {renderField(fieldName, fieldSchema)}
          </div>
        ))}

        <div className="flex justify-end space-x-3 pt-4">
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
          >
            취소
          </Button>
          <Button type="submit">
            실행
          </Button>
        </div>
      </form>
    </div>
  );
}
