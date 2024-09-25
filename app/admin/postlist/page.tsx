"use client";

import Modal from "@/components/modal/ConfirmModal";
import { Button } from "@mui/material";
import { DataGrid, GridRowsProp, GridColDef } from "@mui/x-data-grid";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from 'react-toastify';
import { useEffect, useState } from "react";
import Image from "next/image";
import React from "react";
import loaderStore from "../../stores/loaderStore";

interface Post {
  id: number;
  postId: string;
  title: string;
  image: string;
  description: string;
  category: string;
  tags: string[];
  content: string;
  status: string;
}

const Settings = () => {
  const [post, setPost] = useState<Post[]>([]);
  const router = useRouter();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<string>('');

  const fetchPost = async () => {
    loaderStore.show();
    try {
      const res = await fetch('/api/post');
      const data = await res.json();

      const postData: Post[] = data.map((value: any, i: number) => ({
        id: i + 1,
        postId: value?._id,
        title: value?.title,
        image: value?.image,
        description: value?.description,
        category: value?.category,
        tags: value?.tags,
        content: value?.content,
        status: value?.status,
      }));

      setPost(postData);
      loaderStore.hide();
    } catch (error) {
      console.error('Error fetching post data:', error);
    }
  };

  useEffect(() => {
    fetchPost();
  }, []);

  const handleEdit = (id: string) => {
    loaderStore.show();
    router.push(`/admin/post/${id}`);
    loaderStore.hide();
  };

  const handleDelete = async (id: string) => {
    loaderStore.show();
    try {
      const response = await fetch(`/api/post/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        toast.success('Post deleted successfully');
        fetchPost();
        setIsModalOpen(false);
      } else {
        toast.error('Error deleting post data');
        setIsModalOpen(false);
      }
      loaderStore.hide();
    } catch (error) {
      console.error('Error deleting post data:', error);
      toast.error('Error deleting post data');
      setIsModalOpen(false);
      loaderStore.hide();
    }
  };

  const columns: GridColDef[] = [
    { field: 'id', headerName: 'ID', width: 90 },
    { field: 'title', headerName: 'Title', width: 150 },
    { field: 'category', headerName: 'Category', width: 150 },
    { field: 'tags', headerName: 'Tags', width: 150 },
    { field: 'status', headerName: 'Status', width: 150 },
    {
      field: 'image', headerName: 'Image', width: 200,
      renderCell: (params) => (
        <Image width={200} height={200} src={`${process.env.AWS_S3_BUCKET_URL || 'https://reactadvance.s3.eu-north-1.amazonaws.com'}/${params.value}`} alt={params.row.title} />
      ),
    },
    {
      field: 'description', headerName: 'Description', width: 300,
      renderCell: (params) => (
        <div
          style={{
            whiteSpace: 'normal',
            wordWrap: 'break-word',
            maxWidth: '100%',
            maxHeight: '100%',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
          }}
          dangerouslySetInnerHTML={{ __html: params.value }}
        />
      ),
    },
    {
      field: 'content', headerName: 'Content', width: 150,
      renderCell: (params) => (
        <div
          style={{
            whiteSpace: 'normal',
            wordWrap: 'break-word',
            maxWidth: '100%',
            maxHeight: '100%',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
          }}
          dangerouslySetInnerHTML={{ __html: params.value }}
        />
      ),
    },
    {
      field: 'actions',
      headerName: 'Actions',
      width: 200,
      renderCell: (params) => {
        return (
          <>
            <Button
              variant="contained"
              color="primary"
              size="small"
              style={{ marginRight: 16 }}
              onClick={() => handleEdit(params.row.postId)}
            >
              Edit
            </Button>
            <Button
              variant="contained"
              color="secondary"
              size="small"
              onClick={() => {setDeleteId(params.row.postId),setIsModalOpen(true)}}
            >
              Delete
            </Button>
            <Modal
              isOpen={isModalOpen}
              onClose={() => setIsModalOpen(false)}
              onConfirm={() => { handleDelete(deleteId) }}
            >
              Are you sure you want to delete this post?
            </Modal>
          </>
        );
      },
    }
  ];

  return (
    <div className='m-10'>
      <div className="flex justify-between p-2">
        <h2 className='flex items-center font-semibold ml-[10%] mb-2'>Post List</h2>
        <Link href="/admin/post"><button>Add Post</button></Link>
      </div>
      {post && <DataGrid rows={post} columns={columns} />}
    </div>
  );
};

export default Settings;
