import Link from 'next/link'
import { ChevronLeft } from "lucide-react"

export default function Header() {
  return (
    <header className="flex items-center p-4 border-b">
      <Link href="/" className="mr-4">
        <ChevronLeft className="h-6 w-6" />
      </Link>
      <h1 className="text-2xl font-bold">Paramètres du compte</h1>
    </header>
  )
}
