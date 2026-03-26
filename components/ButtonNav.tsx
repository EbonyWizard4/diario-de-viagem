import { Home, Search, PlusSquare, Map, User } from 'lucide-react'; // Instale: npm install lucide-react

export default function BottomNav() {
  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-6 py-3 flex justify-between items-center z-50">
      <Home className="text-gray-400 w-6 h-6" />
      <Search className="text-orange-600 w-6 h-6" />
      <div className="bg-orange-600 p-2 rounded-full -mt-8 shadow-lg border-4 border-white">
        <PlusSquare className="text-white w-6 h-6" />
      </div>
      <Map className="text-gray-400 w-6 h-6" />
      <User className="text-gray-400 w-6 h-6" />
    </nav>
  );
}