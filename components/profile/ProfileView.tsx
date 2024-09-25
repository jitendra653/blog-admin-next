import React from "react";

interface ProfileViewProps {
    profile: {
      name: string;
      email: string;
      bio: string;
    };
    onEdit: () => void;
  }
  
  const ProfileView = ({ profile, onEdit }: ProfileViewProps) => {
    return (
      <div className="bg-white p-4 rounded shadow-md">
        <h1 className="text-2xl font-bold mb-4">{profile.name}</h1>
        <p className="text-gray-700 mb-2">Email: {profile.email}</p>
        <p className="text-gray-700 mb-4">Bio: {profile.bio}</p>
        <button
          onClick={onEdit}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Edit Profile
        </button>
      </div>
    );
  };
  
  export default ProfileView;
  