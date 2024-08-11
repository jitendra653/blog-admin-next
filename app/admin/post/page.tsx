"use client";
import { toast } from "react-toastify";
import PostForm from "../../../components/post/PostForm";
import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";

interface PostData {
  title: string;
  image: string;
  description: string;
  content: string;
  category?: string;
  tags?: string[];
  status: "Draft" | "Published" | "";
}

const AddPost = () => {
  const [postData, setPostData] = useState<PostData>({
    title: '',
    image: '',
    description: '',
    content: '',
    category: '',
    tags: [],
    status: '',
  });

  const router = useRouter();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const { title, description, image, status } = postData;

    if (!title || !description || !image || !status) {
      toast.warning('All fields are necessary.');
      alert("All fields are necessary.");
      return;
    }

    try {
      const res = await fetch("/api/post", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(postData),
      });

      if (res.ok) {
        toast.success('Post added successfully');
        router.push("/admin/postlist");
      } else {
        toast.error('Error editing post data');
      }
    } catch (error) {
      console.error("Error during post data save: ", error);
    }
  };

  return (
    <PostForm
      handleSubmit={handleSubmit}
      setPostData={setPostData}
      postData={postData}
    />
  );
}

export default AddPost;
