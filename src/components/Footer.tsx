export default function FooterBar() {
    const currentYear = new Date().getFullYear()

    return (
        <footer className="bg-gray-100 py-8 px-4 mt-auto">
            <div className="max-w-[1200px] mx-auto text-center">
                <p className="text-gray-600 m-0">
                    &copy; {currentYear} 我的博客. All rights reserved.
                </p>
            </div>
        </footer>
    )
}
