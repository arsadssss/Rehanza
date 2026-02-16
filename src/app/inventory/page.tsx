"use client"

import { useState, useRef, useEffect } from "react"
import { Search, Plus, Filter, MoreVertical, AlertCircle, Upload, Trash2, FileSpreadsheet } from "lucide-react"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
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
import { Checkbox } from "@/components/ui/checkbox"
import { cn } from "@/lib/utils"
import * as XLSX from "xlsx"
import { useToast } from "@/hooks/use-toast"
import { supabase } from "@/lib/supabase"

const initialProducts = [
  { id: 'PROD-001', name: 'Premium Cotton T-Shirt', sku: 'TSH-PC-BLU', category: 'Apparel', stock: 124, price: 499, status: 'In Stock' },
  { id: 'PROD-002', name: 'Wireless Bluetooth Earbuds', sku: 'EAR-WL-WHT', category: 'Electronics', stock: 12, price: 1299, status: 'Low Stock' },
  { id: 'PROD-003', name: 'Smart Fitness Tracker', sku: 'FIT-SM-BLK', category: 'Gadgets', stock: 45, price: 2499, status: 'In Stock' },
  { id: 'PROD-004', name: 'Ergonomic Office Chair', sku: 'CHR-ER-GRY', category: 'Furniture', stock: 0, price: 8999, status: 'Out of Stock' },
  { id: 'PROD-005', name: 'USB-C Fast Charger', sku: 'CHG-UC-30W', category: 'Electronics', stock: 215, price: 399, status: 'In Stock' },
]

export default function InventoryPage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [inventory, setInventory] = useState(initialProducts)
  const [selectedIds, setSelectedIds] = useState<string[]>([])
  const fileInputRef = useRef<HTMLInputElement>(null)
  const { toast } = useToast()

  // Example Supabase test (can be removed later)
  useEffect(() => {
    const testConnection = async () => {
      const { data, error } = await supabase.from("products").select("*")
      if (error) console.error("Supabase Error:", error)
      else if (data && data.length > 0) console.log("Supabase Data:", data)
    }
    testConnection()
  }, [])

  const filteredProducts = inventory.filter(p => 
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    p.sku.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.category.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (evt) => {
      try {
        const bstr = evt.target?.result
        const wb = XLSX.read(bstr, { type: 'binary' })
        const wsname = wb.SheetNames[0]
        const ws = wb.Sheets[wsname]
        const data = XLSX.utils.sheet_to_json(ws) as any[]

        const newProducts = data.map((item, index) => {
          const stock = Number(item.Stock || item.stock || 0)
          return {
            id: `PROD-${Date.now()}-${index}`,
            name: item.Name || item.name || 'Imported Product',
            sku: item.SKU || item.sku || `SKU-${Math.floor(Math.random() * 10000)}`,
            category: item.Category || item.category || 'Uncategorized',
            stock: stock,
            price: Number(item.Price || item.price || 0),
            status: stock === 0 ? 'Out of Stock' : (stock <= 15 ? 'Low Stock' : 'In Stock')
          }
        })

        setInventory(prev => [...newProducts, ...prev])
        toast({
          title: "Import Successful",
          description: `Imported ${newProducts.length} products from sheet.`
        })
      } catch (error) {
        toast({
          variant: "destructive",
          title: "Import Failed",
          description: "There was an error parsing the Excel file. Please ensure it has valid columns (Name, SKU, Category, Stock, Price)."
        })
      }
    }
    reader.readAsBinaryString(file)
    if (fileInputRef.current) fileInputRef.current.value = ""
  }

  const handleDeleteSelected = () => {
    setInventory(prev => prev.filter(p => !selectedIds.includes(p.id)))
    toast({
      title: "Deleted",
      description: `Successfully removed ${selectedIds.length} items from inventory.`
    })
    setSelectedIds([])
  }

  const toggleSelectAll = () => {
    if (selectedIds.length === filteredProducts.length) {
      setSelectedIds([])
    } else {
      setSelectedIds(filteredProducts.map(p => p.id))
    }
  }

  const toggleSelectRow = (id: string) => {
    setSelectedIds(prev => 
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">Inventory Management</h1>
          <p className="text-slate-500 mt-1">Manage and track your product stock levels across channels.</p>
        </div>
        <div className="flex items-center gap-3">
          <input 
            type="file" 
            ref={fileInputRef} 
            onChange={handleFileUpload} 
            accept=".xlsx, .xls" 
            className="hidden" 
          />
          <Button 
            variant="outline" 
            className="rounded-xl h-12 border-slate-200"
            onClick={() => fileInputRef.current?.click()}
          >
            <Upload className="h-5 w-5 mr-2" /> Bulk Import
          </Button>
          <Button className="bg-primary hover:bg-primary/90 rounded-xl h-12 shadow-lg shadow-primary/20">
            <Plus className="h-5 w-5 mr-2" /> Add New Product
          </Button>
        </div>
      </div>

      <Card className="border-none shadow-xl rounded-2xl overflow-hidden">
        <CardHeader className="p-6 bg-white border-b border-slate-50">
          <div className="flex flex-col md:flex-row md:items-center gap-4 justify-between">
            <div className="flex items-center gap-4 flex-1">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <Input 
                  placeholder="Search by SKU, name or category..." 
                  className="pl-10 h-11 border-slate-200 rounded-xl focus:ring-primary/20 transition-all"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              {selectedIds.length > 0 && (
                <Button 
                  variant="destructive" 
                  className="rounded-xl h-11 animate-in fade-in slide-in-from-left-2"
                  onClick={handleDeleteSelected}
                >
                  <Trash2 className="h-4 w-4 mr-2" /> Delete Selected ({selectedIds.length})
                </Button>
              )}
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
                <TableHead className="w-[50px]">
                  <Checkbox 
                    checked={selectedIds.length > 0 && selectedIds.length === filteredProducts.length}
                    onCheckedChange={toggleSelectAll}
                  />
                </TableHead>
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
              {filteredProducts.map((product) => (
                <TableRow 
                  key={product.id} 
                  className={cn(
                    "hover:bg-slate-50/50 border-slate-100 transition-colors",
                    selectedIds.includes(product.id) && "bg-indigo-50/50"
                  )}
                >
                  <TableCell>
                    <Checkbox 
                      checked={selectedIds.includes(product.id)}
                      onCheckedChange={() => toggleSelectRow(product.id)}
                    />
                  </TableCell>
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
              {filteredProducts.length === 0 && (
                <TableRow>
                  <TableCell colSpan={8} className="h-32 text-center text-slate-500">
                    <div className="flex flex-col items-center justify-center gap-2">
                      <FileSpreadsheet className="h-8 w-8 opacity-20" />
                      No products found matching your search.
                    </div>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
