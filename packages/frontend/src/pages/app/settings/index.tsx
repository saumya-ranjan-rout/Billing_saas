import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import DashboardLayout from '../../../components/layout/DashboardLayout';
// import Input from '../../../components/common/Input';
// import Button from '../../../components/common/Button';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { useApi } from '../../../hooks/useApi';
import { toast } from 'sonner';

// ---------------- Schema ----------------
const settingSchema = z.object({
  companyName: z.string().min(1, "Company Name is required"),

  subdomain: z.string().min(1, "Subdomain is required"),

  contactEmail: z
    .string()
    .email("Invalid email")
    .min(1, "Email is required"),

  contactPhone: z
    .string()
    .min(1, "Phone number is required")
    .refine((value) => /^[0-9]{10}$/.test(value), "Phone number must be 10 digits"),

  address: z.string().min(1, "Address is required"),

  gstNumber: z
    .string()
    .min(1, "GST Number is required")
    .refine(
      (value) =>
        /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/.test(value),
      "Invalid GST number"
    ),
});

type SettingFormData = z.infer<typeof settingSchema>;

// ---------------- Component ----------------
export default function Settings() {
  const { get, put } = useApi<any>();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<SettingFormData>({
    resolver: zodResolver(settingSchema),
    defaultValues: {
      companyName: '',
      subdomain: '',
      contactEmail: '',
      contactPhone: '',
      address: '',
      gstNumber: '',
    },
  });

  // Fetch existing settings
  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await get('/api/settings');
        if (data) reset(data);
      } catch (err: any) {
        console.error('Failed to load settings:', err);
        toast.error(err.message || 'Failed to load settings');
      }
    };
    fetchData();
  }, [get, reset]);

  // Submit form
  const onSubmit = async (data: SettingFormData) => {
    try {
      await put('/api/settings', data);
      toast.success('Settings updated successfully');
    } catch (err: any) {
      console.error('Failed to save settings:', err);
      // toast.error(err.message || 'Failed to save settings');
      const message =
        err.response?.data?.error ||    // our backend error
        err.message ||                  // fallback
        'Failed to save settings';

      toast.error(message);
    }
  };

  const Required = () => <span className="text-red-500">*</span>;

  return (
    <DashboardLayout>
      <div className="settings-container w-full px-6 py-6">

        {/* Page Title */}
        <h1 className="settings-title mb-1">Settings</h1>
        <p className="settings-subtitle mb-6">Manage your company information</p>

        {/* Form */}
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="bg-white shadow rounded-lg p-6 space-y-4"
        >
          <Input
            label={<span>Company Name <Required /></span>}
            {...register('companyName')}
            error={errors.companyName?.message}
            disabled={isSubmitting}
          />
          <Input
            label={<span>Subdomain <Required /></span>}
            {...register('subdomain')}
            error={errors.subdomain?.message}
            disabled={isSubmitting}
          />
          <Input
            label={<span>Contact Email <Required /></span>}
            {...register('contactEmail')}
            error={errors.contactEmail?.message}
            disabled={isSubmitting}
          />
          <Input
            label={<span>Contact Phone <Required /></span>}
            {...register('contactPhone')}
            error={errors.contactPhone?.message}
            disabled={isSubmitting}
          />
          <Input
            label={<span>Address <Required /></span>}
            {...register('address')}
            error={errors.address?.message}
            disabled={isSubmitting}
          // multiline
          />
          <Input
            label={<span>GST Number <Required /></span>}
            {...register('gstNumber')}
            error={errors.gstNumber?.message}
            disabled={isSubmitting}
          />

          <div className="flex justify-end space-x-3 pt-4">
            <Button type="submit" isLoading={isSubmitting}>
              Save Changes
            </Button>
          </div>
        </form>
      </div>
    </DashboardLayout>
  );
}


