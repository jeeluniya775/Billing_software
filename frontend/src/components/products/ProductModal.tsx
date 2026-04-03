'use client';

import { useState } from 'react';
import { useForm as useRHForm } from 'react-hook-form';
import type { Resolver } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger,
} from '@/components/ui/dialog';
import {
  Form, FormControl, FormField, FormItem, FormLabel, FormMessage,
} from '@/components/ui/form';
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { PlusCircle, Image as ImageIcon, CheckCircle2, Package, Tag, Calculator, BarChart3, Scan } from 'lucide-react';
import { productsService, Product } from '@/services/products.service';
import { BarcodeScanner } from './BarcodeScanner';

const productSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  sku: z.string().min(2, 'SKU is required'),
  category: z.string().min(1, 'Category is required'),
  description: z.string().optional(),
  imageUrl: z.string().url('Invalid image URL').optional().or(z.literal('')),
  unit: z.string().min(1, 'Unit is required'),
  price: z.coerce.number().min(0, 'Price must be positive'),
  costPrice: z.coerce.number().min(0).optional(),
  taxRate: z.coerce.number().min(0).max(100).default(0),
  stock: z.coerce.number().min(0).default(0),
  lowStockAlert: z.coerce.number().min(0).default(5),
  isActive: z.boolean().default(true),
});

type ProductFormValues = z.infer<typeof productSchema>;

interface ProductModalProps {
  product?: Product;
  onSuccess?: () => void;
  trigger?: React.ReactNode;
}

export function ProductModal({ product, onSuccess, trigger }: ProductModalProps) {
  const [open, setOpen] = useState(false);
  const [showScanner, setShowScanner] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useRHForm<ProductFormValues>({
    resolver: zodResolver(productSchema) as unknown as Resolver<ProductFormValues>,
    defaultValues: product ? {
      name: product.name,
      sku: product.sku,
      category: product.category,
      description: product.description || '',
      imageUrl: product.imageUrl || '',
      unit: product.unit,
      price: product.price,
      costPrice: product.costPrice || 0,
      taxRate: product.taxRate,
      stock: product.stock,
      lowStockAlert: product.lowStockAlert,
      isActive: product.isActive,
    } : {
      name: '',
      sku: '',
      category: '',
      description: '',
      imageUrl: '',
      unit: 'piece',
      price: 0,
      costPrice: 0,
      taxRate: 0,
      stock: 0,
      lowStockAlert: 5,
      isActive: true,
    },
  });

  async function onSubmit(values: ProductFormValues) {
    setIsSubmitting(true);
    try {
      if (product) {
        await productsService.update(product.id, values);
      } else {
        await productsService.create(values);
      }
      setOpen(false);
      form.reset();
      onSuccess?.();
    } catch (error) {
      console.error('Action failed:', error);
      alert('Failed to save product');
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button className="bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg shadow-sm">
            <PlusCircle className="mr-2 h-4 w-4" /> Add Product
          </Button>
        )}
      </DialogTrigger>

      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto w-full">
        <DialogHeader className="mb-2">
          <DialogTitle className="text-xl">{product ? 'Edit Product' : 'Add New Product'}</DialogTitle>
          <DialogDescription>
            {product ? 'Update existing product details, pricing, and stock.' : 'Add a new inventory item with pricing, tax, and images.'}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            
            {/* Basic Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField control={form.control} name="name" render={({ field }) => (
                <FormItem>
                  <FormLabel>Product Name</FormLabel>
                  <FormControl><Input placeholder="e.g. Wireless Mouse..." {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )} />
              <FormField control={form.control} name="sku" render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex justify-between">
                    SKU / Barcode
                    <Dialog open={showScanner} onOpenChange={setShowScanner}>
                      <DialogTrigger asChild>
                        <button type="button" className="text-[10px] flex items-center gap-1 text-emerald-600 hover:text-emerald-700 font-semibold uppercase tracking-wider">
                          <Scan className="h-3 w-3" /> Scan Barcode
                        </button>
                      </DialogTrigger>
                      <DialogContent className="max-w-md">
                        <DialogHeader>
                          <DialogTitle>Scan Barcode</DialogTitle>
                          <DialogDescription>Use your camera or upload an image to read a barcode.</DialogDescription>
                        </DialogHeader>
                        <BarcodeScanner 
                          onDetected={(code) => {
                            form.setValue('sku', code);
                            setShowScanner(false);
                          }}
                          onClose={() => setShowScanner(false)}
                        />
                      </DialogContent>
                    </Dialog>
                  </FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Input placeholder="e.g. WH-100-M1..." {...field} />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )} />
              <FormField control={form.control} name="category" render={({ field }) => (
                <FormItem>
                  <FormLabel>Category</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl><SelectTrigger><SelectValue placeholder="Select category" /></SelectTrigger></FormControl>
                    <SelectContent>
                      {['Electronics', 'Furniture', 'Clothing', 'Services', 'Others'].map(cat => (
                        <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )} />
              <FormField control={form.control} name="unit" render={({ field }) => (
                <FormItem>
                  <FormLabel>Unit of Measure</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl><SelectTrigger><SelectValue /></SelectTrigger></FormControl>
                    <SelectContent>
                      {['piece', 'box', 'kg', 'liter', 'hour', 'service'].map(u => (
                        <SelectItem key={u} value={u}>{u}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )} />
            </div>

            <FormField control={form.control} name="description" render={({ field }) => (
              <FormItem>
                <FormLabel>Description</FormLabel>
                <FormControl><Textarea placeholder="Detailed product description..." className="resize-none" {...field} /></FormControl>
                <FormMessage />
              </FormItem>
            )} />

            {/* Pricing */}
            <div className="bg-neutral-50 dark:bg-neutral-900/50 p-4 rounded-xl space-y-4">
              <h3 className="text-sm font-semibold flex items-center gap-2"><Calculator className="h-4 w-4 text-emerald-600" /> Pricing & Tax</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <FormField control={form.control} name="price" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Selling Price ($)</FormLabel>
                    <FormControl><Input type="number" step="0.01" {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
                <FormField control={form.control} name="costPrice" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Cost Price ($)</FormLabel>
                    <FormControl><Input type="number" step="0.01" {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
                <FormField control={form.control} name="taxRate" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tax Rate (%)</FormLabel>
                    <FormControl><Input type="number" step="0.1" {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
              </div>
            </div>

            {/* Inventory */}
            <div className="bg-neutral-50 dark:bg-neutral-900/50 p-4 rounded-xl space-y-4">
              <h3 className="text-sm font-semibold flex items-center gap-2"><Package className="h-4 w-4 text-amber-600" /> Inventory / Stock</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField control={form.control} name="stock" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Opening Stock</FormLabel>
                    <FormControl><Input type="number" {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
                <FormField control={form.control} name="lowStockAlert" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Low Stock Alert Level</FormLabel>
                    <FormControl><Input type="number" {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
              </div>
            </div>

            {/* Image & Status */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField control={form.control} name="imageUrl" render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center gap-2"><ImageIcon className="h-4 w-4" /> Product Image URL</FormLabel>
                  <FormControl><Input placeholder="https://..." {...field} /></FormControl>
                  <p className="text-[10px] text-neutral-500 mt-1">Provide a public URL for the product image.</p>
                  <FormMessage />
                </FormItem>
              )} />
              <FormField control={form.control} name="isActive" render={({ field }) => (
                <FormItem className="flex items-center justify-between p-4 border border-neutral-200 dark:border-neutral-700 rounded-lg">
                  <div className="space-y-0.5">
                    <FormLabel className="text-sm font-medium">Available for Sale</FormLabel>
                    <p className="text-xs text-neutral-500">Uncheck to hide from catalog</p>
                  </div>
                  <FormControl><Switch checked={field.value} onCheckedChange={field.onChange} /></FormControl>
                </FormItem>
              )} />
            </div>

            <DialogFooter className="border-t border-neutral-200 dark:border-neutral-700 pt-4 mt-4">
              <Button type="button" variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
              <Button type="submit" className="bg-emerald-600 hover:bg-emerald-700 text-white min-w-[140px]" disabled={isSubmitting}>
                {isSubmitting ? 'Saving...' : <><CheckCircle2 className="mr-2 h-4 w-4" /> {product ? 'Update Product' : 'Save Product'}</>}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
