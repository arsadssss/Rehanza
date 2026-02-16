
"use client"

import { useState, useRef, useEffect, useMemo } from "react"
import { supabase } from "@/lib/supabase"
import {
  Search,
  Plus,
  Filter,
  MoreVertical,
  Trash2,
  FileSpreadsheet,
  Package,
  IndianRupee,
  Loader2,
  CheckCircle2
} from "lucide-react"
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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { cn } from "@/lib/utils"
import { useToast } from "@/hooks/use-toast"

// --- PRICING CONSTANTS (Future-proof: can be moved to Settings) ---
const PRICING_CONSTANTS = {
  PROMO_ADS: 20,
  TAX_OTHER: 10,
  PACKING: 15,
  AMAZON_SHIP: 80,
}

const MARGIN_OPTIONS: Record<string, number> = {
  "Pack of 1": 20,
  "Pack of 2": 30,
  "Pack of 3": 45,
  "Pack of 4": 60,
  "Pack of 6": 80,
  "Pack of 12": 120,
}

type ProductRow = {
  id: string
  sku: string
  name: string
  cost: number
  stock: number
  margin_type: string
  margin_value: number
  meesho_price: number
  flipkart_price: number
  amazon_price: number
  created_at?: string
}

export default function InventoryPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [inventory, setInventory] = useState<ProductRow[]>([])
  const [selectedIds, setSelectedIds] = useState<string[]>([])
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const { toast } = useToast()

  // New Product Form State
  const [newProduct, setNewProduct] = useState({
    sku: "",
    name: "",
    cost: 0,
    stock: 0,
    marginType: "Pack of 1",
  })

  // ✅ FETCH PRODUCTS
  const fetchInventory = async () => {
    setIsLoading(true)
    const { data, error } = await supabase
      .from("products")
      .select("*")
      .order("created_at", { ascending: false })

    if (error) {
      console.error("Supabase Fetch Error:", error)
      toast({
        variant: "destructive",
        title: "Error fetching data",
        description: error.message
      })
    } else {
      // Map name to sku if name is missing for display
      const formatted = (data || []).map(p => ({
        ...p,
        name: p.name || p.sku // Fallback to SKU as name
      }))
      setInventory(formatted)
    }
    setIsLoading(false)
  }

  useEffect(() => {
    fetchInventory()
  }, [])

  // ✅ CALCULATE PRICES
  const calculatedPrices = useMemo(() => {
    const cost = Number(newProduct.cost) || 0
    const margin = MARGIN_OPTIONS[newProduct.marginType] || 0
    
    const basePrice = cost + PRICING_CONSTANTS.PROMO_ADS + PRICING_CONSTANTS.TAX_OTHER + PRICING_CONSTANTS.PACKING + margin
    const amazonPrice = basePrice + PRICING_CONSTANTS.AMAZON_SHIP

    return {
      meesho: basePrice,
      flipkart: basePrice,
      amazon: amazonPrice,
      margin_value: margin
    }
  }, [newProduct.cost, newProduct.marginType])

  // ✅ ADD PRODUCT HANDLER
  const handleAddProduct = async () => {
    if (!newProduct.sku) {
      toast({ variant: "destructive", title: "SKU is required" })
      return
    }

    setIsSaving(true)
    const margin_value = MARGIN_OPTIONS[newProduct.marginType]
    
    const payload = {
      sku: newProduct.sku,
      name: newProduct.name || newProduct.sku,
      cost: Number(newProduct.cost),
      stock: Number(newProduct.stock),
      margin_type: newProduct.marginType,
      margin_value: margin_value,
      meesho_price: calculatedPrices.meesho,
      flipkart_price: calculatedPrices.flipkart,
      amazon_price: calculatedPrices.amazon,
    }

    const { data, error } = await supabase
      .from("products")
      .insert([payload])
      .select()

    if (error) {
      toast({
        variant: "destructive",
        title: "Insert Failed",
        description: error.message
      })
    } else {
      toast({
        title: "Product Added",
        description: `${newProduct.sku} has been added successfully.`
      })
      // Update local state without reload
      setInventory(prev => [data[0], ...prev])
      setIsModalOpen(false)
      // Reset form
      setNewProduct({
        sku: "",
        name: "",
        cost: 0,
        stock: 0,
        marginType: "Pack of 1",
      })
    }
    setIsSaving(false)
  }

  const filteredProducts = inventory.filter((p) =>
    (p.sku || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
    (p.name || "").toLowerCase().includes(searchTerm.toLowerCase())
  )

  const handleDeleteSelected = async () => {
    if (selectedIds.length === 0) return

    const { error } = await supabase
      .from("products")
      .delete()
      .in("id", selectedIds)

    if (error) {
      toast({
        variant: "destructive",
        title: "Delete Failed",
        description: error.message
      })
      return
    }

    setInventory(prev =>
      prev.filter(p => !selectedIds.includes(p.id))
    )

    toast({
      title: "Deleted Successfully",
      description: `${selectedIds.length} product(s) removed`
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
      prev.includes(id)
        ? prev.filter(i => i !== id)
        : [...prev, id]
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">Inventory Management</h1>
          <p className="text-slate-500">
            Real-time data from Supabase • Dynamic Pricing Engine
          </p>
        </div>
        
        <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
          <DialogTrigger asChild>
            <Button className="bg-primary rounded-xl h-11 px-6 shadow-lg shadow-primary/20 hover:opacity-90">
              <Plus className="h-4 w-4 mr-2" /> Add Product
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px] rounded-3xl">
            <DialogHeader>
              <DialogTitle className="text-2xl font-bold flex items-center gap-2">
                <Package className="h-6 w-6 text-primary" />
                Add New Product
              </DialogTitle>
            </DialogHeader>
            <div className="grid gap-6 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="sku" className="text-sm font-semibold">SKU</Label>
                  <Input 
                    id="sku" 
                    placeholder="e.g. ABC-100" 
                    value={newProduct.sku}
                    onChange={(e) => setNewProduct({...newProduct, sku: e.target.value})}
                    className="rounded-xl"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="stock" className="text-sm font-semibold">Stock</Label>
                  <Input 
                    id="stock" 
                    type="number" 
                    placeholder="0" 
                    value={newProduct.stock}
                    onChange={(e) => setNewProduct({...newProduct, stock: Number(e.target.value)})}
                    className="rounded-xl"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="cost" className="text-sm font-semibold">Product Cost (₹)</Label>
                  <Input 
                    id="cost" 
                    type="number" 
                    placeholder="0" 
                    value={newProduct.cost}
                    onChange={(e) => setNewProduct({...newProduct, cost: Number(e.target.value)})}
                    className="rounded-xl"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="marginType" className="text-sm font-semibold">Margin Type</Label>
                  <Select 
                    value={newProduct.marginType} 
                    onValueChange={(val) => setNewProduct({...newProduct, marginType: val})}
                  >
                    <SelectTrigger className="rounded-xl">
                      <SelectValue placeholder="Select Pack" />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.keys(MARGIN_OPTIONS).map(opt => (
                        <SelectItem key={opt} value={opt}>{opt}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Real-time Pricing Preview */}
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 space-y-3">
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Calculated Channel Prices</p>
                <div className="grid grid-cols-3 gap-4">
                  <div className="text-center">
                    <p className="text-[10px] font-medium text-slate-500 uppercase">Meesho</p>
                    <p className="font-bold text-slate-900">₹{calculatedPrices.meesho}</p>
                  </div>
                  <div className="text-center">
                    <p className="text-[10px] font-medium text-slate-500 uppercase">Flipkart</p>
                    <p className="font-bold text-slate-900">₹{calculatedPrices.flipkart}</p>
                  </div>
                  <div className="text-center">
                    <p className="text-[10px] font-medium text-slate-500 uppercase">Amazon</p>
                    <p className="font-bold text-primary">₹{calculatedPrices.amazon}</p>
                  </div>
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button 
                onClick={handleAddProduct} 
                className="w-full bg-primary h-12 rounded-xl text-lg font-bold"
                disabled={isSaving}
              >
                {isSaving ? (
                  <><Loader2 className="mr-2 h-5 w-5 animate-spin" /> Saving...</>
                ) : (
                  "Save Product & Sync"
                )}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <Card className="rounded-2xl shadow-xl border-none overflow-hidden bg-white">
        <CardHeader className="bg-white border-b border-slate-50">
          <div className="flex items-center gap-4">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <Input
                placeholder="Search by SKU or name..."
                className="pl-10 rounded-xl border-slate-200 h-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            {selectedIds.length > 0 && (
              <Button
                variant="destructive"
                className="rounded-xl h-10"
                onClick={handleDeleteSelected}
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Delete Selected ({selectedIds.length})
              </Button>
            )}
          </div>
        </CardHeader>

        <CardContent className="p-0">
          <Table>
            <TableHeader className="bg-slate-50/50">
              <TableRow className="hover:bg-transparent border-slate-100">
                <TableHead className="w-[50px] pl-6">
                  <Checkbox
                    checked={
                      filteredProducts.length > 0 &&
                      selectedIds.length === filteredProducts.length
                    }
                    onCheckedChange={toggleSelectAll}
                  />
                </TableHead>
                <TableHead className="font-semibold text-slate-700">SKU / Product</TableHead>
                <TableHead className="font-semibold text-slate-700">Stock</TableHead>
                <TableHead className="font-semibold text-slate-700">Meesho</TableHead>
                <TableHead className="font-semibold text-slate-700">Flipkart</TableHead>
                <TableHead className="font-semibold text-slate-700 text-primary">Amazon</TableHead>
                <TableHead className="font-semibold text-slate-700">Status</TableHead>
                <TableHead className="w-[50px]"></TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={8} className="text-center py-20">
                    <Loader2 className="h-8 w-8 animate-spin mx-auto text-primary opacity-50" />
                    <p className="mt-2 text-sm text-slate-500">Loading inventory...</p>
                  </TableCell>
                </TableRow>
              ) : filteredProducts.map(product => (
                <TableRow key={product.id} className="hover:bg-slate-50/50 border-slate-50 group">
                  <TableCell className="pl-6">
                    <Checkbox
                      checked={selectedIds.includes(product.id)}
                      onCheckedChange={() =>
                        toggleSelectRow(product.id)
                      }
                    />
                  </TableCell>

                  <TableCell className="py-4">
                    <div className="flex flex-col">
                      <span className="font-bold text-slate-900">{product.sku}</span>
                      <span className="text-xs text-slate-500 font-medium">{product.margin_type}</span>
                    </div>
                  </TableCell>

                  <TableCell>
                    <span
                      className={cn(
                        "font-bold px-3 py-1 rounded-full text-xs",
                        product.stock <= 15
                          ? "bg-rose-50 text-rose-600"
                          : "bg-emerald-50 text-emerald-600"
                      )}
                    >
                      {product.stock}
                    </span>
                  </TableCell>

                  <TableCell className="font-medium text-slate-600">₹{product.meesho_price}</TableCell>
                  <TableCell className="font-medium text-slate-600">₹{product.flipkart_price}</TableCell>
                  <TableCell className="font-bold text-primary">₹{product.amazon_price}</TableCell>

                  <TableCell>
                    <Badge
                      className={cn(
                        "font-medium border-none px-3 py-1 rounded-full",
                        product.stock > 15 && "bg-emerald-100 text-emerald-700 hover:bg-emerald-100",
                        product.stock <= 15 && product.stock > 0 && "bg-amber-100 text-amber-700 hover:bg-amber-100",
                        product.stock === 0 && "bg-rose-100 text-rose-700 hover:bg-rose-100"
                      )}
                    >
                      {product.stock === 0 ? "Out of Stock" : product.stock <= 15 ? "Low Stock" : "In Stock"}
                    </Badge>
                  </TableCell>

                  <TableCell className="pr-6">
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 group-hover:text-slate-900 transition-colors">
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}

              {!isLoading && filteredProducts.length === 0 && (
                <TableRow>
                  <TableCell colSpan={8} className="text-center py-20">
                    <div className="bg-slate-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                      <FileSpreadsheet className="h-8 w-8 text-slate-300" />
                    </div>
                    <h3 className="text-lg font-bold text-slate-900">No products found</h3>
                    <p className="text-sm text-slate-500 mt-1 max-w-xs mx-auto">
                      Try searching for a different SKU or add a new product using the button above.
                    </p>
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
