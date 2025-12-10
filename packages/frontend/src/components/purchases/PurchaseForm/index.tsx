import React, { useEffect, useState } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
// import Button from '../../common/Button';
// import Input from '../../common/Input';
// import Select from '../../common/Select';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { SelectWrapper as Select } from '@/components/ui/SelectWrapper';
import { useApi } from '../../../hooks/useApi';
import { PurchaseOrder, Vendor, Product } from '../../../types';
import { toast } from 'sonner';
import { Plus, Trash2 } from 'lucide-react';

// ------------------ Schemas ------------------
const purchaseItemSchema = z.object({
  productId: z.string().min(1, 'Product is required'),
  description: z.string().min(1, 'Description is required'),
  quantity: z.number().min(1, 'Quantity is required'),
  unit: z.string().min(1, 'Unit is required'),
  unitPrice: z.number().min(0.01, 'Unit Price is required'),
  discount: z.number().min(0).max(100).default(0),
  taxType: z.enum(["CGST_SGST", "IGST"], { required_error: "Tax Type is required" }),
  taxRate: z.number().min(0).max(100).default(0),
  cess: z.boolean().default(false),
  cessRate: z.number().min(0).max(100).optional(),
  tenantId: z.string().optional(),
});

const purchaseOrderSchema = z.object({
  vendorId: z.string().min(1, 'Vendor is required'),
  type: z.enum(['product', 'service', 'expense'], {
    required_error: 'Type is required',
    invalid_type_error: 'Type is required',
  }),
  orderDate: z.string().min(1, 'Order Date is required'),
  expectedDeliveryDate: z.string().optional(),
  shippingAddress: z.string().optional(),
  billingAddress: z.string().optional(),
  termsAndConditions: z.string().optional(),
  notes: z.string().optional(),
  // 27-11-2025
  // paymentMethod: z.string().min(1, "Payment Method is required"),
  // amountPaid: z.number(),
  // balanceDue: z.number(),
  paymentMethod: z.string().min(1, "Payment Method is required"),
  amountPaid: z.number().nonnegative(),
  balanceDue: z.number().nonnegative(),
  items: z.array(purchaseItemSchema).min(1, 'At least one item is required'),
});

type PurchaseFormData = z.infer<typeof purchaseOrderSchema>;

// ------------------ Props ------------------
interface PurchaseFormProps {
  purchaseOrder?: PurchaseOrder | null;
  onSuccess: () => void;
  onCancel: () => void;
}

// ------------------ Component ------------------
const PurchaseForm: React.FC<PurchaseFormProps> = ({
  purchaseOrder,
  onSuccess,
  onCancel
}) => {
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  // const { post, put, get } = useApi<PurchaseOrder>();

  const purchaseApi = useApi<PurchaseOrder>();
  const vendorApi = useApi<Vendor[]>();
  const productApi = useApi<Product[]>();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
    control,
    watch,
    setValue,
  } = useForm<PurchaseFormData>({
    resolver: zodResolver(purchaseOrderSchema),
    defaultValues: {
      type: undefined,
      vendorId: '',
      orderDate: new Date().toISOString().split('T')[0],
      paymentMethod: 'cash',      // NEW
      amountPaid: 0,          // NEW
      balanceDue: 0,           // NEW
      items: [{
        productId: '',
        description: '',
        quantity: 1,
        unit: 'pcs',
        unitPrice: 0,
        discount: 0,
        taxType: 'CGST_SGST',  // default
        taxRate: 0,
        cess: false,
        cessRate: 0,
      }]
    }
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'items'
  });

  const items = watch('items');

  // ------------------ Fetch Vendors & Products ------------------
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [vendorsResponse, productsResponse] = await Promise.all([
          vendorApi.get('/api/vendors?limit=100'),
          productApi.get('/api/products?limit=100')
        ]);

        // ✅ Safely extract arrays no matter the API shape
        const vendorsData = Array.isArray(vendorsResponse)
          ? vendorsResponse
          : Array.isArray((vendorsResponse as any)?.data)
            ? (vendorsResponse as any).data
            : [];

        const productsData = Array.isArray(productsResponse)
          ? productsResponse
          : Array.isArray((productsResponse as any)?.data)
            ? (productsResponse as any).data
            : [];

        setVendors(vendorsData);
        setProducts(productsData);
      } catch (error) {
        console.error('Failed to fetch data:', error);
        toast.error('Failed to load form data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // 👉 Add this here:
  const isEdit = !!purchaseOrder;

  // ------------------ Reset with existing order ------------------
  useEffect(() => {
    if (purchaseOrder) {
      console.log(purchaseOrder);
      reset({
        vendorId: purchaseOrder.vendorId || '',
        type: purchaseOrder.type,
        orderDate: purchaseOrder.orderDate.split('T')[0],
        expectedDeliveryDate: purchaseOrder.expectedDeliveryDate?.split('T')[0],
        shippingAddress: purchaseOrder.shippingAddress,
        billingAddress: purchaseOrder.billingAddress,
        termsAndConditions: purchaseOrder.termsAndConditions,
        notes: purchaseOrder.notes,
        amountPaid: purchaseOrder.amountPaid,
        balanceDue: purchaseOrder.balanceDue,
        paymentMethod: purchaseOrder.paymentMethod,
        items: purchaseOrder.items.map(item => ({
          productId: item.productId ?? '',
          description: item.description,
          quantity: Number(item.quantity) || 1,
          unit: item.unit ?? 'pcs',
          unitPrice: Number(item.unitPrice) || 0,
          discount: Number(item.discount) || 0,
          // taxType: item.taxType ?? "CGST_SGST",
          taxType: (item.taxType ?? "CGST_SGST") as "CGST_SGST" | "IGST",
          taxRate: Number(item.taxRate) || 0,
          cess: item.cess ?? false,
          cessRate: Number(item.cessRate) || 0,
        }))
      });
    }
  }, [purchaseOrder, reset]);

  // ------------------ Helpers ------------------
  const calculateItemTotals = (item: any) => {
    const discountAmount = (item.unitPrice * item.quantity * item.discount) / 100;
    const taxableAmount = (item.unitPrice * item.quantity) - discountAmount;
    const taxAmount = (taxableAmount * item.taxRate) / 100;
    const cessAmount = item.cess
      ? (taxableAmount * (item.cessRate || 0)) / 100
      : 0;
    // const lineTotal = taxableAmount + taxAmount;
    const lineTotal = taxableAmount + taxAmount + cessAmount;
    return { discountAmount, taxAmount, cessAmount, lineTotal };
  };

  const calculateOrderTotals = (items: any[]) => {
    let subTotal = 0, taxTotal = 0, discountTotal = 0, cessTotal = 0;
    items.forEach(item => {
      const totals = calculateItemTotals(item);
      subTotal += item.unitPrice * item.quantity;
      discountTotal += totals.discountAmount;
      taxTotal += totals.taxAmount;
      cessTotal += totals.cessAmount;
    });
    return { subTotal, taxTotal, cessTotal, discountTotal, totalAmount: subTotal - discountTotal + taxTotal + cessTotal };
  };

  const handleProductChange = (index: number, productId: string) => {
    const product = products.find(p => p.id === productId);
    if (product) {
      setValue(`items.${index}.productId`, product.id);
      setValue(`items.${index}.description`, product.name);
      setValue(`items.${index}.unitPrice`, product.costPrice);
      setValue(`items.${index}.unit`, product.unit || 'pcs');
      setValue(`items.${index}.taxRate`, product.taxRate || 0);
    }
  };

  // ------------------ Submit ------------------
  const onSubmit = async (data: PurchaseFormData) => {
    console.log("📦 SUBMITTING FORM DATA:", data);

    // --- CESS VALIDATION ---
    for (const item of data.items) {
      if (item.cess) {
        if (!item.cessRate || Number(item.cessRate) <= 0) {
          toast.error("Cess Rate must be greater than 0 when CESS is enabled");
          return;
        }
      }
    }

    // Calculate totals again
    const items = data.items || [];
    const { totalAmount } = calculateOrderTotals(items);

    // --- FINAL VALIDATION CHECK BEFORE SUBMIT ---
    // if (data.amountPaid < 0) {
    //   toast.error("Amount cannot be less than 0");
    //   return; // 
    // }

    if (data.amountPaid > totalAmount) {
      toast.error("Amount cannot be greater than Total Amount");
      return; //
    }
    // ------------------------------------------------

    try {
      // Calculate due amount
      const balanceDue = Math.max(totals.totalAmount - (data.amountPaid || 0), 0).toFixed(2);
      const payload = {
        ...data,
        orderDate: new Date(data.orderDate).toISOString(),
        expectedDeliveryDate: data.expectedDeliveryDate
          ? new Date(data.expectedDeliveryDate).toISOString()
          : undefined,
        balanceDue
      };
      console.log("🚀 FINAL PAYLOAD SENT TO API:", payload);

      if (purchaseOrder?.id) {
        await purchaseApi.put(`/api/purchases/${purchaseOrder.id}`, payload);
        toast.success('Purchase order updated successfully');
      } else {
        await purchaseApi.post('/api/purchases', payload);
        toast.success('Purchase order created successfully');
      }
      onSuccess();
    } catch (error: any) {
      console.error('Failed to save purchase order:', error);
      toast.error(error?.message || 'Failed to save purchase order');
    }
  };

  if (loading) return <div>Loading...</div>;

  const totals = calculateOrderTotals(items);

  const Required = () => <span className="text-red-500">*</span>;

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* Vendor + Type */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Vendor */}
        <div className="flex flex-col">
          <Select
            label={<span>Vendor <Required /></span>}
            value={watch('vendorId')}
            onChange={(value: string) => setValue('vendorId', value)}
            options={vendors.map(v => ({ value: v.id, label: v.name }))}
          />
          {errors.vendorId && (
            <p className="text-red-500 text-sm mt-1">{errors.vendorId.message}</p>
          )}
        </div>

        {/* Type */}
        <div className="flex flex-col">
          <Select
            label={<span>Type <Required /></span>}
            value={watch('type')}
            onChange={(value: string) => setValue('type', value as 'product' | 'service' | 'expense')}
            options={[
              { value: 'product', label: 'Product' },
              { value: 'service', label: 'Service' },
              { value: 'expense', label: 'Expense' }
            ]}
          />
          {errors.type && (
            <p className="text-red-500 text-sm mt-1">{errors.type.message}</p>
          )}
        </div>
      </div>

      {/* Dates */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="flex flex-col">
          <Input
            // label="Order Date"
            label={<span>Order Date <Required /></span>}
            type="date"
            {...register('orderDate')}
            error={errors.orderDate?.message}
            disabled={isSubmitting}
          />
        </div>
        <Input
          label="Expected Delivery Date"
          type="date"
          {...register('expectedDeliveryDate')}
          error={errors.expectedDeliveryDate?.message}
          disabled={isSubmitting}
        />
      </div>

      {/* Items */}
      <div className="border-t pt-4">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Items</h3>
        {fields.map((field, index) => (
          <div key={field.id} className="border rounded-lg p-4 mb-4">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
              <div className="md:col-span-4 flex flex-col">
                <Select
                  label={<span>Product <Required /></span>}
                  value={watch(`items.${index}.productId`)}
                  onChange={(value) => {
                    setValue(`items.${index}.productId`, value);
                    handleProductChange(index, value);
                  }}
                  options={products.map(p => ({ value: p.id, label: p.name }))}
                />
                {errors.items?.[index]?.productId && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.items[index]?.productId?.message}
                  </p>
                )}
              </div>

              <div className="md:col-span-4">
                <Input
                  label={<span>Description <Required /></span>}
                  {...register(`items.${index}.description`)}
                  error={errors.items?.[index]?.description?.message}
                  disabled={isSubmitting}
                />
              </div>

              <div className="md:col-span-2">
                <Input
                  label={<span>Quantity <Required /></span>}
                  type="number"
                  step="0.01"
                  {...register(`items.${index}.quantity`, { valueAsNumber: true })}
                  error={errors.items?.[index]?.quantity?.message}
                  disabled={isSubmitting}
                />
              </div>

              <div className="md:col-span-2">
                <Input
                  label={<span>Unit <Required /></span>}
                  {...register(`items.${index}.unit`)}
                  error={errors.items?.[index]?.unit?.message}
                  disabled={isSubmitting}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-12 gap-4 mt-4">
              <div className="md:col-span-2">
                <Input
                  label={<span>Unit Price (₹) <Required /></span>}
                  type="number"
                  step="0.01"
                  {...register(`items.${index}.unitPrice`, { valueAsNumber: true })}
                  error={errors.items?.[index]?.unitPrice?.message}
                  disabled={isSubmitting}
                />
              </div>
              <div className="md:col-span-2">
                <Input
                  label="Discount (%)"
                  type="number"
                  step="0.01"
                  {...register(`items.${index}.discount`, { valueAsNumber: true })}
                  error={errors.items?.[index]?.discount?.message}
                  disabled={isSubmitting}
                />
              </div>
              <div className="md:col-span-2 flex flex-col">
                <Select
                  label="Tax Type"
                  value={watch(`items.${index}.taxType`)}
                  onChange={(value) => {
                    setValue(`items.${index}.taxType`, value as "CGST_SGST" | "IGST");
                  }}
                  options={[
                    { value: "CGST_SGST", label: "CGST & SGST" },
                    { value: "IGST", label: "IGST" },
                  ]}
                />
                {errors.items?.[index]?.taxType && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.items[index]?.taxType?.message}
                  </p>
                )}
              </div>
              <div className="md:col-span-2">
                <Input
                  label="Tax Rate (%)"
                  type="number"
                  step="0.01"
                  {...register(`items.${index}.taxRate`, { valueAsNumber: true })}
                  error={errors.items?.[index]?.taxRate?.message}
                  disabled={isSubmitting}
                />
              </div>
              {/* CESS Checkbox */}
              <div className="md:col-span-1">
                <input
                  type="checkbox"
                  checked={watch(`items.${index}.cess`)}
                  onChange={(e) => setValue(`items.${index}.cess`, e.target.checked)}
                  className="mr-2"
                />CESS
              </div>

              {watch(`items.${index}.cess`) && (
                <div className="md:col-span-3">
                  <Input
                    label={<span>CESS Rate (%) <Required /></span>}
                    type="number"
                    step="0.01"
                    {...register(`items.${index}.cessRate`, { valueAsNumber: true })}
                    error={errors.items?.[index]?.cessRate?.message}
                    disabled={isSubmitting}
                  />
                </div>
              )}
              {/* CESS Rate (Only show when CESS is checked) */}
              <div className="md:col-span-3">
                <Input
                  label="Line Total (₹)"
                  type="number"
                  value={calculateItemTotals(items[index]).lineTotal.toFixed(2)}
                  disabled
                  className="bg-gray-50"
                />
              </div>
              <div className="md:col-span-2 flex items-end">
                {fields.length > 1 && (
                  <Button
                    type="button"
                    variant="danger"
                    onClick={() => remove(index)}
                    disabled={isSubmitting}
                    className="w-full"
                  >
                    <Trash2 size={16} />
                  </Button>
                )}
              </div>
            </div>
          </div>
        ))}
        <Button
          type="button"
          variant="outline"
          onClick={() => append({
            productId: '',
            description: '',
            quantity: 1,
            unit: 'pcs',
            unitPrice: 0,
            discount: 0,
            taxType: 'CGST_SGST',
            taxRate: 0,
            cess: false,
            cessRate: 0
          })}
          disabled={isSubmitting}
          className="mt-2"
        >
          <Plus size={16} className="mr-2" /> Add Item
        </Button>
      </div>

      {/* Order Summary */}
      <div className="border-t pt-4">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Order Summary</h3>
        <div className="grid grid-cols-2 gap-4 max-w-md ml-auto">
          <div className="text-right">Subtotal:</div>
          <div className="text-right font-medium">₹{totals.subTotal.toFixed(2)}</div>
          <div className="text-right">Discount:</div>
          <div className="text-right font-medium text-red-600">-₹{totals.discountTotal.toFixed(2)}</div>
          <div className="text-right">Tax:</div>
          <div className="text-right font-medium">+₹{totals.taxTotal.toFixed(2)}</div>
          <div className="text-right">CESS:</div>
          <div className="text-right font-medium">+₹{totals.cessTotal.toFixed(2)}</div>
          <div className="text-right border-t pt-2 font-semibold">Total:</div>
          <div className="text-right border-t pt-2 font-semibold">₹{totals.totalAmount.toFixed(2)}</div>
          <div className="text-right border-t pt-2">Payment Method:</div>
          <div className="text-right border-t pt-2">
            <div className="flex flex-col">
              <Select
                value={watch('paymentMethod')}
                onChange={(value) => setValue('paymentMethod', value)}
                options={[
                  { value: 'cash', label: 'Cash' },
                  { value: 'bank_transfer', label: 'Bank Transfer' },
                  { value: 'upi', label: 'UPI' },
                  { value: 'cheque', label: 'Cheque' },
                  { value: 'credit_card', label: 'Credit Card' },
                  { value: 'debit_card', label: 'Debit Card' },
                  { value: 'wallet', label: 'Wallet' },
                  { value: 'other', label: 'Other' }
                ]}
              />
              {errors.paymentMethod && (
                <p className="text-red-500 text-sm mt-1">{errors.paymentMethod.message}</p>
              )}
            </div>
          </div>
          <div className="text-right">Payment Amount (₹):</div>
          <div className="text-right">
            <div className="flex flex-col">
              <Input
                type="number"
                step="0.01"
                {...register('amountPaid', {
                  valueAsNumber: true
                })}
                error={errors.amountPaid?.message}
                disabled={isSubmitting}
                readOnly={isEdit}
              />
            </div>
          </div>
          <div className="text-right border-t pt-2 font-semibold">Due Amount:</div>
          <div className="text-right border-t pt-2 font-semibold">₹{Math.max(totals.totalAmount - (watch('amountPaid') || 0), 0).toFixed(2)}
            {/* <Input
              type="number"
              value={Math.max(totals.totalAmount - (watch('amountPaid') || 0), 0).toFixed(2)}
              disabled
              className="bg-gray-50"
            /> */}
            <input
              type="hidden"
              {...register("balanceDue", { valueAsNumber: true })}
              value={Math.max(totals.totalAmount - (watch("amountPaid") || 0), 0).toFixed(2)}
            />
          </div>
        </div>
      </div>

      {/* Address & Notes */}
      <div className="grid grid-cols-1 gap-4">
        <Input
          label="Shipping Address"
          {...register('shippingAddress')}
          error={errors.shippingAddress?.message}
          disabled={isSubmitting}
        // multiline
        />
        <Input
          label="Billing Address"
          {...register('billingAddress')}
          error={errors.billingAddress?.message}
          disabled={isSubmitting}
        // multiline
        />
        <Input
          label="Terms & Conditions"
          {...register('termsAndConditions')}
          error={errors.termsAndConditions?.message}
          disabled={isSubmitting}
        // multiline
        />
        <Input
          label="Notes"
          {...register('notes')}
          error={errors.notes?.message}
          disabled={isSubmitting}
        // multiline
        />
      </div>

      {/* Actions */}
      <div className="flex justify-end space-x-3 pt-4">
        <Button type="button" variant="outline" onClick={onCancel} disabled={isSubmitting}>
          Cancel
        </Button>
        <Button type="submit" isLoading={isSubmitting}>
          {purchaseOrder ? 'Update Purchase Order' : 'Create Purchase Order'}
        </Button>
      </div>
    </form>
  );
};

export default PurchaseForm;



