// interface Feature {
//   title: string;
//   description: string;
//   icon: string;
// }

// const features: Feature[] = [
//   {
//     title: 'Real-time Messaging',
//     description: 'Experience instant communication with low-latency message delivery.',
//     icon: '💬',
//   },
//   {
//     title: 'Secure & Private',
//     description: 'End-to-end encryption ensures your conversations stay private.',
//     icon: '🔒',
//   },
//   {
//     title: 'Cross-Platform',
//     description: 'Access your chats seamlessly across all your devices.',
//     icon: '📱',
//   },
//   {
//     title: 'Modern UI',
//     description: 'Beautiful, intuitive interface built with the latest technologies.',
//     icon: '✨',
//   },
//   {
//     title: 'Group Chats',
//     description: 'Create groups and collaborate with multiple people at once.',
//     icon: '👥',
//   },
//   {
//     title: 'File Sharing',
//     description: 'Share documents, images, and files with ease.',
//     icon: '📎',
//   },
// ];

// export default function Features() {
//   return (
//     <section id="features" className="py-20 px-4 sm:px-6 lg:px-8 bg-zinc-50 dark:bg-zinc-900/50">
//       <div className="max-w-7xl mx-auto">
//         <div className="text-center mb-16">
//           <h2 className="text-4xl font-bold text-zinc-900 dark:text-zinc-100">
//             Powerful Features
//           </h2>
//           <p className="mt-4 text-lg text-zinc-600 dark:text-zinc-400 max-w-2xl mx-auto">
//             Everything you need for seamless communication, all in one place.
//           </p>
//         </div>

//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
//           {features.map((feature) => (
//             <div
//               key={feature.title}
//               className="p-6 bg-white dark:bg-zinc-800 rounded-xl border border-zinc-200 dark:border-zinc-700 hover:border-zinc-300 dark:hover:border-zinc-600 transition-all hover:shadow-lg"
//             >
//               <div className="text-4xl mb-4">{feature.icon}</div>
//               <h3 className="text-xl font-semibold text-zinc-900 dark:text-zinc-100 mb-2">
//                 {feature.title}
//               </h3>
//               <p className="text-zinc-600 dark:text-zinc-400">
//                 {feature.description}
//               </p>
//             </div>
//           ))}
//         </div>
//       </div>
//     </section>
//   );
// }
