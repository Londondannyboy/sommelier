export default function Loading() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-cream">
      <div className="text-center">
        <div className="w-12 h-12 border-4 border-wine-200 border-t-wine-700 rounded-full animate-spin mx-auto mb-4" />
        <p className="text-wine-600">Loading...</p>
      </div>
    </div>
  )
}
