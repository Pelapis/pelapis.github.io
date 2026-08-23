import Link from "next/link"
import { projects } from "@/lib/projects"

export default function HomePage() {
  return (
    <div className="flex flex-col gap-4">
      <section className="text-center py-6">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-3">
          欢迎来到我的个人博客
        </h1>
        <p className="text-[1.1rem] text-gray-600">
          这里展示了我的项目和游戏作品
        </p>
      </section>

      <section className="pt-4">
        <div className="grid grid-cols-[repeat(auto-fill,minmax(260px,1fr))] gap-5">
          {projects.map((project) => (
            <article
              key={project.id}
              className="bg-white rounded-xl p-5 shadow-[0_2px_8px_rgba(0,0,0,0.08)] transition-all duration-200 hover:-translate-y-1 hover:shadow-[0_4px_12px_rgba(0,0,0,0.12)]"
            >
              <div className="text-[2.25rem] mb-3">
                {project.type === "game" && "🎮"}
                {project.type === "tool" && "🛠️"}
                {project.type === "other" && "📦"}
              </div>
              <h3 className="text-[1.1rem] font-bold text-gray-800 mb-2">
                {project.title}
              </h3>
              <p className="text-gray-600 mb-3 text-[0.95rem]">
                {project.description}
              </p>
              <Link
                href={`/${project.id}`}
                className="text-primary font-medium text-[0.95rem] hover:underline"
              >
                立即体验 →
              </Link>
            </article>
          ))}
        </div>
      </section>
    </div>
  )
}
