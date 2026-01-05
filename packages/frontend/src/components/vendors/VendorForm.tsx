import React, { useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
// import Button from '../common/Button';
// import Input from '../common/Input';
// import Select from '../common/Select';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from '@/components/ui/Select';

import { useApi } from '../../hooks/useApi';
import { Vendor } from '../../types';
import { toast } from 'sonner';

const vendorSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Invalid email address').optional().or(z.literal('')),
  // phone: z.string().optional(),
  phone: z
    .string()
    .optional()
    .refine(
      (value) =>
        !value || /^[0-9]{10}$/.test(value),
      "Phone number must be 10 digits"
    ),
  type: z.enum(['supplier', 'service_provider', 'contractor']).default('supplier'),
  address: z.object({
    line1: z.string().min(1, 'Address is required'),
    line2: z.string().optional(),
    // city: z.string().min(1, 'City is required'),
    // state: z.string().min(1, 'State is required'),
    // postalCode: z.string().min(1, 'Postal code is required'),
    // country: z.string().min(1, 'Country is required'),
    city: z
      .string()
      .min(1, "City is required")
      .regex(/^[A-Za-z\s]+$/, "City must contain only letters"),

    state: z
      .string()
      .min(1, "State is required")
      .regex(/^[A-Za-z\s]+$/, "State must contain only letters"),

    postalCode: z
      .string()
      .min(6, "postalCode is required")
      .regex(/^[0-9]{6}$/, "postalCode must be exactly 6 digits"),

    country: z
      .string()
      .min(1, "Country is required")
      .regex(/^[A-Za-z\s]+$/, "Country must contain only letters"),
  }),
  // gstin: z.string().optional(),
  gstin: z
    .string()
    .refine(
      (value) =>
        value.length === 0 ||  // allow empty while typing
        /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/.test(value),
      "Invalid GST number"
    )
    .optional(),
  // pan: z.string().optional(),
  pan: z
    .string()
    .optional()
    .refine(
      (value) =>
        !value || /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/.test(value),
      "Invalid PAN number format"
    ),
  paymentTerms: z.string().optional(),
});

type VendorFormData = z.infer<typeof vendorSchema>;

interface VendorFormProps {
  vendor?: Vendor;
  onSuccess: () => void;
  onCancel: () => void;
}

const VendorForm: React.FC<VendorFormProps> = ({ vendor, onSuccess, onCancel }) => {
  const { post, put } = useApi<Vendor>();
  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
    reset
  } = useForm<VendorFormData>({
    resolver: zodResolver(vendorSchema),
    defaultValues: {
      type: 'supplier',
      address: { country: 'India' },
    },
  });

  useEffect(() => {
    if (vendor) {
      reset({
        name: vendor.name,
        email: vendor.email || '',
        phone: vendor.phone || '',
        type: vendor.type,
        gstin: vendor.gstin || '',
        pan: vendor.pan || '',
        paymentTerms: vendor.paymentTerms || '',
        address: {
          line1: vendor.billingAddress?.line1 || '',
          line2: vendor.billingAddress?.line2 || '',
          city: vendor.billingAddress?.city || '',
          state: vendor.billingAddress?.state || '',
          postalCode: vendor.billingAddress?.postalCode || '',
          country: vendor.billingAddress?.country || 'India',
        },
      });
    }
  }, [vendor, reset]);

  const onSubmit = async (data: VendorFormData) => {
    try {
      const payload = {
        ...data,
        email: data.email || undefined,
        gstin: data.gstin || undefined,
        pan: data.pan || undefined,
      };

      if (vendor?.id) {
        await put(`/api/vendors/${vendor.id}`, payload);
        toast.success('Vendor updated successfully');
      } else {
        await post(`/api/vendors`, payload);
        toast.success('Vendor created successfully');
      }

      onSuccess();
    } catch (error: any) {
      console.error('Failed to save vendor:', error);
      toast.error(error?.message || 'Failed to save vendor');
    }
  };

  const allowOnlyAlphabets = (e: React.FormEvent<HTMLInputElement>) => {
    e.currentTarget.value = e.currentTarget.value.replace(/[^A-Za-z]/g, "");
  };

  const Required = () => <span className="text-red-500">*</span>;

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input
          label={<span>Vendor Name <Required /></span>}
          {...register("name", {
            required: "Name is required",
            pattern: {
              value: /^[A-Za-z]+$/,
              message: "Only alphabets are allowed",
            },
          })}
          onInput={allowOnlyAlphabets}
          error={errors.name?.message}
          disabled={isSubmitting}
        />

        {/* Controller for Select */}
        <Controller
          name="type"
          control={control}
          render={({ field }) => (
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Vendor Type</label>
              <Select
                value={field.value}
                onValueChange={field.onChange}
                disabled={isSubmitting}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select Vendor Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="supplier">Supplier</SelectItem>
                  <SelectItem value="service_provider">Service Provider</SelectItem>
                  <SelectItem value="contractor">Contractor</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}
        />
        {errors.type && <p className="text-red-500 text-sm">{errors.type.message}</p>}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input
          label="Email"
          type="email"
          {...register('email')}
          error={errors.email?.message}
          disabled={isSubmitting}
        />
        <Input
          label="Phone (e.g., 9876543210)"
          {...register('phone')}
          error={errors.phone?.message}
          disabled={isSubmitting}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input
          label="Tax ID (e.g., 22AAAAA0000A1Z5)"
          {...register('gstin')}
          error={errors.gstin?.message}
          disabled={isSubmitting}
        />
        <Input
          label="PAN (e.g.,ABCDE1234F)"
          {...register('pan')}
          error={errors.pan?.message}
          disabled={isSubmitting}
        />
      </div>

      <Input
        label="Payment Terms"
        {...register('paymentTerms')}
        error={errors.paymentTerms?.message}
        disabled={isSubmitting}
        placeholder="e.g., Net 30, Due on receipt"
      />

      <div className="border-t pt-4">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Address</h3>
        <div className="grid grid-cols-1 gap-4">
          <Input
            label={<span>Address Line 1 <Required /></span>}
            {...register('address.line1')}
            error={errors.address?.line1?.message}
            disabled={isSubmitting}
          />
          <Input
            label="Address Line 2"
            {...register('address.line2')}
            error={errors.address?.line2?.message}
            disabled={isSubmitting}
          />
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Input
              label={<span>City <Required /></span>}
              {...register('address.city')}
              error={errors.address?.city?.message}
              disabled={isSubmitting} />
            <Input
              label={<span>State <Required /></span>}
              {...register('address.state')}
              error={errors.address?.state?.message}
              disabled={isSubmitting} />
            <Input
              label={<span>Pincode (e.g., 560001) <Required /></span>}
              {...register('address.postalCode')}
              error={errors.address?.postalCode?.message}
              disabled={isSubmitting}
            />
            <Input
              label={<span>Country <Required /></span>}
              {...register('address.country')}
              error={errors.address?.country?.message}
              disabled={isSubmitting}
            />
          </div>
        </div>
      </div>

      <div className="flex justify-end space-x-3 pt-4">
        <Button type="button" variant="outline" onClick={onCancel} disabled={isSubmitting}>
          Cancel
        </Button>
        <Button type="submit" isLoading={isSubmitting}>
          {vendor ? 'Update Vendor' : 'Create Vendor'}
        </Button>
      </div>
    </form>
  );
};

export default VendorForm;
