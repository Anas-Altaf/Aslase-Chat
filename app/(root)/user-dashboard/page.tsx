'use client';

export default function DashboardWelcome() {
  return (
    <div className="flex flex-col items-center justify-center h-full text-center">
      <h1 className="text-3xl font-bold text-gray-900 mb-4">
        Welcome to AslasChat Dashboard
      </h1>
      <p className="text-gray-600 text-lg max-w-md">
        Select a chatbot from the sidebar or choose an option from the menu to get started.
      </p>
    </div>
  );
}
