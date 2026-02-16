
"use client"

import { useState } from "react"
import { Search, Plus, Filter, MoreVertical, AlertCircle } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

const products = [
  { id: 'PROD-001', name: 'Premium Cotton T-Shirt', sku: 'TSH-PC-BLU', category: 'Apparel', stock: 124, price: 499, status: 'In Stock' },
  { id: 'PROD-002', name: 'Wireless Bluetooth Earbuds', sku: 'EAR-WL-WHT', category: 'Electronics', stock: 12, price: 1299, status: 'Low Stock' },
  { id: 'PROD-003', name: 'Smart Fitness Tracker', sku: 'FIT-SM-BLK', category: 'Gadgets', stock: 45, price: 2499, status: 'In Stock' },
  { id: 'PROD-004', name: 'Ergonomic Office Chair', sku: 'CHR-ER-GRY', category: 'Furniture', stock: 0, price: 8999, status: 'Out of Stock' },
  { id: 'PROD-005', name: 'USB-C Fast Charger', sku: 'CHG-UC-30W', category: 'Electronics', stock: 215, price: 399, status: 'In Stock' },
]

export default function InventoryPage() {
  const [searchTerm, setSearchTerm] = useState('')

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">Inventory Management</h1>
          <p className="text-slate-500 mt-1">Manage and track your product stock levels across channels.</p>
        </div>
        <Button className="bg-primary hover:bg-primary/90 rounded-xl h-12 shadow-lg shadow-primary/20">
          <Plus className="h-5 w-5 mr-2" /> Add New Product
        </Button>
      </div>

      <Card className="border-none shadow-xl rounded-2xl overflow-hidden">
        <CardHeader className="p-6 bg-white border-b border-slate-50">
          <div className="flex flex-col md:flex-row md:items-center gap-4 justify-between">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <Input 
                placeholder="Search by SKU, name or category..." 
                className="pl-10 h-11 border-slate-200 rounded-xl focus:ring-primary/20 transition-all"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" className="rounded-xl h-11 border-slate-200">
                <Filter className="h-4 w-4 mr-2" /> Filters
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader className="bg-slate-50/50">
              <TableRow className="hover:bg-transparent border-slate-100">
                <TableHead className="w-[120px] font-semibold text-slate-700">Product ID</TableHead>
                <TableHead className="font-semibold text-slate-700">Product Details</TableHead>
                <TableHead className="font-semibold text-slate-700">Category</TableHead>
                <TableHead className="font-semibold text-slate-700">Stock Level</TableHead>
                <TableHead className="font-semibold text-slate-700">Price</TableHead>
                <TableHead className="font-semibold text-slate-700">Status</TableHead>
                <TableHead className="w-[50px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {products.map((product) => (
                <TableRow key={product.id} className="hover:bg-slate-50/50 border-slate-100 transition-colors">
                  <TableCell className="font-medium text-slate-600">{product.id}</TableCell>
                  <TableCell>
                    <div>
                      <div className="font-semibold text-slate-900">{product.name}</div>
                      <div className="text-xs text-slate-500">SKU: {product.sku}</div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="secondary" className="bg-slate-100 text-slate-600 border-none font-medium">
                      {product.category}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center">
                      <span className={cn(
                        "font-bold mr-2",
                        product.stock <= 15 ? "text-rose-600" : "text-slate-900"
                      )}>
                        {product.stock}
                      </span>
                      {product.stock <= 15 && product.stock > 0 && <AlertCircle className="h-4 w-4 text-rose-500" />}
                    </div>
                  </TableCell>
                  <TableCell className="font-semibold text-slate-900">₹{product.price}</TableCell>
                  <TableCell>
                    <Badge className={cn(
                      "font-medium border-none px-3 py-1",
                      product.status === 'In Stock' && "bg-emerald-100 text-emerald-700 hover:bg-emerald-100",
                      product.status === 'Low Stock' && "bg-amber-100 text-amber-700 hover:bg-amber-100",
                      product.status === 'Out of Stock' && "bg-rose-100 text-rose-700 hover:bg-rose-100"
                    )}>
                      {product.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Button variant="ghost" size="icon" className="text-slate-400 hover:text-slate-600">
                      <MoreVertical className="h-4 w-4" />
                    </Button>
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
