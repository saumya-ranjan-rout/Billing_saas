import React, { useState, useEffect } from "react";
import { useAppSelector } from "@/store/hooks";
import { User as UserIcon } from "lucide-react";
import type { User } from "../../types";
import { Button } from "@/components/ui/Button";

interface UserListProps {
    onEditUser: (user: User) => void;
    onChangePassword: () => void;
    // refreshTrigger?: number;
}

const ProfileList: React.FC<UserListProps> = ({ onEditUser, onChangePassword }) => {
    // const [users, setUsers] = useState<User[]>([]);

    const user = useAppSelector((state) => state.auth.user);

    return (
        <div className="w-full">

            {/* Heading */}
            <div className="mb-8">
                <h1 className="text-3xl font-semibold">Profile</h1>
                <p className="text-gray-500">Manage your personal information</p>
            </div>

            {/* Main layout */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">

                {/* Left — Profile Summary */}
                <div className="bg-white shadow rounded-xl p-6 flex flex-col items-center text-center">
                    <div className="h-28 w-28 rounded-full bg-blue-100 flex items-center justify-center mb-4">
                        <UserIcon size={48} className="text-blue-600" />
                    </div>

                    <h2 className="text-xl font-semibold">
                        {user?.firstName} {user?.lastName}
                    </h2>

                    <p className="text-gray-500 mb-2">{user?.email}</p>

                    {/* <Button
                        className="mt-4 bg-blue-600 hover:bg-blue-700 text-white rounded-lg px-5 py-2"
                        onClick={() => user && onEditUser(user)}
                    >
                        Edit Profile
                    </Button> */}
                    {/* Edit Profile button */}
                    <Button
                        className="mt-4 bg-blue-600 hover:bg-blue-700 text-white rounded-lg px-5 py-2 w-full"
                        onClick={() => user && onEditUser(user)}
                    >
                        Edit Profile
                    </Button>

                    {/* Change Password button */}
                    <Button
                        className="mt-3 bg-red-200 hover:bg-red-300 text-red-700 rounded-lg px-5 py-2 w-full"
                        onClick={onChangePassword}
                    >
                        Change Password
                    </Button>
                </div>

                {/* Right — Details */}
                <div className="md:col-span-2 bg-white shadow rounded-xl p-6">
                    <h3 className="text-xl font-semibold mb-4">Profile Information</h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                        <div>
                            <p className="text-sm text-gray-500">Full Name</p>
                            <p className="text-lg font-medium">
                                {user?.firstName} {user?.lastName}
                            </p>
                        </div>

                        <div>
                            <p className="text-sm text-gray-500">Email</p>
                            <p className="text-lg font-medium">{user?.email}</p>
                        </div>

                        <div>
                            <p className="text-sm text-gray-500">Tenant ID</p>
                            <p className="text-lg font-medium">{user?.tenantId}</p>
                        </div>

                        <div>
                            <p className="text-sm text-gray-500">Role</p>
                            <p className="text-lg font-medium capitalize">{user?.role}</p>
                        </div>

                        <div>
                            <p className="text-sm text-gray-500">Joined On</p>
                            <p className="text-lg font-medium">
                                {user?.createdAt?.slice(0, 10)}
                            </p>
                        </div>

                    </div>
                </div>
            </div>

        </div>
    );
};

export default ProfileList;
