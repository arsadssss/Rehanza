
"use client"

import { useState } from "react"
import { AlertTriangle, Sparkles, Loader2, ArrowRight, PackageCheck } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { getPredictiveLowStockAlerts, PredictiveLowStockAlertsOutput } from "@/ai/flows/predictive-low-stock-alerts-flow"
import { cn } from "@/lib/utils"

const mockInventoryData = [
  { id: '1', name: 'Premium Cotton T-Shirt', currentStock: 120, historicalDailySales: [10, 12, 11, 14, 13, 15, 12] },
  { id: '2', name: 'Wireless Bluetooth Earbuds', currentStock: 15, historicalDailySales: [4, 5, 3, 6, 4, 5, 5] },
  { id: '3', name: 'Smart Fitness Tracker', currentStock: 45, historicalDailySales: [8, 9, 7, 10, 8, 9, 10] },
  { id: '4', name: 'Ergonomic Office Chair', currentStock: 3, historicalDailySales: [1, 0, 1, 2, 1, 0, 1] },
]

export default function AIAlertsPage() {
  const [loading, setLoading] = useState(false)
  const [results, setResults] = useState<PredictiveLowStockAlertsOutput | null>(null)

  const handleRunAnalysis = async () => {
    setLoading(true)
    try {
      const data = await getPredictiveLowStockAlerts({
        products: mockInventoryData,
        predictionDays: 7
      })
      setResults(data)
    } catch (error) {
      console.error("AI Analysis failed", error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900 flex items-center gap-3">
            AI Stock Predictor <Sparkles className="h-7 w-7 text-primary fill-primary/10" />
          </h1>
          <p className="text-slate-500 mt-1">Predict stockouts before they happen using historical sales patterns.</p>
        </div>
        <Button 
          onClick={handleRunAnalysis} 
          disabled={loading}
          className="bg-primary hover:bg-primary/90 rounded-xl h-12 shadow-lg shadow-primary/20"
        >
          {loading ? (
            <><Loader2 className="h-5 w-5 mr-2 animate-spin" /> Analyzing Pattern...</>
          ) : (
            <><Sparkles className="h-5 w-5 mr-2" /> Run AI Analysis</>
          )}
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <Card className="lg:col-span-1 border-none shadow-xl rounded-2xl bg-indigo-50/50">
          <CardHeader>
            <CardTitle className="text-lg">Analysis Settings</CardTitle>
            <CardDescription>Configuration for prediction</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">Prediction Window</label>
              <div className="text-2xl font-bold text-primary">7 Days</div>
              <p className="text-xs text-slate-500">Based on trailing 7-day sales velocity.</p>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">Products Tracked</label>
              <div className="text-2xl font-bold text-slate-900">4 SKUs</div>
            </div>
            <div className="pt-4 border-t border-indigo-100">
              <p className="text-xs text-indigo-600 font-medium">AI Agent: Rehanza Intelligence v2.1</p>
            </div>
          </CardContent>
        </Card>

        <Card className="lg:col-span-3 border-none shadow-xl rounded-2xl overflow-hidden min-h-[400px]">
          <CardContent className="p-0">
            {!results && !loading && (
              <div className="flex flex-col items-center justify-center h-[400px] text-center p-8">
                <div className="bg-indigo-50 p-4 rounded-full mb-4">
                  <Sparkles className="h-10 w-10 text-primary opacity-50" />
                </div>
                <h3 className="text-lg font-bold text-slate-900">Ready for Analysis</h3>
                <p className="text-slate-500 max-w-sm mt-2">Click the button above to start analyzing your current stock levels against historical sales trends.</p>
              </div>
            )}

            {loading && (
              <div className="flex flex-col items-center justify-center h-[400px] p-8 space-y-4">
                <Loader2 className="h-12 w-12 text-primary animate-spin" />
                <div className="space-y-2 text-center">
                  <p className="text-lg font-semibold text-slate-900">AI is crunching numbers...</p>
                  <p className="text-sm text-slate-500">Calculating velocity and run-rate for each product.</p>
                </div>
                <Progress value={66} className="w-full max-w-xs" />
              </div>
            )}

            {results && !loading && (
              <div className="p-8">
                <div className="bg-purple-50 border border-purple-100 p-6 rounded-2xl mb-8 flex items-start gap-4">
                  <AlertTriangle className="h-6 w-6 text-purple-600 shrink-0 mt-0.5" />
                  <div>
                    <h3 className="font-bold text-purple-900 mb-1">AI Executive Summary</h3>
                    <p className="text-purple-700 leading-relaxed">{results.summary}</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {results.lowStockAlerts.map((alert) => (
                    <Card key={alert.productId} className="border border-slate-100 shadow-sm rounded-2xl hover:shadow-md transition-shadow">
                      <CardContent className="p-5 flex items-center justify-between">
                        <div className="space-y-1">
                          <h4 className="font-bold text-slate-900">{alert.productName}</h4>
                          <div className="flex items-center gap-4 text-xs text-slate-500">
                            <span>Stock: <strong className="text-slate-700">{alert.currentStock}</strong></span>
                            <span>Sales/Day: <strong className="text-slate-700">{alert.averageDailySales}</strong></span>
                          </div>
                        </div>
                        <div className="text-right shrink-0">
                          <div className={cn(
                            "text-lg font-black",
                            alert.predictedDaysRemaining < 3 ? "text-rose-600" : "text-amber-600"
                          )}>
                            {alert.predictedDaysRemaining} Days
                          </div>
                          <div className="text-[10px] uppercase font-bold text-slate-400">Runway</div>
                        </div>
                      </CardContent>
                      <div className="px-5 pb-4">
                         <Button variant="ghost" className="w-full justify-between h-9 text-primary hover:text-primary hover:bg-primary/5 rounded-lg px-3 group">
                          Restock Now <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                         </Button>
                      </div>
                    </Card>
                  ))}
                  
                  {results.lowStockAlerts.length === 0 && (
                    <div className="col-span-2 py-12 flex flex-col items-center gap-3">
                      <PackageCheck className="h-12 w-12 text-emerald-500" />
                      <p className="text-slate-600 font-medium">Great news! All items have healthy runway.</p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
