
"use client"

import { ShoppingCart, Filter, Download } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

const orders = [
  { id: '#ORD-9283', channel: 'Amazon', customer: 'Rahul Sharma', date: 'Oct 24, 2023', total: '₹1,249', status: 'Shipped' },
  { id: '#ORD-9284', channel: 'Flipkart', customer: 'Priya Patel', date: 'Oct 24, 2023', total: '₹3,499', status: 'Processing' },
  { id: '#ORD-9285', channel: 'Meesho', customer: 'Amit Singh', date: 'Oct 23, 2023', total: '₹599', status: 'Delivered' },
  { id: '#ORD-9286', channel: 'Amazon', customer: 'Sneha Kapur', date: 'Oct 23, 2023', total: '₹899', status: 'Pending' },
  { id: '#ORD-9287', channel: 'Flipkart', customer: 'Vikram Rao', date: 'Oct 22, 2023', total: '₹12,999', status: 'Shipped' },
]

export default function OrdersPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">Order Management</h1>
          <p className="text-slate-500 mt-1">Track and manage sales across all your marketplace channels.</p>
        </div>
        <div className="flex items-center gap-3">
           <Button variant="outline" className="rounded-xl border-slate-200">
            <Download className="h-4 w-4 mr-2" /> Export
          </Button>
          <Button className="bg-primary hover:bg-primary/90 rounded-xl shadow-lg shadow-primary/20">
            <Filter className="h-4 w-4 mr-2" /> Bulk Actions
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { label: 'Pending Orders', value: '12', color: 'text-amber-600', bg: 'bg-amber-50' },
          { label: 'Unshipped Items', value: '45', color: 'text-blue-600', bg: 'bg-blue-50' },
          { label: 'Returns Initiated', value: '3', color: 'text-rose-600', bg: 'bg-rose-50' },
        ].map((item) => (
          <Card key={item.label} className="border-none shadow-xl rounded-2xl overflow-hidden">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-500">{item.label}</p>
                  <h3 className="text-2xl font-bold mt-1 text-slate-900">{item.value}</h3>
                </div>
                <div className={cn("p-3 rounded-2xl", item.bg)}>
                  <ShoppingCart className={cn("h-6 w-6", item.color)} />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="border-none shadow-xl rounded-2xl overflow-hidden">
        <CardContent className="p-0">
          <Table>
            <TableHeader className="bg-slate-50/50">
              <TableRow className="hover:bg-transparent border-slate-100">
                <TableHead className="font-semibold text-slate-700">Order ID</TableHead>
                <TableHead className="font-semibold text-slate-700">Channel</TableHead>
                <TableHead className="font-semibold text-slate-700">Customer</TableHead>
                <TableHead className="font-semibold text-slate-700">Date</TableHead>
                <TableHead className="font-semibold text-slate-700">Total Amount</TableHead>
                <TableHead className="font-semibold text-slate-700">Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {orders.map((order) => (
                <TableRow key={order.id} className="hover:bg-slate-50/50 border-slate-100 transition-colors">
                  <TableCell className="font-bold text-slate-900">{order.id}</TableCell>
                  <TableCell>
                    <div className="flex items-center">
                      <span className={cn(
                        "w-2 h-2 rounded-full mr-2",
                        order.channel === 'Amazon' ? "bg-orange-500" : order.channel === 'Flipkart' ? "bg-blue-500" : "bg-pink-500"
                      )} />
                      <span className="font-medium text-slate-700">{order.channel}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-slate-600">{order.customer}</TableCell>
                  <TableCell className="text-slate-500">{order.date}</TableCell>
                  <TableCell className="font-bold text-slate-900">{order.total}</TableCell>
                  <TableCell>
                    <Badge className={cn(
                      "font-medium border-none px-3 py-1 rounded-full",
                      order.status === 'Shipped' && "bg-indigo-100 text-indigo-700 hover:bg-indigo-100",
                      order.status === 'Processing' && "bg-blue-100 text-blue-700 hover:bg-blue-100",
                      order.status === 'Delivered' && "bg-emerald-100 text-emerald-700 hover:bg-emerald-100",
                      order.status === 'Pending' && "bg-slate-100 text-slate-700 hover:bg-slate-100"
                    )}>
                      {order.status}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
