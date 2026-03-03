export default function AboutPage() {
    return (
        <div className="max-w-[800px] mx-auto">
            <header className="text-center py-8 pb-12">
                <h1 className="text-[28px] md:text-3xl font-bold text-gray-800 mb-2">关于我</h1>
                <p className="text-gray-600">了解一下我和这个博客</p>
            </header>

            <section className="flex flex-col gap-12">
                <div className="flex gap-8 items-center flex-wrap flex-col md:flex-row text-center md:text-left">
                    <div className="w-[120px] h-[120px] bg-linear-to-br from-primary to-gray-700 rounded-full flex items-center justify-center text-4xl shrink-0 md:w-[100px] md:h-[100px]">
                        👨‍💻
                    </div>
                    <div className="flex-1 min-w-[250px]">
                        <h2 className="text-2xl font-bold text-gray-800 mb-4">你好，我是...</h2>
                        <p className="text-gray-600 leading-[1.8] mb-4">
                            这是一个展示我的项目和游戏作品的个人博客。
                            我热爱编程，喜欢开发各种有趣的应用和游戏。
                        </p>
                        <p className="text-gray-600 leading-[1.8] mb-4">
                            这个博客使用现代前端技术构建，包括 React、TypeScript、Zustand 和 Vite。
                            所有项目都采用响应式设计，支持移动端和桌面端访问。
                        </p>
                    </div>
                </div>

                <div>
                    <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">技术栈</h2>
                    <div className="flex flex-wrap justify-center gap-4">
                        {[
                            { icon: '⚡', name: 'React' },
                            { icon: '📘', name: 'TypeScript' },
                            { icon: '🗃️', name: 'Zustand' },
                            { icon: '🚀', name: 'Vite' },
                            { icon: '🎨', name: 'Tailwind CSS' },
                            { icon: '📱', name: 'PWA' },
                        ].map(tech => (
                            <div
                                key={tech.name}
                                className="flex items-center gap-2 px-5 py-3 bg-[#f8f9fa] rounded-lg transition-transform hover:-translate-y-0.5"
                            >
                                <span className="text-[1.25rem]">{tech.icon}</span>
                                <span className="font-medium text-gray-800">{tech.name}</span>
                            </div>
                        ))}
                    </div>
                </div>

                <div>
                    <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">博客特性</h2>
                    <div className="grid grid-cols-[repeat(auto-fit,minmax(200px,1fr))] gap-6">
                        {[
                            { icon: '📱', title: '移动端优先', desc: '采用响应式设计，在各种设备上都有良好的浏览体验' },
                            { icon: '⚡', title: 'PWA 支持', desc: '项目可作为独立应用安装到设备上，离线也能访问' },
                            { icon: '🎮', title: '游戏作品', desc: '包含多种有趣的小游戏，随时可以开始游玩' },
                            { icon: '🔧', title: '实用工具', desc: '提供各种实用的在线工具，方便日常工作生活' },
                        ].map(feature => (
                            <div
                                key={feature.title}
                                className="bg-white p-6 rounded-xl shadow-[0_2px_8px_rgba(0,0,0,0.08)] text-center"
                            >
                                <span className="text-[2.5rem] block mb-4">{feature.icon}</span>
                                <h3 className="text-[1.1rem] text-gray-800 mb-2">{feature.title}</h3>
                                <p className="text-gray-600 text-[0.9rem]">{feature.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="text-center p-8 bg-[#f8f9fa] rounded-xl">
                    <h2 className="text-2xl font-bold text-gray-800 mb-4">联系我</h2>
                    <p className="text-gray-600 mb-6">
                        如果你有任何问题或建议，欢迎通过以下方式联系：
                    </p>
                    <div className="flex flex-wrap justify-center gap-6">
                        <a
                            href="https://github.com"
                            target="_blank"
                            rel="noopener"
                            className="flex items-center gap-2 px-6 py-3 bg-white rounded-lg no-underline text-gray-800 font-medium transition-all hover:-translate-y-0.5 shadow-[0_2px_4px_rgba(0,0,0,0.05)] hover:shadow-[0_4px_8px_rgba(0,0,0,0.1)]"
                        >
                            <span className="text-[1.25rem]">🐙</span>
                            <span>GitHub</span>
                        </a>
                        <a
                            href="mailto:example@email.com"
                            className="flex items-center gap-2 px-6 py-3 bg-white rounded-lg no-underline text-gray-800 font-medium transition-all hover:-translate-y-0.5 shadow-[0_2px_4px_rgba(0,0,0,0.05)] hover:shadow-[0_4px_8px_rgba(0,0,0,0.1)]"
                        >
                            <span className="text-[1.25rem]">📧</span>
                            <span>Email</span>
                        </a>
                    </div>
                </div>
            </section>
        </div>
    )
}
