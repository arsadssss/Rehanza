
"use client"

import { 
  TrendingUp, 
  Users, 
  Package, 
  ShoppingCart,
  ArrowUpRight,
  ArrowDownRight
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { 
  Area, 
  AreaChart, 
  ResponsiveContainer, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip 
} from "recharts"
import { cn } from "@/lib/utils"

const stats = [
  { 
    name: 'Total Revenue', 
    value: '₹4,52,350', 
    change: '+12.5%', 
    trend: 'up', 
    icon: TrendingUp,
    color: 'text-emerald-500',
    bg: 'bg-emerald-50'
  },
  { 
    name: 'Total Orders', 
    value: '1,284', 
    change: '+3.2%', 
    trend: 'up', 
    icon: ShoppingCart,
    color: 'text-indigo-500',
    bg: 'bg-indigo-50'
  },
  { 
    name: 'Products in Stock', 
    value: '45', 
    change: '-2 items', 
    trend: 'down', 
    icon: Package,
    color: 'text-amber-500',
    bg: 'bg-amber-50'
  },
  { 
    name: 'Avg. Profit Margin', 
    value: '24%', 
    change: '+1.4%', 
    trend: 'up', 
    icon: Users,
    color: 'text-purple-500',
    bg: 'bg-purple-50'
  },
]

const chartData = [
  { name: 'Mon', revenue: 4500 },
  { name: 'Tue', revenue: 5200 },
  { name: 'Wed', revenue: 4800 },
  { name: 'Thu', revenue: 6100 },
  { name: 'Fri', revenue: 5900 },
  { name: 'Sat', revenue: 7200 },
  { name: 'Sun', revenue: 6800 },
]

export default function Dashboard() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight text-slate-900">Dashboard Overview</h1>
        <div className="flex items-center gap-3">
          <div className="text-sm text-slate-500 font-medium">Last updated: 5 mins ago</div>
          <button className="bg-primary text-white px-4 py-2 rounded-xl text-sm font-semibold shadow-lg shadow-primary/20 hover:opacity-90 transition-opacity">
            Export Report
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <Card key={stat.name} className="border-none shadow-xl rounded-2xl overflow-hidden hover:scale-[1.02] transition-transform">
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-500">{stat.name}</p>
                  <h3 className="text-2xl font-bold mt-1 text-slate-900">{stat.value}</h3>
                  <div className="flex items-center mt-2">
                    <span className={cn(
                      "flex items-center text-xs font-semibold px-2 py-0.5 rounded-full",
                      stat.trend === 'up' ? "bg-emerald-50 text-emerald-600" : "bg-rose-50 text-rose-600"
                    )}>
                      {stat.trend === 'up' ? <ArrowUpRight className="h-3 w-3 mr-1" /> : <ArrowDownRight className="h-3 w-3 mr-1" />}
                      {stat.change}
                    </span>
                    <span className="text-xs text-slate-400 ml-2">vs last month</span>
                  </div>
                </div>
                <div className={cn("p-3 rounded-2xl", stat.bg)}>
                  <stat.icon className={cn("h-6 w-6", stat.color)} />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2 border-none shadow-xl rounded-2xl">
          <CardHeader>
            <CardTitle className="text-lg font-semibold">Revenue Trend (Weekly)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData}>
                  <defs>
                    <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#6366F1" stopOpacity={0.1}/>
                      <stop offset="95%" stopColor="#6366F1" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis 
                    dataKey="name" 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{fill: '#94a3b8', fontSize: 12}}
                    dy={10}
                  />
                  <YAxis 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{fill: '#94a3b8', fontSize: 12}}
                  />
                  <Tooltip 
                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="revenue" 
                    stroke="#6366F1" 
                    strokeWidth={3}
                    fillOpacity={1} 
                    fill="url(#colorRevenue)" 
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card className="border-none shadow-xl rounded-2xl">
          <CardHeader>
            <CardTitle className="text-lg font-semibold">Top Channels</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {[
                { name: 'Amazon', orders: '458', percentage: 45, color: 'bg-orange-500' },
                { name: 'Flipkart', orders: '324', percentage: 32, color: 'bg-blue-600' },
                { name: 'Meesho', orders: '232', percentage: 23, color: 'bg-pink-500' },
              ].map((channel) => (
                <div key={channel.name}>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-slate-700">{channel.name}</span>
                    <span className="text-sm font-semibold text-slate-900">{channel.orders} orders</span>
                  </div>
                  <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                    <div 
                      className={cn("h-full rounded-full", channel.color)} 
                      style={{ width: `${channel.percentage}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-8 p-4 bg-purple-50 rounded-2xl">
              <p className="text-sm text-purple-700 font-medium">
                Insight: Amazon sales are up 15% this week compared to others.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
