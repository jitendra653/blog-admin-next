"use client";

import ProfileEdit from '@/components/profile/ProfileEdit';
import ProfileView from '@/components/profile/ProfileView';
import { useState, useEffect } from 'react';

interface ProfileData {
  name: string;
  email: string;
  bio: string;
}

const ProfilePage = () => {
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [profileData, setProfileData] = useState<ProfileData>({ name: '', email: '', bio: '' });

  useEffect(() => {
    fetch('/api/profile')
      .then((response) => response.json())
      .then((data: ProfileData) => setProfileData(data));
  }, []);

  const handleEditToggle = () => {
    setIsEditing(!isEditing);
  };

  const handleSave = (updatedProfile: ProfileData) => {
    fetch('/api/profile', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updatedProfile),
    })
      .then((response) => response.json())
      .then((data: ProfileData) => {
        setProfileData(data);
        setIsEditing(false);
      });
  };

  return (
    <div className="container mx-auto p-4">
      {isEditing ? (
        <ProfileEdit profile={profileData} onSave={handleSave} onCancel={handleEditToggle} />
      ) : (
        <ProfileView profile={profileData} onEdit={handleEditToggle} />
      )}
    </div>
  );
};

export default ProfilePage;
