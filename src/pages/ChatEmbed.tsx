import { useParams } from 'react-router-dom';
import ChatModule from '../components/ChatModule';

export default function ChatEmbed() {
  const { serviceId } = useParams<{ serviceId: string }>();

  if (!serviceId) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <h3 className="text-lg font-medium text-gray-900">서비스를 찾을 수 없습니다</h3>
          <p className="text-gray-500 mt-2">유효하지 않은 서비스 ID입니다.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen w-full">
      <ChatModule 
        serviceId={serviceId} 
        isEmbedded={true}
        className="h-full"
      />
    </div>
  );
}
