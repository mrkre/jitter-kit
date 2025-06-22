'use client'

export default function Header() {
  return (
    <header className="sticky top-0 z-10 flex h-16 flex-shrink-0 items-center border-b border-gray-200/80 bg-white/95 backdrop-blur-sm">
      <div className="flex h-full w-full items-center justify-between px-4 sm:px-6 lg:px-8">
        <div className="flex flex-1 items-center">
          <h1 className="bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text text-xl font-bold text-transparent">
            Jitter Kit
          </h1>
        </div>
        {/* Add other header items here, like a user menu */}
      </div>
    </header>
  )
}
