
"use client"

import { BarChart, Bar, ResponsiveContainer, XAxis, YAxis, Tooltip, Legend, PieChart, Pie, Cell } from "recharts"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

const performanceData = [
  { month: 'Jan', profit: 12000, revenue: 45000 },
  { month: 'Feb', profit: 15000, revenue: 52000 },
  { month: 'Mar', profit: 11000, revenue: 48000 },
  { month: 'Apr', profit: 18000, revenue: 61000 },
  { month: 'May', profit: 22000, revenue: 75000 },
  { month: 'Jun', profit: 19000, revenue: 68000 },
]

const categoryData = [
  { name: 'Electronics', value: 400 },
  { name: 'Apparel', value: 300 },
  { name: 'Gadgets', value: 200 },
  { name: 'Furniture', value: 100 },
]

const COLORS = ['#6366F1', '#4F46E5', '#3B82F6', '#94A3B8']

export default function AnalyticsPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">Performance Analytics</h1>
          <p className="text-slate-500 mt-1">Deep dive into your sales, profits and operational efficiency.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="border-none shadow-xl rounded-2xl">
          <CardHeader>
            <CardTitle>Revenue vs Net Profit</CardTitle>
            <CardDescription>Monthly comparison of gross sales and final profit.</CardDescription>
          </CardHeader>
          <CardContent className="h-[400px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={performanceData}>
                <XAxis dataKey="month" axisLine={false} tickLine={false} />
                <YAxis axisLine={false} tickLine={false} />
                <Tooltip 
                   cursor={{fill: '#f8fafc'}}
                   contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                />
                <Legend />
                <Bar dataKey="revenue" fill="#6366F1" radius={[6, 6, 0, 0]} name="Total Revenue" />
                <Bar dataKey="profit" fill="#10B981" radius={[6, 6, 0, 0]} name="Net Profit" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="border-none shadow-xl rounded-2xl">
          <CardHeader>
            <CardTitle>Category Distribution</CardTitle>
            <CardDescription>Sales contribution by product category.</CardDescription>
          </CardHeader>
          <CardContent className="h-[400px] flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  innerRadius={80}
                  outerRadius={120}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: 'Customer Acquisition Cost', value: '₹145', change: '-12%', status: 'good' },
          { label: 'Avg. Order Value', value: '₹2,140', change: '+5%', status: 'neutral' },
          { label: 'Return Rate', value: '4.2%', change: '+1%', status: 'bad' },
          { label: 'Inventory Turnover', value: '1.4x', change: '+0.2', status: 'good' },
        ].map((metric) => (
          <Card key={metric.label} className="border-none shadow-xl rounded-2xl">
            <CardContent className="p-6">
              <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">{metric.label}</p>
              <div className="flex items-end justify-between mt-2">
                <h3 className="text-2xl font-bold text-slate-900">{metric.value}</h3>
                <Badge className={cn(
                  "border-none font-bold",
                  metric.status === 'good' ? "bg-emerald-100 text-emerald-700" :
                  metric.status === 'bad' ? "bg-rose-100 text-rose-700" : "bg-slate-100 text-slate-700"
                )}>
                  {metric.change}
                </Badge>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
