export function FooterBar() {
  return (
    <footer className="bg-white border-t border-gray-200 py-4 mt-auto">
      <div className="max-w-4xl mx-auto px-4 text-center">
        <p className="text-sm text-gray-500">
          Made by <strong className="text-gray-700">Cavendish</strong>. The source code is on{' '}
          <a
            href="https://github.com/Pelapis/invest-simulation"
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 hover:text-blue-800 underline"
          >
            GitHub
          </a>
          .
        </p>
      </div>
    </footer>
  )
}
