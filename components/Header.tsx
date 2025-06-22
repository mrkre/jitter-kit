'use client'

export default function Header() {
  return (
    <header className="sticky top-0 z-10 border-b border-gray-200/50 bg-white/70 backdrop-blur-sm">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center">
            <h1 className="bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text text-xl font-bold text-transparent">
              Jitter Kit
            </h1>
          </div>
          {/* Add other header items here, like a user menu */}
        </div>
      </div>
    </header>
  )
}
