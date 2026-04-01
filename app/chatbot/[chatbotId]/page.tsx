import ChatWidget from '@/components/chatbot-public/chat-widget';

export default async function PublicChatbotPage({
  params,
}: {
  params: Promise<{ chatbotId: string }>;
}) {
  const { chatbotId } = await params;
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-emerald-50 flex items-center justify-center p-4">
      <div className="w-full max-w-lg">
        <ChatWidget chatbotId={chatbotId} />
      </div>
    </div>
  );
}
