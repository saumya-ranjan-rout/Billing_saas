import React, { useState, useEffect, useCallback } from 'react';
// import Table from '../common/Table';
import { Table } from '@/components/ui/Table';
import { useApi } from '../../hooks/useApi';
import { Vendor, PaginatedResponse } from '../../types';
import { toast } from 'sonner';
// import Pagination from '../common/Pagination';
import { Pagination } from '@/components/ui/Pagination';
import PaymentModal from "./PaymentModal";
import PaymentHistoryModal from './PaymentHistoryModal';

interface VendorListProps {
  onEditVendor: (vendor: Vendor) => void;
  refreshTrigger?: number; // new
}

const VendorList: React.FC<VendorListProps> = ({ onEditVendor, refreshTrigger }) => {
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [loading, setLoading] = useState(true);
  const [paymentModal, setPaymentModal] = useState<{ open: boolean; vendor: any | null }>({
    open: false,
    vendor: null
  });
  const [historyModal, setHistoryModal] = useState<{ open: boolean; vendor: any | null }>({
    open: false,
    vendor: null
  });
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    pages: 0,
  });
  const [filters, setFilters] = useState({
    name: "",
    email: "",
    phone: "",
    status: "",
    joinedFrom: "",
    joinedTo: ""
  });

  const { get, del } = useApi<PaginatedResponse<Vendor>>();

  // Reusable fetch function
  const fetchVendors = async () => {
    try {
      // const response = await get(
      //   `/api/vendors?page=${pagination.page}&limit=${pagination.limit}`
      // );
      const query = new URLSearchParams({
        page: String(pagination.page),
        limit: String(pagination.limit),
        name: filters.name || "",
        email: filters.email || "",
        phone: filters.phone || "",
        status: filters.status || "",
        joinedFrom: filters.joinedFrom || "",
        joinedTo: filters.joinedTo || "",
      }).toString();
      const response = await get(`/api/vendors?${query}`);
      setVendors(response.data);
    //  console.log("vendor-pagination",response.pagination);
      setPagination(response.pagination);
    } catch (error: any) {
      console.error('Failed to fetch vendors:', error);
      toast.error(error?.message || 'Failed to load vendors ❌');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVendors();
  }, [filters, pagination.page, pagination.limit, refreshTrigger]);



  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this vendor?')) return;

    try {
      await del(`/api/vendors/${id}`);
      toast.success('Vendor deleted successfully 🗑️');
      fetchVendors();
    } catch (error: any) {
      console.error('Delete failed:', error);
      toast.error(error?.message || 'Failed to delete vendor ❌');
    }
  };

  const handlePageChange = (newPage: number) => {
    setPagination((prev) => ({ ...prev, page: newPage }));
  };

  const columns = [
    // {
    //   key: 'name',
    //   header: 'Vendor Name',
    //   render: (value: string, row: Vendor) => (
    //     <div className="flex items-center">
    //       <div className="flex-shrink-0 h-10 w-10 rounded-full bg-green-500 flex items-center justify-center text-white font-bold">
    //         {value.charAt(0)}
    //       </div>
    //       <div className="ml-4">
    //         <div className="font-medium text-gray-900">{value}</div>
    //         <div className="text-sm text-gray-500 capitalize">
    //           {row.type?.replace('_', ' ')}
    //         </div>
    //       </div>
    //     </div>
    //   ),
    // },  
    {
      key: 'name',
      header: 'Name',
      render: (value: string, row: Vendor) => (
        <div className="flex items-center cursor-pointer"
          onClick={() => setHistoryModal({ open: true, vendor: row })}>
          <div className="flex-shrink-0 h-10 w-10 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold">
            {value.charAt(0)}
          </div>
          <div className="ml-4">
            <div className="relative group">
              <div className="font-bold text-gray-900 hover:text-blue-600 cursor-pointer">
                {value}
              </div>
              <span className="absolute left-0 top-full mt-1 w-max 
                             px-2 py-1 text-xs bg-gray-800 text-white rounded 
                             opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                View payment history
              </span>
            </div>
            <div className="text-sm text-gray-500">{row.type?.replace('_', ' ')}</div>
          </div>
        </div>
      )
    },
    {
      key: 'email',
      header: 'Email',
    },
    {
      key: 'phone',
      header: 'Phone',
    },
    // {
    //   key: 'outstandingBalance',
    //   header: 'Balance',
    //   render: (value: number) => (
    //     <span
    //       className={
    //         value > 0 ? 'text-red-600 font-medium' : 'text-green-600'
    //       }
    //     >
    //       ₹{value.toLocaleString()}
    //     </span>
    //   ),
    // },
    { key: 'totalDue', header: 'Total Due' },
    { key: 'totalPaid', header: 'Total Paid' },
    { key: 'balance', header: 'Balance' },
    {
      key: 'paymentStatus',
      header: 'Status',
      render: (value: string) => {
        let color =
          value === "completed" ? "bg-green-100 text-green-800" :
            value === "partial" ? "bg-yellow-100 text-yellow-800" :
              "bg-red-100 text-red-800";

        let label =
          value === "completed" ? "Paid" :
            value === "partial" ? "Partial" :
              "Unpaid";

        return (
          <span className={`px-2 py-1 rounded text-xs font-semibold ${color}`}>
            {label}
          </span>
        );
      }
    },
    {
      key: 'createdAt',
      header: 'Added On',
      render: (value: string) => new Date(value).toLocaleDateString(),
    },
    {
      key: 'actions',
      header: 'Actions',
      render: (_: any, row: Vendor) => (
        <div className="flex gap-3">
          <button
            onClick={() => onEditVendor(row)}
            className="bg-blue-500 text-white px-3 py-1 rounded text-sm hover:bg-blue-600"
          >
            Edit
          </button>
          <button
            onClick={() => handleDelete(row.id)}
            className="bg-red-500 text-white px-3 py-1 rounded text-sm hover:bg-red-600"
          >
            Delete
          </button>
          <button
            onClick={() => setPaymentModal({ open: true, vendor: row })}
            className="bg-purple-500 text-white px-3 py-1 rounded text-sm hover:bg-purple-600"
          >
            Pay
          </button>
        </div>
      ),
    },
  ];

  if (loading) {
    return <div>Loading vendors...</div>;
  }

  return (
    <div>

      <div className="grid grid-cols-1 md:grid-cols-6 gap-3 mb-6 p-2 bg-gray-50 rounded-lg">

        <input
          type="text"
          placeholder="Name"
          className="border p-2 rounded"
          value={filters.name}
          onChange={(e) => setFilters({ ...filters, name: e.target.value })}
        />

        <input
          type="text"
          placeholder="Email"
          className="border p-2 rounded"
          value={filters.email}
          onChange={(e) => setFilters({ ...filters, email: e.target.value })}
        />

        <input
          type="text"
          placeholder="Phone"
          className="border p-2 rounded"
          value={filters.phone}
          onChange={(e) => setFilters({ ...filters, phone: e.target.value })}
        />

        <select
          className="border p-2 rounded"
          value={filters.status}
          onChange={(e) => setFilters({ ...filters, status: e.target.value })}
        >
          <option value="">All Status</option>
          <option value="completed">Paid</option>
          <option value="partial">Partial</option>
          <option value="pending">Unpaid</option>
        </select>

        <input
          type="date"
          className="border p-2 rounded"
          value={filters.joinedFrom}
          onChange={(e) => setFilters({ ...filters, joinedFrom: e.target.value })}
        />

        <input
          type="date"
          className="border p-2 rounded"
          value={filters.joinedTo}
          onChange={(e) => setFilters({ ...filters, joinedTo: e.target.value })}
        />

      </div>
      <Table
        columns={columns}
        data={vendors}
        // onRowClick={onEditVendor}
        emptyMessage="No vendors found"
      />
      {pagination.pages > 1 && (
        <Pagination
          currentPage={pagination.page}
          totalPages={pagination.pages}
          onPageChange={handlePageChange}
        />
      )}

      {paymentModal.open && (
        <PaymentModal
          vendor={paymentModal.vendor}
          onClose={() => setPaymentModal({ open: false, vendor: null })}
          onSuccess={() => {
            fetchVendors();
            setPaymentModal({ open: false, vendor: null });
          }}
        />
      )}

      {historyModal.open && (
        <PaymentHistoryModal
          vendor={historyModal.vendor}
          onClose={() => setHistoryModal({ open: false, vendor: null })}
        />
      )}
    </div>
  );
};

export default VendorList;

