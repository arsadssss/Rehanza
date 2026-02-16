
"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { 
  LayoutDashboard, 
  Package, 
  ShoppingCart, 
  BarChart3, 
  AlertTriangle, 
  Calculator, 
  Settings, 
  LogOut,
  ChevronRight
} from "lucide-react"
import { cn } from "@/lib/utils"

const navigation = [
  { name: 'Dashboard', href: '/', icon: LayoutDashboard },
  { name: 'Inventory', href: '/inventory', icon: Package },
  { name: 'Orders', href: '/orders', icon: ShoppingCart },
  { name: 'Pricing & Settlement', href: '/pricing', icon: Calculator },
  { name: 'Analytics', href: '/analytics', icon: BarChart3 },
  { name: 'Low Stock AI', href: '/ai-alerts', icon: AlertTriangle },
]

export function Sidebar() {
  const pathname = usePathname()

  return (
    <div className="flex h-screen w-64 flex-col fixed left-0 top-0 bottom-0 bg-gradient-to-b from-purple-800 to-indigo-900 text-white z-50">
      <div className="flex h-20 items-center px-6 mb-4">
        <div className="bg-white/10 p-2 rounded-lg mr-3">
          <Package className="h-6 w-6 text-white" />
        </div>
        <span className="text-xl font-bold tracking-tight">REHANZA CRM</span>
      </div>
      
      <nav className="flex-1 space-y-1 px-3">
        {navigation.map((item) => {
          const isActive = pathname === item.href
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "group flex items-center px-4 py-3 text-sm font-medium rounded-xl transition-all duration-200",
                isActive 
                  ? "bg-white/15 text-white shadow-sm" 
                  : "text-purple-100 hover:bg-white/5 hover:text-white"
              )}
            >
              <item.icon className={cn(
                "mr-3 h-5 w-5 flex-shrink-0 transition-colors",
                isActive ? "text-white" : "text-purple-300 group-hover:text-white"
              )} />
              {item.name}
              {isActive && <ChevronRight className="ml-auto h-4 w-4" />}
            </Link>
          )
        })}
      </nav>

      <div className="mt-auto p-4 space-y-1">
        <button className="w-full group flex items-center px-4 py-3 text-sm font-medium rounded-xl text-purple-100 hover:bg-white/5 hover:text-white transition-all">
          <Settings className="mr-3 h-5 w-5 text-purple-300 group-hover:text-white" />
          Settings
        </button>
        <button className="w-full group flex items-center px-4 py-3 text-sm font-medium rounded-xl text-purple-100 hover:bg-white/5 hover:text-white transition-all">
          <LogOut className="mr-3 h-5 w-5 text-purple-300 group-hover:text-white" />
          Log Out
        </button>
      </div>
    </div>
  )
}
