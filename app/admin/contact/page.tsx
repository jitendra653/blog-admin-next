"use client";

import { DataGrid, GridRowsProp, GridColDef } from '@mui/x-data-grid';
import { useEffect, useState } from 'react';
import React from 'react';

interface User {
  id?: number;
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
}


const Page = () => {
  const [contact, setContact] = useState<User[]>([]);
  const fetchContact = async () => {
    try {
      const res = await fetch('/api/contact');
      const data: User[] = await res.json();
      const userData = data.map((value, i) => ({
        ...value,
        id: i + 1,
      }));
      setContact(userData);
    } catch (error) {
      console.error('Error fetching contact data:', error);
    }
  };

  useEffect(() => {
    fetchContact();
  }, []);

  const rows: GridRowsProp = contact.map(contact => ({ id: contact.id, ...contact }));

  const columns: GridColDef[] = [
    { field: 'id', headerName: 'ID', width: 90 },
    { field: 'name', headerName: 'Name', width: 150 },
    { field: 'email', headerName: 'Email', width: 200 },
    { field: 'phone', headerName: 'Phone', width: 100 },
    { field: 'subject', headerName: 'Subject', width: 110 },
    { field: 'message', headerName: 'Message', width: 250 }
  ];

  return (
    <div className='m-10'>
      <div className="flex justify-between p-2">
        <h2 className='flex items-center font-semibold ml-[10%] mb-2'>Contact List</h2>
      </div>
      <DataGrid rows={rows} columns={columns} />
    </div>
  );
};

export default Page;
