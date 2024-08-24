"use client";

import { FC, ReactElement, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import JoditEditor from "jodit-react";
import UploadForm from "../image/UploadForm";
import Image from "next/image";
import React from "react";

interface PostFormProps {
  type?: "Add" | "Edit";
  handleSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
  postData: {
    title: string;
    description: string;
    category?: string;
    tags?: string[];
    content: string;
    image: string;
    status: "Draft" | "Published" | "";
  };
  setPostData: React.Dispatch<React.SetStateAction<{
    title: string;
    description: string;
    category?: string;
    tags?: string[];
    content: string;
    image: string;
    status: "Draft" | "Published" | "";
  }>>;
}

const PostForm: FC<PostFormProps> = ({ type = "Add", handleSubmit, postData, setPostData }) => {
  const [error, setError] = useState<string>("");
  const editorDescription = useRef<JoditEditor>(null);
  const editorContent = useRef<JoditEditor>(null);
  const [imageUrl, setImageUrl] = useState<string>(postData.image || '');

  const config = {
    readonly: false,
    askBeforePasteHTML: false,
    askBeforePasteFromWord: false,
    className: 'custom-class',
    defaultActionOnPaste: 'insert_clear_html',
    placeholder: 'Write ...',
    beautyHTML: true,
    toolbarButtonSize: "large",
    uploader: {
      insertImageAsBase64URI: true
    },
    zIndex: 0,
    activeButtonsInReadOnly: ['source', 'fullsize', 'print', 'about'],
    theme: 'default',
    enableDragAndDropFileToEditor: true,
    saveModeInCookie: false,
    spellcheck: false,
    editorCssClass: false,
    triggerChangeEvent: true,
    height: 220,
    direction: 'ltr',
    language: 'en',
    debugLanguage: false,
    i18n: 'en',
    tabIndex: -1,
    toolbar: true,
    enter: 'P',
    useSplitMode: false,
    colorPickerDefaultTab: 'background',
    imageDefaultWidth: 100,
    removeButtons: ['source', 'fullsize', 'about', 'outdent', 'indent', 'video', 'print', 'table', 'fontsize', 'superscript', 'subscript', 'file', 'cut', 'selectall'],
    disablePlugins: ['paste', 'stat'],
    textIcons: false,
    showXPathInStatusbar: false
  };

  useEffect(() => {
    setPostData(prevData => ({
      ...prevData,
      image: imageUrl
    }));
  }, [imageUrl, setPostData]);

  const categories = ["Technology", "Health", "Education", "Entertainment", "Business"];

  return (
    <div className="grid place-items-center h-screen">
      <div className="shadow-lg p-5 rounded-lg border-t-4 border-violet-600">
        <h1 className="text-xl font-bold my-4">{type === 'Edit' ? 'Edit Post' : 'Add Post'}</h1>
        <div className="flex">
          <div>
            <label htmlFor="postImage">Post Image</label>
            <UploadForm setImageUrl={setImageUrl} setError={setError} />
          </div>
          <div className="px-3">
            {error && <p className="text-red-500">{error}</p>}
            {imageUrl && (
              <div>
                <h3>Uploaded Image:</h3>
                <Image width={200} height={200} src={`https://reactadvance.s3.eu-north-1.amazonaws.com/${imageUrl}`} alt="Uploaded" />
              </div>
            )}
          </div>
        </div>
        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          <label htmlFor="title">Post Title</label>
          <input
            id="title"
            type="text"
            placeholder="Title"
            value={postData.title}
            onChange={(e) => setPostData(prevData => ({
              ...prevData,
              title: e.target.value
            }))}
            className="border rounded p-2"
          />
          <label htmlFor="description">Post Description</label>
          <JoditEditor
            ref={editorDescription}
            placeholder="Description"
            id="description"
            value={postData.description}
            config={config}
            onBlur={(newContent) => setPostData(prevData => ({
              ...prevData,
              description: newContent
            }))}
          />
          <label htmlFor="category" className="block text-sm font-medium text-gray-700">
            Category
          </label>
          <select
            id="category"
            name="category"
            value={postData.category}
            onChange={(e) => setPostData(prevData => ({
              ...prevData,
              category: e.target.value
            }))}
            className="mt-1 block w-full pl-3 pr-10 py-2 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          >
            <option value="">All Categories</option>
            {categories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
          <label htmlFor="tags" className="block text-sm font-medium text-gray-700">
            Tags
          </label>
          <ul className="mt-1 flex gap-2 list-inside list-none text-gray-700">
            {postData?.tags?.length > 0 ? (
              postData.tags.map((tag, index) => <li className="bg-purple-600 p-2 px-3 rounded-md text-white" key={index}>{tag}</li>)
            ) : (
              <li className="text-gray-400">No tags selected</li>
            )}
          </ul>
          <select
            id="tags"
            name="tags"
            multiple
            className="mt-1 block w-full h-32 pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
            value={postData.tags}
            onChange={(e) => {
              const selectedOptions = Array.from(e.target.selectedOptions, (option) => option.value);
              setPostData(prevData => ({
                ...prevData,
                tags: selectedOptions
              }));
            }}
          >
            <option>HTML</option>
            <option>CSS</option>
            <option>JavaScript</option>
            <option>React</option>
            <option>Next.js</option>
          </select>
          <label htmlFor="content">Post Content</label>
          <JoditEditor
            id="content"
            ref={editorContent}
            value={postData.content}
            config={config}
            onBlur={(newContent) => setPostData(prevData => ({
              ...prevData,
              content: newContent
            }))}
          />
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Status</label>
            <div className="flex items-center">
              <input
                id="draft"
                name="status"
                type="radio"
                value="Draft"
                checked={postData.status === "Draft"}
                onChange={() => setPostData(prevData => ({
                  ...prevData,
                  status: "Draft"
                }))}
                className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300"
              />
              <label htmlFor="draft" className="ml-2 block text-sm text-gray-700">
                Draft
              </label>
            </div>
            <div className="flex items-center mt-2">
              <input
                id="published"
                name="status"
                type="radio"
                value="Published"
                checked={postData.status === "Published"}
                onChange={() => setPostData(prevData => ({
                  ...prevData,
                  status: "Published"
                }))}
                className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300"
              />
              <label htmlFor="published" className="ml-2 block text-sm text-gray-700">
                Published
              </label>
            </div>
          </div>
          <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">
            {type === 'Edit' ? 'Edit Post' : 'Add Post'}
          </button>
          {error && (
            <div className="bg-red-500 text-white w-fit text-sm py-1 px-3 rounded-md mt-2">
              {error}
            </div>
          )}
        </form>
      </div>
    </div>
  );
};

export default PostForm;
