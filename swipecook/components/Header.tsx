import { Link } from "lucide-react";
import { Button } from "./ui/button";
import {LogIn} from "lucide-react"

export default function Header() {
    return(
        <header className="flex items-center justify-between p-4">
            <h1 className="text-2xl font-bold">Swipe&Cook</h1>
            <Link href="/login">
                <Button variant="ghost" size="icon" className="rounded-full">
                    <LogIn className="h-6 w-6"/>
                </Button>
            </Link>
      </header>
    )
}