"use client";

import { Button } from '@mui/material';
import { DataGrid, GridRowsProp, GridColDef } from '@mui/x-data-grid';
import { useRouter } from "next/navigation";
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import ModalAlert from "@/components/modal/ConfirmModal";
import UserForm from '@/components/user/UserForm';
import Modal from '@/components/modal/Modal';
import Link from 'next/link';

interface User {
  id?: number;
  name: string;
  email: string;
  role: string;
  status: string;
  _id?:any
}

interface UserFormData {
  name: string;
  email: string;
  role: string;
  status: string;
  password?: string;
  confirmPassword?: string;
}

const Page = () => {
  const [user, setUser] = useState<User[]>([]);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [isModalOpenDelete, setIsModalOpenDelete] = useState<boolean>(false);
  const [initialData, setInitialData] = useState<User | {}>({});
  const [isAdd, setIsAdd] = useState<boolean>(false);
  const router = useRouter();

  const fetchUser = async () => {
    try {
      const res = await fetch('/api/profile');
      const data: User[] = await res.json();
      const userData = data.map((value, i) => ({
        ...value,
        id: i + 1,
      }));
      setUser(userData);
    } catch (error) {
      console.error('Error fetching user data:', error);
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  const handleEdit = (data: User) => {
    setIsAdd(false);
    setInitialData(data);
    setIsModalOpen(true);
  };

  const handleDelete = (id: string) => {
    fetch(`/api/profile/${id}`, {
      method: 'DELETE',
    })
      .then((response) => response.json())
      .then(() => {
        toast.success('User deleted successfully');
        setIsModalOpenDelete(false);
        fetchUser();
      })
      .catch((error) => {
        console.error('Error deleting user data:', error);
        toast.error('Error deleting User data');
        setIsModalOpenDelete(false);
      });
  };

  const rows: GridRowsProp = user.map(user => ({ id: user.id, ...user }));

  const columns: GridColDef[] = [
    { field: 'id', headerName: 'ID', width: 90 },
    { field: 'name', headerName: 'Name', width: 150 },
    { field: 'email', headerName: 'Email', width: 200 },
    { field: 'role', headerName: 'Role', width: 200 },
    { field: 'status', headerName: 'Status', width: 110 },
    {
      field: 'actions',
      headerName: 'Actions',
      width: 150,
      renderCell: (params) => (
        <>
          <Button
            variant="contained"
            color="primary"
            size="small"
            style={{ marginRight: 16 }}
            onClick={() => handleEdit(params.row)}
          >
            Edit
          </Button>
          <Button
            variant="contained"
            color="secondary"
            size="small"
            onClick={() => setIsModalOpenDelete(true)}
          >
            Delete
          </Button>
          <ModalAlert
            isOpen={isModalOpenDelete}
            onClose={() => setIsModalOpenDelete(false)}
            onConfirm={() => handleDelete(params.row.id)}
          >
            Are you sure you want to delete this user?
          </ModalAlert>
        </>
      ),
    },
  ];

  const handleSubmit = async (data: UserFormData, isAdd: boolean) => {
    const id = (initialData as User)._id;
    const { name, email, role, status, password } = data;

    if (!name || !status || !email || !role || (isAdd && !password)) {
      toast.warning('Fill all fields are necessary.');
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
        toast.success('User Updated successfully');
        setIsModalOpen(false);
        fetchUser();
      } else {
        if (res.status === 409) {
          toast.error('This email already exists');
        } else {
          toast.error(`Error ${isAdd ? 'saving' : 'editing'} user data`);
        }
        console.log("User save data failed.", { res });
      }
    } catch (error) {
      console.log("Error during user update:", error);
    }
  };

  return (
    <div className='m-10'>
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <h2 className="text-lg font-medium mb-4">User Form</h2>
        <UserForm initialData={initialData} onSubmit={handleSubmit} isAdd={isAdd} />
      </Modal>
      <div className="flex justify-between p-2">
        <h2 className='flex items-center font-semibold ml-[10%] mb-2'>User List</h2>
        <button onClick={() => {
          setIsAdd(true);
          setIsModalOpen(true);
        }}>Add User</button>
      </div>
      <DataGrid rows={rows} columns={columns} />
    </div>
  );
};

export default Page;
