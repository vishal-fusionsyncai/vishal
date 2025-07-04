
import React from 'react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { 
  LayoutDashboard, 
  Search, 
  ArrowUpRight, 
  Edit, 
  FileText, 
  X 
} from 'lucide-react';

interface SidebarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  isOpen: boolean;
  onClose: () => void;
}

const menuItems = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'fetch', label: 'Fetch eWay Bill', icon: Search },
  { id: 'extend', label: 'Extend Bill', icon: ArrowUpRight },
  { id: 'update', label: 'Update Bill', icon: Edit },
  { id: 'reports', label: 'Reports', icon: FileText },
];

const Sidebar = ({ activeTab, onTabChange, isOpen, onClose }: SidebarProps) => {
  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}
      
      {/* Sidebar */}
      <div className={cn(
        "fixed left-0 top-0 h-full bg-white border-r border-gray-200 shadow-lg z-50 transform transition-transform duration-300 ease-in-out",
        "lg:relative lg:translate-x-0 lg:shadow-none",
        isOpen ? "translate-x-0" : "-translate-x-full",
        "w-64"
      )}>
        <div className="flex items-center justify-between p-4 border-b border-gray-200 lg:hidden">
          <h2 className="text-lg font-semibold text-gray-900">Menu</h2>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="h-5 w-5" />
          </Button>
        </div>
        
        <nav className="p-4 space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            
            return (
              <Button
                key={item.id}
                variant={isActive ? "default" : "ghost"}
                className={cn(
                  "w-full justify-start h-12 text-left",
                  isActive 
                    ? "bg-blue-600 text-white hover:bg-blue-700" 
                    : "text-gray-700 hover:bg-gray-100"
                )}
                onClick={() => {
                  onTabChange(item.id);
                  onClose();
                }}
              >
                <Icon className="mr-3 h-5 w-5" />
                {item.label}
              </Button>
            );
          })}
        </nav>
      </div>
    </>
  );
};

export default Sidebar;
