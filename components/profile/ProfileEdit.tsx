import React from 'react';
import { useState } from 'react';

interface ProfileEditProps {
  profile: {
    name: string;
    email: string;
    bio: string;
  };
  onSave: (profile: { name: string; email: string; bio: string }) => void;
  onCancel: () => void;
}

const ProfileEdit = ({ profile, onSave, onCancel }: ProfileEditProps) => {
  const [formData, setFormData] = useState(profile);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = () => {
    onSave(formData);
  };

  return (
    <div className="bg-white p-4 rounded shadow-md">
      <div className="mb-4">
        <label className="block text-sm font-bold mb-1" htmlFor="name">
          Name
        </label>
        <input
          id="name"
          name="name"
          type="text"
          value={formData.name}
          onChange={handleChange}
          className="w-full border rounded p-2"
        />
      </div>
      <div className="mb-4">
        <label className="block text-sm font-bold mb-1" htmlFor="email">
          Email
        </label>
        <input
          id="email"
          name="email"
          type="email"
          value={formData.email}
          onChange={handleChange}
          className="w-full border rounded p-2"
        />
      </div>
      <div className="mb-4">
        <label className="block text-sm font-bold mb-1" htmlFor="bio">
          Bio
        </label>
        <textarea
          id="bio"
          name="bio"
          value={formData.bio}
          onChange={handleChange}
          className="w-full border rounded p-2"
        />
      </div>
      <button
        onClick={handleSubmit}
        className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 mr-2"
      >
        Save
      </button>
      <button
        onClick={onCancel}
        className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
      >
        Cancel
      </button>
    </div>
  );
};

export default ProfileEdit;
