
"use client"

import { Calculator, Info, Wallet, TrendingDown } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"

const marketplacePricing = [
  { 
    id: 1, 
    name: 'Premium Cotton T-Shirt', 
    sellingPrice: 499, 
    amazon: { referral: 45, shipping: 65, closing: 25, profit: 364 },
    flipkart: { referral: 35, shipping: 60, closing: 20, profit: 384 },
    meesho: { referral: 0, shipping: 45, closing: 0, profit: 454 }
  },
  { 
    id: 2, 
    name: 'Wireless Bluetooth Earbuds', 
    sellingPrice: 1299, 
    amazon: { referral: 120, shipping: 85, closing: 45, profit: 1049 },
    flipkart: { referral: 110, shipping: 80, closing: 40, profit: 1069 },
    meesho: { referral: 0, shipping: 65, closing: 0, profit: 1234 }
  }
]

export default function PricingPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">Pricing & Settlement</h1>
          <p className="text-slate-500 mt-1">Analyze payouts and manage pricing strategies for each platform.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="border-none shadow-xl rounded-2xl bg-indigo-600 text-white">
          <CardContent className="p-6">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-indigo-100 text-sm font-medium">Projected Settlement (Next 7 days)</p>
                <h3 className="text-3xl font-bold mt-2">₹1,84,200</h3>
                <div className="mt-4 flex items-center text-indigo-100 text-xs">
                  <Wallet className="h-4 w-4 mr-2" /> Across 3 Marketplaces
                </div>
              </div>
              <div className="bg-white/20 p-3 rounded-2xl">
                <Calculator className="h-6 w-6" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-none shadow-xl rounded-2xl bg-rose-50">
          <CardContent className="p-6">
             <div className="flex justify-between items-start">
              <div>
                <p className="text-rose-600 text-sm font-medium">Estimated Return Losses</p>
                <h3 className="text-3xl font-bold mt-2 text-rose-700">₹8,450</h3>
                <div className="mt-4 flex items-center text-rose-600 text-xs">
                  <TrendingDown className="h-4 w-4 mr-2" /> 5.2% of Total Revenue
                </div>
              </div>
              <div className="bg-rose-100 p-3 rounded-2xl">
                <TrendingDown className="h-6 w-6 text-rose-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-none shadow-xl rounded-2xl bg-emerald-50">
          <CardContent className="p-6">
             <div className="flex justify-between items-start">
              <div>
                <p className="text-emerald-600 text-sm font-medium">Ads Spend Efficiency (ROAS)</p>
                <h3 className="text-3xl font-bold mt-2 text-emerald-700">4.8x</h3>
                <div className="mt-4 flex items-center text-emerald-600 text-xs font-bold">
                  Target: 4.0x+
                </div>
              </div>
              <div className="bg-emerald-100 p-3 rounded-2xl">
                <Calculator className="h-6 w-6 text-emerald-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="border-none shadow-xl rounded-2xl overflow-hidden">
        <CardHeader>
          <CardTitle>Marketplace Fee Analysis</CardTitle>
          <CardDescription>Comparison of net profit after platform fees and shipping costs.</CardDescription>
        </CardHeader>
        <CardContent className="p-6">
          <div className="space-y-8">
            {marketplacePricing.map((product) => (
              <div key={product.id} className="border border-slate-100 rounded-3xl p-6 bg-slate-50/50 hover:bg-white transition-colors duration-300">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-bold text-slate-900">{product.name}</h3>
                  <Badge variant="outline" className="text-lg px-4 py-1 border-slate-200">MRP: ₹{product.sellingPrice}</Badge>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {/* Amazon */}
                  <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100">
                    <div className="flex items-center gap-2 mb-4">
                      <div className="w-2 h-8 bg-orange-500 rounded-full" />
                      <span className="font-bold text-slate-800">Amazon</span>
                    </div>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between text-slate-500">Referral Fee <span>₹{product.amazon.referral}</span></div>
                      <div className="flex justify-between text-slate-500">Shipping <span>₹{product.amazon.shipping}</span></div>
                      <div className="flex justify-between text-slate-500">Closing <span>₹{product.amazon.closing}</span></div>
                      <div className="pt-3 border-t border-slate-100 flex justify-between font-bold text-slate-900">
                        Net Payout <span className="text-emerald-600">₹{product.amazon.profit}</span>
                      </div>
                    </div>
                  </div>

                  {/* Flipkart */}
                  <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100">
                    <div className="flex items-center gap-2 mb-4">
                      <div className="w-2 h-8 bg-blue-600 rounded-full" />
                      <span className="font-bold text-slate-800">Flipkart</span>
                    </div>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between text-slate-500">Referral Fee <span>₹{product.flipkart.referral}</span></div>
                      <div className="flex justify-between text-slate-500">Shipping <span>₹{product.flipkart.shipping}</span></div>
                      <div className="flex justify-between text-slate-500">Closing <span>₹{product.flipkart.closing}</span></div>
                      <div className="pt-3 border-t border-slate-100 flex justify-between font-bold text-slate-900">
                        Net Payout <span className="text-emerald-600">₹{product.flipkart.profit}</span>
                      </div>
                    </div>
                  </div>

                  {/* Meesho */}
                  <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100">
                    <div className="flex items-center gap-2 mb-4">
                      <div className="w-2 h-8 bg-pink-500 rounded-full" />
                      <span className="font-bold text-slate-800">Meesho</span>
                    </div>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between text-slate-500">Commission Fee <span>₹{product.meesho.referral}</span></div>
                      <div className="flex justify-between text-slate-500">Shipping <span>₹{product.meesho.shipping}</span></div>
                      <div className="flex justify-between text-slate-500">Closing <span>-</span></div>
                      <div className="pt-3 border-t border-slate-100 flex justify-between font-bold text-slate-900">
                        Net Payout <span className="text-emerald-600 font-black">₹{product.meesho.profit}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
