

import React, { useState, useEffect } from 'react';
import { Bell, Menu, Search, User, LogOut, Key } from 'lucide-react';
import { useAppSelector, useAppDispatch } from '../../../store/hooks';
import { selectCurrentUser, logout } from '../../../features/auth/authSlice';
import { useRouter } from 'next/router';
import { setCredentials, setError, selectAuthError } from "../../../features/auth/authSlice";
import { toast } from 'sonner';
import { useApi } from '../../../hooks/useApi';
interface HeaderProps {
  onMenuClick: () => void;
}
interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
  tenantId: string;

}
interface Tenant {
  id: string;
  name: string;
  businessName: string;
}
const Header: React.FC<HeaderProps> = ({ onMenuClick }) => {
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  // const user = useAppSelector(selectCurrentUser);
  const [user, setUser] = useState<User | null>(null);
  const [tenant, setTenant] = useState<Tenant | null>(null);
  const dispatch = useAppDispatch();
  const router = useRouter();
  const { get: gett } = useApi<any>();

  const toggleProfileMenu = () => setIsProfileOpen(prev => !prev);

  const handleLogout = async () => {
    dispatch(logout());
    //await new Promise((res) => setTimeout(res, 2000));
    console.log("Redirecting to login...");
    window.location.href = "/auth/login"; // always works
  };
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await gett("/api/auth/mewithtenant");
        console.log("header user", res);
        setUser(res.user);
        setTenant(res.tenant);

      } catch (err) {
        console.error("Failed to fetch user", err);
      }
    };

    fetchUser();
  }, []);
  const viewBusiness = async (id: string, role: string) => {

    if (!confirm('Are you sure you want to switch tenant?')) return;

    try {

      const response = await gett(`/api/customers/switchTenant/${id}/${role}`);

      // console.log("jiku",response);

      dispatch(setCredentials({ user: response.user, token: response.accessToken }));

      localStorage.setItem("token", response.accessToken);

      localStorage.setItem("user", JSON.stringify(response.user));

      toast.success('Tenant switched successfully 🗑️');

      window.location.href = "/app/dashboard";

    } catch (error: any) {

      console.error('Tenant switching failed:', error);

      toast.error(error?.message || 'Failed to switch tenant ❌');

    }

  };

  // 15-12-2025
  const [open, setOpen] = useState(false);
  const [hasNotification, setHasNotification] = useState(false);
  const [notifications, setNotifications] = useState<
    { type: string; message: string }[]
  >([]);
  const notificationCount = notifications.length;

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const data = await gett("/api/notification/notification-status");

        setHasNotification(Boolean(data?.hasNotification));
        setNotifications(data?.items || []);
      } catch (err) {
        console.error("Failed to fetch notifications", err);
      }
    };

    fetchNotifications();

    // Optional: refresh every 60s
    const interval = setInterval(fetchNotifications, 60000);
    return () => clearInterval(interval);
  }, []);



  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="flex items-center justify-between px-4 py-3">
        {/* Left section */}
        <div className="flex items-center">
          <button
            onClick={onMenuClick}
            className="p-1 rounded-md text-gray-500 hover:text-gray-600 hover:bg-gray-100 lg:hidden"
          >
            <Menu size={24} />
          </button>

          {/* Search */}
          <div className="relative ml-4 hidden md:block">
            {/* <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search size={20} className="text-gray-400" />
            </div> */}
            {/* <input
              type="text"
              placeholder="Search..."
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            /> */}

            {user?.role === 'professional_user' && (
              <p>
                You are viewing business of{" "}
                <strong style={{ backgroundColor: "red", padding: "2px 6px", color: "#fff", borderRadius: "4px" }}>
                  {tenant?.businessName}


                </strong>

                <button
                  onClick={() => viewBusiness(user?.id, "professional")}
                  className="ml-2 px-3 py-1 text-sm rounded-full bg-blue-600 text-white font-medium shadow hover:bg-blue-700 transition"
                >
                  Return Back
                </button>

              </p>
            )}

          </div>
        </div>

        {/* Right section */}
        <div className="flex items-center space-x-4">
          {/* Notifications */}
          {/* <button
            title={showBell ? bellMessage : ""}
            className="p-1 rounded-md text-gray-500 hover:text-gray-600 hover:bg-gray-100 relative"
          >
            <Bell size={20} />
            {showBell && (
              <span className="absolute -top-1 -right-1 text-xs bg-red-500 text-white rounded-full px-1">
                {(requestNotif ? 1 : 0) + (subscriptionNotif ? 1 : 0)}
              </span>
            )}
          </button> */}

          <div className="relative">
            <button
              onClick={() => setOpen(!open)}
              className="relative p-1 rounded-md text-gray-500 hover:text-gray-600 hover:bg-gray-100"
            >
              <Bell size={20} />

              {notifications.length > 0 && (
                <span className="absolute -top-1 -right-1 flex h-5 min-w-[20px] items-center justify-center rounded-full bg-red-500 px-1 text-xs font-semibold text-white">
                  {notifications.length}
                </span>
              )}
            </button>

            {open && (
              <div className="absolute right-0 mt-2 w-80 bg-white border rounded-lg shadow-lg z-50">
                <div className="p-3 border-b font-semibold text-gray-700">
                  Notifications
                </div>

                {notifications.length === 0 ? (
                  <div className="p-4 text-sm text-gray-500">
                    No new notifications
                  </div>
                ) : (
                  <ul className="divide-y">
                    {notifications.map((n, index) => (
                      <li
                        key={index}
                        className="p-3 text-sm text-gray-700 hover:bg-gray-50 cursor-pointer"
                      >
                        {n.message}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            )}
          </div>

          {/* User profile */}
          {/* <div className="flex items-center">
            <div className="h-8 w-8 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold">
              <User size={16} />
            </div>
            <span className="ml-2 text-sm font-medium text-gray-700 hidden md:block">
              John Doe
            </span>
          </div> */}

          {/* User profile */}
          <div className="relative">
            <div
              className="flex items-center cursor-pointer"
              onClick={toggleProfileMenu}
            >
              <div className="h-8 w-8 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold">
                <User size={16} />
              </div>
              <span className="ml-2 text-sm font-medium text-gray-700 hidden md:block">
                {user ? `${user.firstName} ${user.lastName}` : ''}
              </span>
            </div>

            {/* Profile submenu */}
            {isProfileOpen && (
              <div className="absolute right-0 mt-2 w-40 bg-white border border-gray-200 rounded-md shadow-lg z-50">
                <button
                  onClick={() => router.push("/app/profile")}
                  className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100
             flex items-center space-x-2 rounded-md transition-all"
                >
                  <User size={16} className="text-blue-600" />
                  <span>Profile</span>
                </button>
                {/* <button
                  onClick={() => router.push("/change-password")}
                  className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100
             flex items-center space-x-2 rounded-md transition-all"
                >
                  <Key size={16} className="text-amber-600" />
                  <span>Change Password</span>
                </button> */}
                {/* <button
                  onClick={handleLogout}
                  className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center space-x-2"
                >
                  <LogOut size={16} />
                  <span>Logout</span>
                </button> */}
                <button
                  onClick={handleLogout}
                  className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-100
             flex items-center space-x-2 rounded-md transition-all"
                >
                  <LogOut size={16} />
                  <span>Logout</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;




