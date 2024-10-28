import { Button } from "@/components/ui/button"
import { Home, Settings } from "lucide-react"
import Link from 'next/link'

export default function Navbar() {
  return (
    <nav className="bg-card rounded-full shadow-lg p-2 flex justify-around">
      <Link href="/">
        <Button variant="ghost" size="icon" className="rounded-full">
          <Home className="h-6 w-6" />
        </Button>
      </Link>
      <Link href="/settings">
        <Button variant="ghost" size="icon" className="rounded-full">
          <Settings className="h-6 w-6" />
        </Button>
      </Link>
    </nav>
  )
}
