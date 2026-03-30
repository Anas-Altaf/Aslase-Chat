import ChatWidget from '@/components/chatbot-public/chat-widget';

export default function IframeChatbotPage({
  params,
}: {
  params: { chatbotId: string };
}) {
  return <ChatWidget chatbotId={params.chatbotId} iframe />;
}
