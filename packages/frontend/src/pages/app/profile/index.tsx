import React, { useState, useEffect } from "react";
import DashboardLayout from "../../../components/layout/DashboardLayout";
import ProfileList from "../../../components/profile/ProfileList";
import { Modal } from '@/components/ui/Modal';
import { User } from '../../../types';
import ProfileForm from '../../../components/profile/ProfileForm';
import ChangePasswordForm from "../../../components/profile/ChangePasswordForm";

const ProfilePage = () => {
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [editingUser, setEditingUser] = useState<User | null>(null);
    const [refreshList, setRefreshList] = useState(0);
    const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);

    const triggerRefresh = () => {
        setRefreshList(prev => prev + 1);
    };

    const handleEditUser = (user: User) => {
        setEditingUser(user);
        setIsFormOpen(true);
    };

    const handleCloseForm = () => {
        setIsFormOpen(false);
        setEditingUser(null);
    };

    const handleSuccess = () => {
        handleCloseForm();
        triggerRefresh(); // ✅ refresh list after add/edit success
    };

    const handleOpenPasswordModal = () => {
        setIsPasswordModalOpen(true);
    };

    return (
        <DashboardLayout>
            <div className="w-full h-full px-8 py-6">
                <ProfileList onEditUser={handleEditUser} onChangePassword={handleOpenPasswordModal} />
                <Modal
                    isOpen={isFormOpen}
                    onClose={handleCloseForm}
                    title={editingUser ? 'Edit User' : ''}
                    size="lg"
                >
                    <ProfileForm
                        user={editingUser}
                        onSuccess={handleSuccess}
                        onCancel={handleCloseForm}
                        onRefresh={triggerRefresh}
                    />
                </Modal>

                {/* Change Password Modal */}
                <Modal
                    isOpen={isPasswordModalOpen}
                    onClose={() => setIsPasswordModalOpen(false)}
                    title="Change Password"
                    size="md"
                >
                    <ChangePasswordForm
                        onSuccess={() => setIsPasswordModalOpen(false)}
                        onCancel={() => setIsPasswordModalOpen(false)}
                    />
                </Modal>
            </div>
        </DashboardLayout>
    );
};

export default ProfilePage;

