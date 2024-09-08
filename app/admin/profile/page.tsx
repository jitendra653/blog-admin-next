"use client"
import React, { useEffect, useState } from 'react';
import { useSession } from "next-auth/react";
import UserForm from '@/components/user/UserForm';
import Modal from '@/components/modal/Modal';
import { toast } from 'react-toastify';
import Image from 'next/image';
import loaderStore from '../../stores/loaderStore';

interface UserProfile {
  name: string;
  email: string;
}

const Profile: React.FC = () => {
  const { data: session } = useSession();
  const [isEditing, setIsEditing] = useState(false);
  const [userProfile, setUserProfile] = useState<UserProfile>({ name: '', email: '' });

  const fetchUser = async () => {
    loaderStore.show();
    try {
      const res = await fetch(`/api/profile/${session?.user?.id}`);
      const data: UserProfile = await res.json();
      setUserProfile({
        name: data?.name,
        email: data?.email,
      });
      loaderStore.hide();
    } catch (error) {
      console.error('Error fetching user data:', error);
      toast.error('Failed to load user profile.');
    } finally {
      loaderStore.hide();
    }
  };

  useEffect(() => {
    if (session?.user?.id) {
      fetchUser();
    }
  }, [session]);

  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleSubmit = async (data: any, isAdd: boolean) => {
    const id = session?.user?.id as string;
    loaderStore.show();
    const { name, email, password } = data;
    if (!name || !email || (isAdd && !password)) {
      toast.warning('All fields are required.');
      loaderStore.hide();
      return;
    }
    if (!password) {
      delete data.password;
      delete data.confirmPassword;
    }
    try {
      const res = await fetch(`/api/profile${isAdd ? '' : '/' + id}`, {
        method: isAdd ? "POST" : "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (res.ok) {
        toast.success('Profile updated successfully');
        setIsEditing(false);
        fetchUser();
      } else {
        if (res.status === 409) {
          toast.error('This email already exists.');
        } else {
          toast.error(`Error ${isAdd ? 'saving' : 'editing'} profile data.`);
        }
      }
      loaderStore.hide();
    } catch (error) {
      console.log("Error during profile update:", error);
      loaderStore.hide();
      toast.error('Failed to update profile.');
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-4">
      <div className="bg-white shadow-md rounded-lg p-6">
        <Modal isOpen={isEditing} onClose={() => setIsEditing(false)}>
          <h2 className="text-lg font-medium mb-4">Edit Profile</h2>
          <UserForm initialData={userProfile} onSubmit={handleSubmit} isAdd={false} isUser={true} />
        </Modal>
        <div className="flex flex-col items-center">
          <Image
            width={80}
            height={80}
            src="/uploads/user-male-circle--v1.png"
            alt="User Profile"
            className="h-20 w-20 rounded-full"
          />
          <h2 className="mt-4 text-2xl font-semibold text-gray-800">{userProfile.name}</h2>
          <p className="mt-2 text-gray-600">{userProfile.email}</p>
          <button
            onClick={handleEditClick}
            className="mt-6 bg-blue-500 text-white px-4 py-2 rounded"
          >
            Edit
          </button>
        </div>
      </div>
    </div>
  );
};

export default Profile;
