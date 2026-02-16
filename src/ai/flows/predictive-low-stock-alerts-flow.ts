'use server';
/**
 * @fileOverview A Genkit flow for predicting low stock alerts based on historical sales and current inventory.
 *
 * - getPredictiveLowStockAlerts - A function that initiates the low stock prediction process.
 * - PredictiveLowStockAlertsInput - The input type for the getPredictiveLowStockAlerts function.
 * - PredictiveLowStockAlertsOutput - The return type for the getPredictiveLowStockAlerts function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

// Input Schema for the flow and the tool
const PredictiveLowStockAlertsInputSchema = z.object({
  products: z.array(z.object({
    id: z.string().describe('Unique identifier for the product.'),
    name: z.string().describe('Name of the product.'),
    currentStock: z.number().int().min(0).describe('Current available stock of the product.'),
    historicalDailySales: z.array(z.number().int().min(0)).describe('Array of daily sales figures for a historical period.'),
  })).describe('List of products with their current stock and historical sales data.'),
  predictionDays: z.number().int().min(1).describe('Number of days into the future for which to predict stockouts.'),
});
export type PredictiveLowStockAlertsInput = z.infer<typeof PredictiveLowStockAlertsInputSchema>;

// Output Schema for a single low stock alert item
const LowStockAlertSchema = z.object({
  productId: z.string().describe('ID of the product predicted to run out of stock.'),
  productName: z.string().describe('Name of the product.'),
  currentStock: z.number().int().min(0).describe('Current stock level of the product.'),
  averageDailySales: z.number().describe('Average daily sales for the product based on historical data.'),
  predictedDaysRemaining: z.number().describe('Predicted number of days until the product runs out of stock. Will be 0 if already out of stock.'),
});

// Output Schema for the entire flow
const PredictiveLowStockAlertsOutputSchema = z.object({
  lowStockAlerts: z.array(LowStockAlertSchema).describe('List of products predicted to run out of stock within the prediction window.'),
  summary: z.string().describe('A concise summary message about the low stock alerts found.'),
});
export type PredictiveLowStockAlertsOutput = z.infer<typeof PredictiveLowStockAlertsOutputSchema>;

/**
 * Genkit Tool: predictLowStock
 * Predicts which products are likely to run out of stock within a given number of days
 * based on historical sales and current inventory.
 */
const predictLowStock = ai.defineTool(
  {
    name: 'predictLowStock',
    description: 'Predicts which products are likely to run out of stock within a given number of days based on historical sales and current inventory.',
    inputSchema: PredictiveLowStockAlertsInputSchema,
    outputSchema: z.array(LowStockAlertSchema).describe('An array of low stock alerts.'),
  },
  async (input) => {
    const alerts: z.infer<typeof LowStockAlertSchema>[] = [];
    const { products, predictionDays } = input;

    for (const product of products) {
      let averageDailySales = 0;
      if (product.historicalDailySales.length > 0) {
        const totalSales = product.historicalDailySales.reduce((sum, sales) => sum + sales, 0);
        averageDailySales = totalSales / product.historicalDailySales.length;
      }

      let predictedDaysRemaining: number;

      if (product.currentStock <= 0) { // Already out or no stock
        predictedDaysRemaining = 0;
      } else if (averageDailySales === 0) { // No sales, and has stock
        predictedDaysRemaining = Infinity; // Effectively will not run out
      } else {
        predictedDaysRemaining = product.currentStock / averageDailySales;
      }

      // Only add to alerts if it's predicted to run out within the window (or already out)
      if (predictedDaysRemaining <= predictionDays) {
        alerts.push({
          productId: product.id,
          productName: product.name,
          currentStock: product.currentStock,
          averageDailySales: parseFloat(averageDailySales.toFixed(2)),
          predictedDaysRemaining: parseFloat(predictedDaysRemaining.toFixed(2)),
        });
      }
    }
    return alerts;
  }
);


/**
 * Genkit Prompt: lowStockAlertPrompt
 * Uses the 'predictLowStock' tool to generate a summary of low stock alerts.
 */
const prompt = ai.definePrompt({
  name: 'lowStockAlertPrompt',
  tools: [predictLowStock],
  input: { schema: PredictiveLowStockAlertsInputSchema },
  output: { schema: PredictiveLowStockAlertsOutputSchema },
  system: `You are an AI assistant for a CRM system specialized in inventory management.
Your task is to identify products that are predicted to run out of stock soon.
You have access to a tool named 'predictLowStock' that can perform this analysis.
Always use this tool to determine which products are low on stock based on the provided data and prediction window.
After getting the results from the tool, provide a concise summary of the low stock alerts found.
If no products are predicted to run out of stock, state that clearly and reassuringly.`,
  prompt: `Please analyze the inventory data and historical sales to predict which products will run out of stock within the next {{{predictionDays}}} days.
Based on the analysis, provide a summary of your findings.`,
});

/**
 * Genkit Flow: predictiveLowStockAlertsFlow
 * Orchestrates the prediction of low stock items and generates a summary.
 */
const predictiveLowStockAlertsFlow = ai.defineFlow(
  {
    name: 'predictiveLowStockAlertsFlow',
    inputSchema: PredictiveLowStockAlertsInputSchema,
    outputSchema: PredictiveLowStockAlertsOutputSchema,
  },
  async (input) => {
    // The prompt will automatically call the 'predictLowStock' tool and use its output
    // to generate the final summary based on the system instructions.
    const { output } = await prompt(input);
    return output!;
  }
);

/**
 * Wrapper function for the predictiveLowStockAlertsFlow.
 * Initiates the prediction of low stock items and returns a summary of alerts.
 * @param input - The input containing product data and prediction days.
 * @returns A promise that resolves to the low stock alerts and a summary.
 */
export async function getPredictiveLowStockAlerts(input: PredictiveLowStockAlertsInput): Promise<PredictiveLowStockAlertsOutput> {
  return predictiveLowStockAlertsFlow(input);
}
