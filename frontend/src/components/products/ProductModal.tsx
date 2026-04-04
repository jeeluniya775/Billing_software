'use client';

import { useState, useEffect, useRef } from 'react';
import { useForm as useRHForm, Resolver } from 'react-hook-form';
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
import { 
  PlusCircle, Image as ImageIcon, CheckCircle2, Package, 
  Calculator, Scan, RefreshCw, Sparkles, X, Upload, Trash2
} from 'lucide-react';
import { productsService, Product } from '@/services/products.service';
import { uploadsService } from '@/services/uploads.service';
import { BarcodeScanner } from './BarcodeScanner';
import { useToast } from '@/hooks/use-toast';
import Image from 'next/image';

const productSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  sku: z.string().min(2, 'SKU is required'),
  category: z.string().min(1, 'Category is required'),
  description: z.string().optional(),
  imageUrl: z.string().optional().refine((val) => {
    if (!val) return true;
    if (val.startsWith('/uploads/')) return true;
    try { new URL(val); return true; } catch { return false; }
  }, {
    message: "Invalid image URL"
  }).or(z.literal('')),
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
  open?: boolean;
  setOpen?: (open: boolean) => void;
}

export function ProductModal({ 
  product, 
  onSuccess, 
  trigger,
  open: externalOpen,
  setOpen: setExternalOpen 
}: ProductModalProps) {
  const [internalOpen, setInternalOpen] = useState(false);
  const open = externalOpen !== undefined ? externalOpen : internalOpen;
  const setOpen = setExternalOpen !== undefined ? setExternalOpen : setInternalOpen;

  const [showScanner, setShowScanner] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

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

  useEffect(() => {
    if (product) {
      form.reset({
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
      });
    } else {
      form.reset({
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
      });
    }
  }, [product, form]);

  const imageUrl = form.watch('imageUrl');
  const [imgError, setImgError] = useState(false);

  // Reset error when URL changes
  useEffect(() => {
    setImgError(false);
  }, [imageUrl]);

  const transformImageUrl = (url: string) => {
    if (!url) return '';
    try {
      // Local Uploads (Proxy-compatible relative paths)
      if (url.startsWith('/uploads/')) {
        return url; 
      }
      
      // If full URL, handle cloud transformations
      if (url.startsWith('http')) {
        if (url.includes('drive.google.com')) {
          const id = url.match(/\/d\/([^\/]+)/)?.[1] || url.match(/[?&]id=([^&]+)/)?.[1];
          if (id) return `https://drive.google.com/uc?export=view&id=${id}`;
        }
        if (url.includes('dropbox.com')) {
          return url.replace('dl=0', 'dl=1');
        }
        return url;
      }

      return url;
    } catch {
      return url;
    }
  };

  const isValidUrl = (url: string) => {
    if (!url) return false;
    // Allow local upload paths and all http/https links
    if (url.startsWith('/uploads/') || url.startsWith('http')) return true;
    try {
      new URL(transformImageUrl(url));
      return true;
    } catch {
      return false;
    }
  };

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      toast({
        title: "Invalid file",
        description: "Please select an image file (PNG, JPG, WEBP).",
        variant: "destructive",
      });
      return;
    }

    setIsUploading(true);
    try {
      const response = await uploadsService.upload(file);
      if (response.success && response.url) {
        form.setValue('imageUrl', response.url);
        toast({
          title: "Upload Successful",
          description: "Your photo has been uploaded and applied.",
        });
      }
    } catch (error) {
      console.error('Upload failed:', error);
      toast({
        title: "Upload Failed",
        description: "Service rejected the file. Ensure it's under 5MB.",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const generateSKU = () => {
    const prefix = 'PROD';
    const random = Math.floor(1000 + Math.random() * 9000);
    form.setValue('sku', `${prefix}-${random}`);
    toast({
      title: "SKU Generated",
      description: "A unique product code has been assigned.",
    });
  };

  async function onSubmit(values: ProductFormValues) {
    setIsSubmitting(true);
    try {
      const entries = Object.entries(values).filter(([_, v]) => v !== "" && v !== null && v !== undefined);
      const payload: any = Object.fromEntries(entries);

      ['price', 'costPrice', 'taxRate', 'stock', 'lowStockAlert'].forEach(key => {
        if (payload[key] !== undefined) {
          payload[key] = Number(payload[key]);
        }
      });

      if (payload.imageUrl) {
        payload.imageUrl = transformImageUrl(payload.imageUrl);
      }

      if (payload.imageUrl && !isValidUrl(payload.imageUrl)) {
        delete payload.imageUrl;
      }

      if (product) {
        await productsService.update(product.id, payload);
        toast({
          title: "Product Updated",
          description: `${values.name} has been successfully updated.`,
          variant: "default",
        });
      } else {
        await productsService.create(payload);
        toast({
          title: "Success",
          description: `${values.name} added to your inventory.`,
        });
      }
      setOpen(false);
      form.reset();
      setTimeout(() => {
        onSuccess?.();
      }, 300);
    } catch (error: any) {
      console.error('Server Dispatch Failed:', error);
      
      const responseData = error?.response?.data;
      const backendMessage = responseData?.message;
      const errorMessage = Array.isArray(backendMessage) 
        ? backendMessage.join(' | ') 
        : backendMessage;

      toast({
        title: "Database Refused Data",
        description: errorMessage || "The server rejected this product entry. This is usually due to a duplicate SKU or invalid data format.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button className="bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl shadow-lg hover:shadow-emerald-500/20 transition-all active:scale-95 gap-2 px-6">
            <PlusCircle className="h-4 w-4" /> Add Product
          </Button>
        )}
      </DialogTrigger>

      <DialogContent className="max-w-4xl w-full p-0 border-none bg-white dark:bg-zinc-950 rounded-[2rem] shadow-2xl overflow-hidden">
        <div className="max-h-[90vh] overflow-y-auto">
          <DialogHeader className="p-0 border-b border-white/10 bg-emerald-600">
          <div className="p-8 pt-10 relative overflow-hidden">
            <div className="relative z-10">
              <DialogTitle className="text-3xl font-black text-white italic tracking-tighter flex items-center gap-3">
                {product ? 'EDIT PRODUCT' : 'ADD NEW PRODUCT'}
                <Sparkles className="h-6 w-6 text-emerald-300 animate-pulse" />
              </DialogTitle>
              <DialogDescription className="text-emerald-100/80 font-medium mt-2">
                {product ? 'Update existing product details, pricing, and stock.' : 'Register a new product in your inventory system.'}
              </DialogDescription>
            </div>
             <Sparkles className="absolute right-8 top-8 h-12 w-12 text-emerald-400 opacity-20 pointer-events-none" />
          </div>
          </DialogHeader>

          <Form {...form}>
            <form 
              onSubmit={form.handleSubmit(onSubmit, (errors) => {
                console.error('Validation errors:', errors);
                toast({
                  title: "Incomplete Resource Data",
                  description: "Please scroll up and fill in the required fields (Name, SKU, Category) at the top of the form.",
                  variant: "destructive",
                });
              })} 
              className="p-8 space-y-8"
            >
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-6">
                  <FormField control={form.control} name="name" render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-[10px] font-black uppercase tracking-widest text-neutral-400">Product Name</FormLabel>
                      <FormControl><Input placeholder="e.g. Wireless Mouse..." className="h-12 rounded-xl bg-neutral-50 dark:bg-neutral-900 border-none shadow-inner" {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />

                  <FormField control={form.control} name="sku" render={({ field }) => (
                    <FormItem>
                      <div className="flex justify-between items-center mb-1.5">
                         <FormLabel className="text-[10px] font-black uppercase tracking-widest text-neutral-400">SKU / BARCODE</FormLabel>
                         <div className="flex gap-4">
                            <button type="button" onClick={generateSKU} className="text-[10px] flex items-center gap-1.5 text-emerald-600 hover:text-emerald-700 font-black uppercase tracking-widest transition-colors">
                              <RefreshCw className="h-3 w-3" /> Magic Generate
                            </button>
                            <Dialog open={showScanner} onOpenChange={setShowScanner}>
                              <DialogTrigger asChild>
                                <button type="button" className="text-[10px] flex items-center gap-1.5 text-indigo-600 hover:text-indigo-700 font-black uppercase tracking-widest transition-colors">
                                  <Scan className="h-3 w-3" /> Scan Barcode
                                </button>
                              </DialogTrigger>
                              <DialogContent className="max-w-md rounded-3xl">
                                <DialogHeader>
                                  <DialogTitle>Scan Barcode</DialogTitle>
                                  <DialogDescription>Use your camera or upload an image to read a barcode.</DialogDescription>
                                </DialogHeader>
                                <BarcodeScanner 
                                  key={showScanner ? "scanner-active" : "scanner-idle"}
                                  onDetected={(code) => {
                                    form.setValue('sku', code);
                                    setTimeout(() => setShowScanner(false), 300);
                                  }}
                                  onClose={() => {
                                    setTimeout(() => setShowScanner(false), 300);
                                  }}
                                />
                              </DialogContent>
                            </Dialog>
                         </div>
                      </div>
                      <FormControl>
                        <Input placeholder="e.g. WH-100-M1..." className="h-12 rounded-xl bg-neutral-50 dark:bg-neutral-900 border-none shadow-inner font-mono text-xs uppercase" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />

                  <div className="grid grid-cols-2 gap-4">
                    <FormField control={form.control} name="category" render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-[10px] font-black uppercase tracking-widest text-neutral-400">Category</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value}>
                          <FormControl><SelectTrigger className="h-12 rounded-xl bg-neutral-50 dark:bg-neutral-900 border-none shadow-inner"><SelectValue placeholder="Select" /></SelectTrigger></FormControl>
                          <SelectContent className="rounded-xl">
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
                        <FormLabel className="text-[10px] font-black uppercase tracking-widest text-neutral-400">Unit</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value}>
                          <FormControl><SelectTrigger className="h-12 rounded-xl bg-neutral-50 dark:bg-neutral-900 border-none shadow-inner"><SelectValue /></SelectTrigger></FormControl>
                          <SelectContent className="rounded-xl">
                            {['piece', 'box', 'kg', 'liter', 'hour', 'service'].map(u => (
                              <SelectItem key={u} value={u}>{u}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )} />
                  </div>
                </div>

                <div className="space-y-6">
                  <div className="h-[238px] w-full bg-neutral-50 dark:bg-neutral-900 rounded-3xl border-2 border-dashed border-neutral-100 dark:border-neutral-800 flex flex-col items-center justify-center relative overflow-hidden group">
                     {imageUrl && isValidUrl(imageUrl) && !imgError ? (
                       <>
                         <img 
                           src={transformImageUrl(imageUrl)} 
                           alt="Preview" 
                           className="w-full h-full object-cover transition-transform group-hover:scale-105" 
                           onError={() => setImgError(true)}
                         />
                         <button 
                          type="button"
                          onClick={() => form.setValue('imageUrl', '')}
                          className="absolute top-4 right-4 bg-white/80 dark:bg-black/80 backdrop-blur-md p-2 rounded-full text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                         >
                           <X className="h-4 w-4" />
                         </button>
                       </>
                     ) : (
                       <div className="text-center p-6 flex flex-col items-center">
                          <Package className="h-10 w-10 opacity-20" />
                          <span className="text-[10px] font-medium uppercase tracking-widest opacity-50">No Image Preview</span>
                          <p className="text-[8px] text-center px-4 leading-relaxed opacity-40">
                            Enter a direct image URL (jpg, png) below to see your product image here.
                          </p>
                       </div>
                     )}
                  </div>
                  <FormField control={form.control} name="imageUrl" render={({ field }) => (
                    <FormItem>
                      <div className="flex gap-2">
                        <FormControl><Input placeholder="https://images.unsplash.com/photo-..." className="h-12 rounded-xl bg-neutral-50 dark:bg-neutral-800 border-none shadow-inner" {...field} /></FormControl>
                        <input 
                          type="file" 
                          ref={fileInputRef} 
                          className="hidden" 
                          accept="image/*" 
                          onChange={handleFileChange} 
                        />
                        <Button 
                          type="button" 
                          variant="outline" 
                          className="h-12 w-12 rounded-xl flex-shrink-0 border-dashed border-2 hover:bg-emerald-50 hover:border-emerald-200 transition-all group"
                          onClick={() => fileInputRef.current?.click()}
                          disabled={isUploading}
                        >
                          {isUploading ? (
                            <RefreshCw className="h-4 w-4 animate-spin text-emerald-600" />
                          ) : (
                            <Upload className="h-4 w-4 text-emerald-500 group-hover:scale-110 transition-transform" />
                          )}
                        </Button>
                      </div>
                      <p className="text-[9px] text-neutral-400 font-medium px-1">
                        Tip: Right-click an image and select <span className="text-emerald-600 font-bold">'Copy Image Address'</span> or upload from device.
                      </p>
                      <FormMessage className="text-[10px]" />
                    </FormItem>
                  )} />
                </div>
              </div>

              <FormField control={form.control} name="description" render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-[10px] font-black uppercase tracking-widest text-neutral-400">Detailed Description</FormLabel>
                  <FormControl><Textarea placeholder="How would you describe this item to a client?" className="min-h-[100px] rounded-2xl bg-neutral-50 dark:bg-neutral-900 border-none shadow-inner resize-none p-4" {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )} />

              {/* Pricing Section */}
              <div className="bg-neutral-50 dark:bg-neutral-900/50 p-6 rounded-3xl space-y-6">
                <h3 className="text-xs font-black uppercase tracking-[0.2em] flex items-center gap-3 text-indigo-600"><Calculator className="h-4 w-4" /> Financial Configuration</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <FormField control={form.control} name="price" render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-[10px] font-black uppercase tracking-widest text-neutral-400">Selling Price ($)</FormLabel>
                      <FormControl><Input type="number" step="0.01" className="h-12 bg-white dark:bg-neutral-950 border-none shadow-sm rounded-xl font-bold" {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                  <FormField control={form.control} name="costPrice" render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-[10px] font-black uppercase tracking-widest text-neutral-400">Unit Cost ($)</FormLabel>
                      <FormControl><Input type="number" step="0.01" className="h-12 bg-white dark:bg-neutral-950 border-none shadow-sm rounded-xl font-bold" {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                  <FormField control={form.control} name="taxRate" render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-[10px] font-black uppercase tracking-widest text-neutral-400">Global Tax (%)</FormLabel>
                      <FormControl><Input type="number" step="0.1" className="h-12 bg-white dark:bg-neutral-950 border-none shadow-sm rounded-xl font-bold" {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                </div>
              </div>

              {/* Inventory Section */}
              <div className="bg-amber-50/50 dark:bg-amber-950/10 p-6 rounded-3xl space-y-6">
                <h3 className="text-xs font-black uppercase tracking-[0.2em] flex items-center gap-3 text-amber-600"><Package className="h-4 w-4" /> Inventory Management</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField control={form.control} name="stock" render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-[10px] font-black uppercase tracking-widest text-neutral-400">Operational Stock</FormLabel>
                      <FormControl><Input type="number" className="h-12 bg-white dark:bg-neutral-950 border-none shadow-sm rounded-xl font-bold" {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                  <FormField control={form.control} name="lowStockAlert" render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-[10px] font-black uppercase tracking-widest text-neutral-400">Critical Alert Limit</FormLabel>
                      <FormControl><Input type="number" className="h-12 bg-white dark:bg-neutral-950 border-none shadow-sm rounded-xl font-bold" {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                </div>
              </div>

              <div className="flex flex-col md:flex-row items-center justify-between gap-6 pt-4 border-t border-neutral-100 dark:border-neutral-800">
                 <FormField control={form.control} name="isActive" render={({ field }) => (
                  <FormItem className="flex items-center gap-4 bg-white dark:bg-neutral-950 p-4 px-6 border-none shadow-sm rounded-full">
                    <div className="space-y-0.5">
                      <FormLabel className="text-[10px] font-black uppercase tracking-widest text-neutral-400 leading-none">Catalog Status</FormLabel>
                      <p className="text-[9px] font-bold text-emerald-600 uppercase">Available for Sale</p>
                    </div>
                    <FormControl><Switch checked={field.value} onCheckedChange={field.onChange} /></FormControl>
                  </FormItem>
                 )} />

                 <div className="flex gap-4 w-full md:w-auto">
                   <Button type="button" variant="outline" className="flex-1 md:flex-none h-14 px-8 rounded-full font-black uppercase tracking-widest text-[10px] border-none bg-neutral-100 hover:bg-neutral-200 transition-all" onClick={() => setOpen(false)}>
                      Archive Action
                   </Button>
                   <Button type="submit" className="flex-1 md:flex-none h-14 px-10 bg-emerald-600 hover:bg-emerald-700 text-white rounded-full font-black uppercase tracking-widest text-[10px] shadow-xl shadow-emerald-600/20 active:scale-95 transition-all" disabled={isSubmitting}>
                     {isSubmitting ? 'Processing...' : <><CheckCircle2 className="mr-2 h-4 w-4" /> {product ? 'Sync Asset' : 'Confirm Entry'}</>}
                   </Button>
                 </div>
              </div>
            </form>
          </Form>
        </div>
      </DialogContent>

    </Dialog>
  );
}
