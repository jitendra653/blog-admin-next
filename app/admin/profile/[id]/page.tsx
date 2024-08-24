"use client";

import UserForm from '@/components/user/UserForm';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';

interface EditFormProps {
  params: {
    id: string;
  };
}

interface User {
  name: string;
  email: string;
  status: string;
  role: string;
}

interface UserData {
  title: string;
  image: string;
  description: string;
  content: string;
}

const Register: React.FC<EditFormProps> = ({ params }) => {
  const { id } = params;
  const router = useRouter();
  const [formData, setFormData] = useState<User | undefined>(undefined);
  const [userData, setUserData] = useState<UserData>({
    title: '',
    image: '',
    description: '',
    content: '',
  });

  useEffect(() => {
    if (id) {
      fetch(`/api/profile/${id}`)
        .then((response) => response.json())
        .then((data: User) => {
          setUserData((prev) => ({
            ...prev,
            title: data.name, 
            image: data.email,
            description: data.status || '', 
            content: data.role || '' 
          }));
          setFormData({ name: data.name, email: data.email,status:'',role: '' });
        })
        .catch((error) => {
          console.error('Error fetching user data:', error);
          toast.error('Failed to load user data');
        });
    }
  }, [id]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const { title, description, image } = userData;
    if (!title || !description || !image) {
      toast.warning('All fields are necessary.');
      return;
    }
    try {
      const res = await fetch(`/api/post/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userData),
      });

      if (res.ok) {
        toast.success('Post edited successfully');
        router.push("/admin/postlist");
      } else {
        toast.error('Error editing post data');
      }
    } catch (error) {
      console.error("Error during post editing:", error);
      toast.error('An unexpected error occurred');
    }
  };

  return formData ? (
    <UserForm initialData={formData} onSubmit={handleSubmit} isAdd={false} />
  ) : null;
};

export default Register;
