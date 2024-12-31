import { Search, Menu } from "lucide-react"
import { Button } from "../components/ui/button"
import { Input } from "../components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select"
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { useEffect, useRef } from "react";

export default function AppBar() {
  const tokenRef = useRef<string | null>(null);

  useEffect(() => {
    tokenRef.current = localStorage.getItem('_token_');
  }, []);
  return (
    <header className="flex items-center justify-between px-16 py-3 w-full overflow-hidden bg-white border-b sticky top-0 z-50">
      <div className="flex items-center space-x-4">
        <h1 className="text-2xl font-bold text-black">StealShow</h1>
        <div className="relative w-[600px]">
          <Search className="absolute left-2 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
          <Input
            className="w-full pl-8 pr-4 py-2 rounded-md border border-gray-300"
            placeholder="Search for Movies, Events, Plays, Sports and Activities"
          />
        </div>
      </div>
      <div className="flex items-center space-x-4">
        <Select>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Kanpur" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="hindi-2d">Chennai</SelectItem>
            <SelectItem value="hindi-2d">Banglore</SelectItem>
            <SelectItem value="hindi-2d">Lucknow</SelectItem>
            <SelectItem value="hindi-2d">Delhi</SelectItem>
            <SelectItem value="hindi-2d">Mumbai</SelectItem>
          </SelectContent>
        </Select>
        {tokenRef ? (
          <Avatar className="w-10 h-10 rounded-full mx-auto object-fill">
            <AvatarImage src="" />
            <AvatarFallback>XY</AvatarFallback>
          </Avatar>
        ) : (
          <Button className="bg-black text-white hover:bg-black/70">
            Sign in
          </Button>
        )}
        <Button variant="ghost" size="icon" className="lg:hidden">
          <Menu className="h-6 w-6" />
          <span className="sr-only">Open menu</span>
        </Button>
      </div>
    </header>
  );
}