


export default function Page() {
  return (
    <div className="min-h-screen bg-[#07090d] p-20">
      <div className="relative mx-auto h-80 w-80">
        {/* 背后的蓝紫色光 */}
        <div
          className="
            pointer-events-none
            absolute -inset-10
            rounded-[40px]
            bg-[radial-gradient(circle_at_20%_20%,rgba(56,189,248,0.8),rgba(59,130,246,0.45)_35%,rgba(99,102,241,0.25)_55%,transparent_75%)]
            blur-3xl
          "
        />

        {/* Card */}
        <div
          className="
            relative h-full w-full
            rounded-2xl
            border border-white/15
            bg-[linear-gradient(135deg,rgba(255,255,255,0.10),rgba(255,255,255,0.03))]
            p-8
            shadow-2xl
            backdrop-blur-xl
          "
        >
          <div className="text-sm text-white/70">
            Hobby
          </div>

          <div className="mt-2 text-5xl font-bold text-white">
            Free
          </div>

          <div className="mt-2 text-sm text-white/50">
            No credit card required
          </div>

          <div className="mt-6 text-sm text-white/60">
            Everything you need to start building your project
          </div>

          <button
            className="
              mt-8 w-full rounded-xl
              bg-linear-to-r from-indigo-500 to-purple-600
              py-3 text-sm font-medium text-white
            "
          >
            Start building for free
          </button>
        </div>
      </div>
    </div>
  )
}