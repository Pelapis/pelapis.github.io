import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-4 px-4">
      <h1 className="text-6xl font-bold text-gray-800">404</h1>
      <p className="text-gray-600">页面不存在</p>
      <Link
        href="/"
        className="text-primary font-medium hover:underline"
      >
        返回首页
      </Link>
    </div>
  );
}
