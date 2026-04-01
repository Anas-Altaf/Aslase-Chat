import ChatWidget from '@/components/chatbot-public/chat-widget';

export default async function IframeChatbotPage({
  params,
}: {
  params: Promise<{ chatbotId: string }>;
}) {
  const { chatbotId } = await params;
  return <ChatWidget chatbotId={chatbotId} iframe />;
}
