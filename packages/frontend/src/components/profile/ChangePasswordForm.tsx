

import React from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useApi } from "../../hooks/useApi";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { toast } from "sonner";

interface UserPasswordProps {
    onSuccess: () => void;
    onCancel: () => void;
}

const changePasswordSchema = z
    .object({
        oldPassword: z.string().min(1, "Old password is required"),
        newPassword: z.string().min(8, "Password must be at least 8 characters"),
        confirmPassword: z.string().min(1, "Confirm password is required"),
    })
    .refine((data) => data.newPassword === data.confirmPassword, {
        message: "Passwords do not match",
        path: ["confirmPassword"],
    });

type ChangePasswordFormData = z.infer<typeof changePasswordSchema>;

const ChangePasswordForm: React.FC<UserPasswordProps> = ({ onSuccess, onCancel }) => {
    const { post } = useApi<any>();
    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm<ChangePasswordFormData>({
        resolver: zodResolver(changePasswordSchema),
    });

    const onSubmit = async (data: ChangePasswordFormData) => {

        try {
            await post("/api/users/change-password", {
                oldPassword: data.oldPassword,
                newPassword: data.newPassword,
            });

            toast.success("Password updated successfully ✅");
            onSuccess();
        } catch (error: any) {
            console.log("Error", error);
            toast.error(error.message || "Failed to change password ❌");
        }
    };

    const Required = () => <span className="text-red-500">*</span>;

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <Input
                label={<span>Old Password <Required /></span>}
                type="password"
                {...register("oldPassword")}
                error={errors.oldPassword?.message}
                disabled={isSubmitting}
            />

            <Input
                label={<span>New Password <Required /></span>}
                type="password"
                {...register("newPassword")}
                error={errors.newPassword?.message}
                disabled={isSubmitting}
            />

            <Input
                label={<span>Confirm New Password <Required /></span>}
                type="password"
                {...register("confirmPassword")}
                error={errors.confirmPassword?.message}
                disabled={isSubmitting}
            />

            <div className="flex justify-end gap-2 pt-4">
                <Button type="button" variant="outline" onClick={onCancel}>
                    Cancel
                </Button>
                <Button type="submit" isLoading={isSubmitting}>
                    Change Password
                </Button>
            </div>
        </form>
    );
};

export default ChangePasswordForm;



// import React, { useState } from "react";
// import { Button } from "@/components/ui/Button";
// import { z } from "zod";

// interface UserPasswordProps {
//     //   user?: any; 
//     onSuccess: () => void;
//     onCancel: () => void;
// }

// const changePasswordSchema = z
//     .object({
//         oldPassword: z.string().min(1, "Old password is required"),
//         newPassword: z.string().min(8, "Password must be at least 8 characters"),
//         confirmPassword: z.string().min(1, "Confirm password is required"),
//     })
//     .refine((data) => data.newPassword === data.confirmPassword, {
//         message: "Passwords do not match",
//         path: ["confirmPassword"],
//     });

// const ChangePasswordForm: React.FC<UserPasswordProps> = ({ onSuccess, onCancel }) => {
//     const [oldPassword, setOldPassword] = useState("");
//     const [newPassword, setNewPassword] = useState("");
//     const [confirmPassword, setConfirmPassword] = useState("");
//     const [errors, setErrors] = useState<Record<string, string>>({});

//     const handleSubmit = () => {
//         if (newPassword !== confirmPassword) {
//             alert("New passwords do not match!");
//             return;
//         }

//         // call API here
//         console.log("Password changed");

//         onSuccess();
//     };

//     const Required = () => <span className="text-red-500">*</span>;

//     return (
//         <div className="space-y-4">
//             <div>
//                 <label className="text-sm font-medium">Old Password <Required /></label>
//                 <input
//                     type="password"
//                     className="w-full mt-1 border rounded p-2"
//                     value={oldPassword}
//                     onChange={(e) => setOldPassword(e.target.value)}
//                 />
//                 {errors.oldPassword && (
//                     <p className="text-red-500 text-sm mt-1">{errors.oldPassword}</p>
//                 )}
//             </div>

//             <div>
//                 <label className="text-sm font-medium">New Password <Required /></label>
//                 <input
//                     type="password"
//                     className="w-full mt-1 border rounded p-2"
//                     value={newPassword}
//                     onChange={(e) => setNewPassword(e.target.value)}
//                 />
//                 {errors.newPassword && (
//                     <p className="text-red-500 text-sm mt-1">{errors.newPassword}</p>
//                 )}
//             </div>

//             <div>
//                 <label className="text-sm font-medium">Confirm New Password <Required /></label>
//                 <input
//                     type="password"
//                     className="w-full mt-1 border rounded p-2"
//                     value={confirmPassword}
//                     onChange={(e) => setConfirmPassword(e.target.value)}
//                 />
//                 {errors.confirmPassword && (
//                     <p className="text-red-500 text-sm mt-1">{errors.confirmPassword}</p>
//                 )}
//             </div>

//             <div className="flex justify-end gap-2 mt-4">
//                 <Button variant="secondary" onClick={onCancel}>Cancel</Button>
//                 <Button className="bg-blue-600 text-white" onClick={handleSubmit}>
//                     Change Password
//                 </Button>
//             </div>
//         </div>
//     );
// };

// export default ChangePasswordForm;
        // try {
        //     const res = await fetch("/api/users/change-password", {
        //         method: "POST",
        //         // headers: { "Content-Type": "application/json" },
        //         credentials: "include",
        //         body: JSON.stringify({
        //             oldPassword: data.oldPassword,
        //             newPassword: data.newPassword,
        //         }),
        //     });

        //     const result = await res.json();

        //     if (!res.ok) {
        //         throw new Error(result.message || "Failed to change password");
        //     }

        //     toast.success("User password updated successfully ✅");

        //     onSuccess(); // ✅ close modal / show toast
        // } catch (error: any) {
        //     console.log("Error", error);
        //     alert(error.message); // replace with toast if you have
        // }