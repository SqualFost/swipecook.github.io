import { Button } from "@/components/ui/button"
import { Home, Search, User, Heart } from "lucide-react"
import Link from 'next/link'

export default function Navbar() {
  return (
    <div className="fixed bottom-0 left-0 right-0 pb-4 pt-10 bg-gradient-to-t from-background via-background to-transparent">
        <nav className="bg-card rounded-full shadow-lg">
          <div className="flex justify-around p-2">
            <Link href="/">
              <Button variant="ghost" size="icon" className="rounded-full">
                <Home className="h-6 w-6" />
              </Button>
            </Link>
            <Link href="/search">
              <Button variant="ghost" size="icon" className="rounded-full">
                <Search className="h-6 w-6" />
              </Button>
            </Link>
            <Link href="/likes">
              <Button variant="ghost" size="icon" className="rounded-full">
                <Heart className="h-6 w-6"/>
              </Button>
            </Link>
            <Link href="/settings">
              <Button variant="ghost" size="icon" className="rounded-full">
                <User className="h-6 w-6" />
              </Button>
            </Link>
          </div>
        </nav>
      </div>
  )
}
