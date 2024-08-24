import React, { useState } from 'react';

interface UserFormProps {
  initialData?: {
    name: string;
    email: string;
    status: string;
    role: string;
  };
  isAdd:boolean;
  onSubmit: (data:React.FormEvent<HTMLFormElement>,isAdd?:boolean) => void;
}

const UserForm: React.FC<UserFormProps> = ({ initialData,isAdd, onSubmit }) => {
  const [formData, setFormData] = useState({
    name: initialData?.name || '',
    email: initialData?.email || '',
    status: initialData?.status === 'active',
    role: initialData?.role || '',
    password: '',
    confirmPassword: ''
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleToggleStatus = () => {
    setFormData({
      ...formData,
      status: !formData.status,
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      alert('Passwords do not match');
      return;
    }
    onSubmit({ ...formData, status: formData.status ? 'active' : 'inactive' },isAdd);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700">Name</label>
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">Email</label>
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">Password</label>
        <div className="relative">
          <input
            type={showPassword ? 'text' : 'password'}
            name="password"
            value={formData.password}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute inset-y-0 right-0 px-3 py-2 text-gray-500 bg-transparent"
          >
            {showPassword ? (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path d="M10 3a7 7 0 00-7 7 7 7 0 0012.61 3.5L18 14a1 1 0 001-1V7a1 1 0 00-1-1h-2.39a7.002 7.002 0 00-5.61-3zm5 5a1 1 0 00-1-1H6a1 1 0 100 2h8a1 1 0 001-1zM7 11a1 1 0 011-1h4a1 1 0 100-2H8a1 1 0 000 2 1 1 0 001 1zM10 6a1 1 0 00-1 1v4a1 1 0 100 2h4a1 1 0 100-2h-3a1 1 0 00-1-1z" />
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path d="M2 10c0-4.41 3.59-8 8-8s8 3.59 8 8-3.59 8-8 8-8-3.59-8-8zm3-1a5 5 0 1010 0H5z" />
              </svg>
            )}
          </button>
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">Confirm Password</label>
        <div className="relative">
          <input
            type={showConfirmPassword ? 'text' : 'password'}
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          />
          <button
            type="button"
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            className="absolute inset-y-0 right-0 px-3 py-2 text-gray-500 bg-transparent"
          >
            {showConfirmPassword ? (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path d="M10 3a7 7 0 00-7 7 7 7 0 0012.61 3.5L18 14a1 1 0 001-1V7a1 1 0 00-1-1h-2.39a7.002 7.002 0 00-5.61-3zm5 5a1 1 0 00-1-1H6a1 1 0 100 2h8a1 1 0 001-1zM7 11a1 1 0 011-1h4a1 1 0 100-2H8a1 1 0 000 2 1 1 0 001 1zM10 6a1 1 0 00-1 1v4a1 1 0 100 2h4a1 1 0 100-2h-3a1 1 0 00-1-1z" />
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path d="M2 10c0-4.41 3.59-8 8-8s8 3.59 8 8-3.59 8-8 8-8-3.59-8-8zm3-1a5 5 0 1010 0H5z" />
              </svg>
            )}
          </button>
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">Role</label>
        <select
          name="role"
          value={formData.role}
          onChange={handleChange}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
        >
          <option value="">Select Role</option>
          <option value="admin">Admin</option>
          <option value="user">User</option>
        </select>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">Status</label>
        <div className="flex items-center mt-1">
          <span className="mr-2">Inactive</span>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={formData.status}
              onChange={handleToggleStatus}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-500 dark:bg-gray-700 peer-checked:bg-indigo-600 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all"></div>
          </label>
          <span className="ml-2">Active</span>
        </div>
      </div>
      <div className='mx-auto flex justify-center'>
        <button
          type="submit"
          className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          Submit
        </button>
      </div>
    </form>
  );
};

export default UserForm;
