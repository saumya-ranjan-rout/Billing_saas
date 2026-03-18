import React, { useState, useEffect, useCallback } from 'react';
// import Table from '../../common/Table';
import { Table } from '@/components/ui/Table';
import { useApi } from '../../../hooks/useApi';
import { PurchaseOrder, PaginatedResponse } from '../../../types';
import { toast } from 'sonner';
// import Pagination from '../../common/Pagination';
// import { Badge } from '../../common/Badge';
// import Button from '../../common/Button';
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue
} from '@/components/ui/Select';
import { Pagination } from '@/components/ui/Pagination';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';

interface PurchaseListProps {
  onEditPurchase: (purchaseOrder: PurchaseOrder) => void;
}

const PurchaseList: React.FC<PurchaseListProps> = ({ onEditPurchase }) => {
  const [purchaseOrders, setPurchaseOrders] = useState<PurchaseOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    pages: 0,
  });

  const { get, del,patch } = useApi<PaginatedResponse<PurchaseOrder>>();

  // ✅ moved outside so reusable
const fetchPurchaseOrders = useCallback(async () => {
  try {
    setLoading(true);

    const response = await get(
      `/api/purchases?page=${pagination.page}&limit=${pagination.limit}`
    );

    //console.log("pagerrrr",response.pagination);
    

    setPurchaseOrders(response.data);
    setPagination(response.pagination);

  } catch (error: any) {
    console.error('Failed to fetch purchase orders:', error);
    toast.error(error?.message || 'Failed to load purchase orders');
  } finally {
    setLoading(false);
  }
}, [get, pagination.page, pagination.limit]);

useEffect(() => {
  fetchPurchaseOrders();
}, [fetchPurchaseOrders]);



  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this purchase order?')) return;

    try {
      await del(`/api/purchases/${id}`);
      toast.success('Purchase order deleted successfully 🗑️');
      fetchPurchaseOrders(); // ✅ now works fine
    } catch (error: any) {
      console.error('Delete failed:', error);
      toast.error( error?.message || 'Failed to delete Purchase order ❌');
    }
  };
  const handleStatusChange = async (invoiceId: string, newStatus: string) => {
    try {
      await patch(`/api/purchases/${invoiceId}/status`, { status: newStatus });
      toast.success("Status updated!");
  
      fetchPurchaseOrders(); // refresh table
    } catch (error: any) {
      toast.error(error?.message || "Failed to update status");
    }
  };

const getStatusBadge = (status: string) => {
  const statusConfig: Record<string, { label: string; variant: 'default' | 'outline' | 'danger' | 'success' | 'warning' }> = {
    draft: { label: 'Draft', variant: 'outline' },
    pending: { label: 'Pending', variant: 'warning' },
    approved: { label: 'Approved', variant: 'success' },
    ordered: { label: 'Ordered', variant: 'default' },
    received: { label: 'Received', variant: 'success' },
    cancelled: { label: 'Cancelled', variant: 'danger' },
    paid: { label: 'Paid', variant: 'success' },
  };

  const config = statusConfig[status] || { label: status, variant: 'default' };
  return <Badge variant={config.variant}>{config.label}</Badge>;
};


  const columns = [
    {
      key: 'poNumber',
      header: 'PO Number',
      render: (value: string, row: PurchaseOrder) => (
        <div>
          <div className="font-medium text-gray-900">{value}</div>
          <div className="text-sm text-gray-500">{row.vendor?.name}</div>
        </div>
      )
    },
    {
      key: 'orderDate',
      header: 'Order Date',
      render: (value: string) => new Date(value).toLocaleDateString()
    },
    // {
    //   key: 'status',
    //   header: 'Status',
    //   render: (value: string) => getStatusBadge(value)
    // },
    {
      key: "status",
      header: "Status",
      render: (_: string, row: PurchaseOrder) => {
        const statusMap: Record<string, { label: string; variant: any }> = {
          draft: { label: 'Draft', variant: 'outline' },
          pending: { label: 'Pending', variant: 'default' },
          approved: { label: 'Approved', variant: 'warning' },
          ordered: { label: 'Ordered', variant: 'warning' },
          paid: { label: 'Paid', variant: 'success' },
          received: { label: 'Received', variant: 'danger' },
          cancelled: { label: 'Cancelled', variant: 'outline' },
        };
    
        return (
          <Select
            value={row.status}
            onValueChange={(val) => handleStatusChange(row.id, val)}
          >
            <SelectTrigger className="w-[140px]">
              <SelectValue>
                {statusMap[row.status] && (
                  <Badge variant={statusMap[row.status].variant}>
                    {statusMap[row.status].label}
                  </Badge>
                )}
              </SelectValue>
            </SelectTrigger>
    
            <SelectContent>
              {Object.entries(statusMap).map(([value, { label, variant }]) => (
                <SelectItem
                  key={value}
                  value={value}
                  className="flex items-center gap-2"
                >
                  <Badge variant={variant}>{label}</Badge>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        );
      },
    },
    
    {
      key: 'totalAmount',
      header: 'Total Amount',
      render: (value: number) => `₹${value.toLocaleString()}`
    },
    {
      key: 'balanceDue',
      header: 'Balance Due',
      render: (value: number) => (
        <span className={value > 0 ? 'text-red-600 font-medium' : 'text-green-600'}>
          ₹{value.toLocaleString()}
        </span>
      )
    },
    {
      key: 'actions',
      header: 'Actions',
      render: (value: any, row: PurchaseOrder) => (
        <div className="flex gap-2">
          <Button
            onClick={() => onEditPurchase(row)}
            variant="outline"
            size="sm"
          >
            Edit
          </Button>
          <button
            onClick={() => handleDelete(row.id)}
            className="text-red-600 hover:text-red-900 font-medium text-sm"
          >
            Delete
          </button>
        </div>
      )
    }
  ];

  if (loading) {
    return <div>Loading purchase orders...</div>;
  }

  return (
    <div>
      <Table
        columns={columns}
        data={purchaseOrders}
        // onRowClick={onEditPurchase}
        emptyMessage="No purchase orders found"
      />
<Pagination
  currentPage={pagination.page}
  totalPages={pagination.pages}
  onPageChange={(page) =>
    setPagination((prev) => ({ ...prev, page }))
  }
/>
    </div>
  );
};

export default PurchaseList;




