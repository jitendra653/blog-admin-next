"use client";

import PostForm from '@/components/post/PostForm';
import { useRouter } from 'next/navigation';
import React from 'react';
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import loaderStore from '../../../stores/loaderStore';

interface EditFormProps {
  params: {
    id: string;
  };
}

interface PostData {
  title: string;
  image: string;
  description: string;
  content: string;
  category?: string;
  tags?: string[];
  status: "Draft" | "Published" | "";
}

const EditPost: React.FC<EditFormProps> = ({ params }) => {
  const { id } = params;
  const router = useRouter();
  const [postData, setPostData] = useState<PostData>({
    title: '',
    image: '',
    description: '',
    content: '',
    category: '',
    tags: [],
    status: '',
  });

  useEffect(() => {
    if (id) {
      loaderStore.show();
      fetch(`/api/post/${id}`)
        .then((response) => response.json())
        .then((data) => {
          setPostData({
            title: data?.title || '',
            image: data?.image || '',
            description: data?.description || '',
            content: data?.content || '',
            category: data?.category || '',
            tags: data?.tags || [],
            status: data?.status || '',
          });
          loaderStore.hide();
        })
        .catch((error) => {
          loaderStore.hide();
          console.error('Error fetching post data:', error)});
    }
  }, [id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    loaderStore.show();
    const { title, description, image } = postData;
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
        body: JSON.stringify(postData),
      });
      if (res.ok) {
        toast.success('Post edited successfully');
        router.push("/admin/postlist");
      } else {
        toast.error('Error editing post data');
      }
      loaderStore.hide();
    } catch (error) {
      loaderStore.hide();
      console.error("Error during editing: ", error);
    }
  };
  return <PostForm type="Edit" postData={postData} handleSubmit={handleSubmit} setPostData={setPostData} />;
}

export default EditPost;
