import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "./ui/dropdown-menu";

export const GenderDropdown = ({ gender, setGender }: { gender: string, setGender: (gender: string) => void }) => {
  return (
    <DropdownMenu>
    <DropdownMenuTrigger asChild>
        <input 
        className="w-full border border-gray-300 rounded-xl px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm sm:text-base text-start h-[51px]" 
        value={gender} 
        placeholder="Select gender"
        readOnly
        onClick={e => {
          e.preventDefault();
          // The DropdownMenuTrigger will handle opening the menu
        }}
    />
  </DropdownMenuTrigger>
  <DropdownMenuContent>
    <DropdownMenuItem onSelect={() => setGender('Male')}>Male</DropdownMenuItem>
    <DropdownMenuItem onSelect={() => setGender('Female')}>Female</DropdownMenuItem>
    <DropdownMenuItem onSelect={() => setGender('Other')}>Other</DropdownMenuItem>
  </DropdownMenuContent>
  </DropdownMenu>
  )
}