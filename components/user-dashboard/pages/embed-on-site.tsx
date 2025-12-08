'use client';

export default function EmbedOnSite() {
  const iframeCode = `<iframe src="https://stag-app.aslaschat.ai/chatbot/iframe/VUyBtr3F23QcD2fF" width="100%" style="height: 100%; min-height: 700px" frameborder="0"></iframe>`;
  const scriptCode = `<script> window.embeddedChatbotConfig = { chatbotId: "VUyBtr3F23QcD2fF", domain: "www.ASLASChat.ai" } </script>`;

  return (
    <div className="flex flex-col h-full overflow-hidden">
      <h1 className="text-xl font-bold text-gray-900 mb-2 flex-shrink-0">Embed on Site</h1>

      <div className="flex-1 overflow-y-auto space-y-2">
        <div>
          <p className="text-gray-700 text-xs mb-1">To add the chatbot anywhere on your website, add this frame to your html code.</p>
          <div className="bg-gray-50 border border-gray-300 rounded p-1 flex items-start gap-1">
            <code className="text-gray-900 text-xs flex-1 break-all font-mono line-clamp-2">{iframeCode}</code>
            <button className="bg-green-100 text-green-700 px-2 py-0.5 rounded text-xs font-medium flex-shrink-0">Copy</button>
          </div>
        </div>

        <div>
          <p className="text-gray-700 text-xs mb-1">To add a chat bubble in the bottom right of your website add this script tag to your html</p>
          <div className="bg-gray-50 border border-gray-300 rounded p-1 flex items-start gap-1">
            <code className="text-gray-900 text-xs flex-1 break-all font-mono line-clamp-2">{scriptCode}</code>
            <button className="bg-green-100 text-green-700 px-2 py-0.5 rounded text-xs font-medium flex-shrink-0">Copy</button>
          </div>
        </div>
      </div>
    </div>
  );
}
