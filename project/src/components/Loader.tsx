import { Loader2 } from 'lucide-react'

export default function Loader({ label = 'Chargement...' }: { label?: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-gray-500">
      <Loader2 className="h-8 w-8 animate-spin text-primary-700" />
      <p className="mt-3 text-sm">{label}</p>
    </div>
  )
}
