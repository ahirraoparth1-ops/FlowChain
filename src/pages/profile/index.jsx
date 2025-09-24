import React, { useState, useEffect } from 'react';
import { useAuth } from '../../hooks/useAuth.jsx';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import Header from '../../components/ui/Header';

const Profile = () => {
  const { user, isAuthenticated, isLoading, updateProfile, logout } = useAuth();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    bio: '',
    company: '',
    location: '',
  });
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (user) {
      setFormData({
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        email: user.email || '',
        bio: user.bio || '',
        company: user.company || '',
        location: user.location || '',
      });
    }
  }, [user]);

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      window.location.href = '/api/login';
    }
  }, [isAuthenticated, isLoading]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      // Update the user profile
      const result = await updateProfile(formData);
      if (result.success) {
        setIsEditing(false);
      } else {
        console.error('Error saving profile:', result.error);
        // Handle error - could show a toast notification here
      }
    } catch (error) {
      console.error('Error saving profile:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    // Reset form data to original values
    if (user) {
      setFormData({
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        email: user.email || '',
        bio: user.bio || '',
        company: user.company || '',
        location: user.location || '',
      });
    }
    setIsEditing(false);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Please log in to view your profile</h2>
          <Button onClick={() => window.location.href = '/api/login'}>
            Log in with Google
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="bg-white shadow rounded-lg">
          {/* Profile Header */}
          <div className="px-6 py-8 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-6">
                {user?.profileImageUrl && (
                  <img
                    src={user.profileImageUrl}
                    alt="Profile"
                    className="h-20 w-20 rounded-full object-cover"
                  />
                )}
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">
                    {user?.firstName || user?.lastName ? 
                      `${user.firstName || ''} ${user.lastName || ''}`.trim() : 
                      'Your Profile'
                    }
                  </h1>
                  <p className="text-gray-600">{user?.email}</p>
                </div>
              </div>
              <div className="flex space-x-3">
                {!isEditing ? (
                  <Button 
                    onClick={() => setIsEditing(true)}
                    className="bg-blue-600 hover:bg-blue-700"
                  >
                    Edit Profile
                  </Button>
                ) : (
                  <>
                    <Button 
                      onClick={handleCancel}
                      variant="outline"
                    >
                      Cancel
                    </Button>
                    <Button 
                      onClick={handleSave}
                      disabled={isSaving}
                      className="bg-blue-600 hover:bg-blue-700"
                    >
                      {isSaving ? 'Saving...' : 'Save Changes'}
                    </Button>
                  </>
                )}
                <Button 
                  onClick={logout}
                  variant="outline"
                  className="text-red-600 border-red-600 hover:bg-red-50"
                >
                  Log Out
                </Button>
              </div>
            </div>
          </div>

          {/* Profile Form */}
          <div className="px-6 py-8">
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <div>
                <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-2">
                  First Name
                </label>
                <Input
                  id="firstName"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  placeholder="Enter your first name"
                />
              </div>

              <div>
                <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-2">
                  Last Name
                </label>
                <Input
                  id="lastName"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  placeholder="Enter your last name"
                />
              </div>

              <div className="sm:col-span-2">
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                  Email
                </label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  disabled={true} // Email usually can't be changed
                  placeholder="your@email.com"
                />
              </div>

              <div>
                <label htmlFor="company" className="block text-sm font-medium text-gray-700 mb-2">
                  Company
                </label>
                <Input
                  id="company"
                  name="company"
                  value={formData.company}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  placeholder="Your company"
                />
              </div>

              <div>
                <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-2">
                  Location
                </label>
                <Input
                  id="location"
                  name="location"
                  value={formData.location}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  placeholder="Your location"
                />
              </div>

              <div className="sm:col-span-2">
                <label htmlFor="bio" className="block text-sm font-medium text-gray-700 mb-2">
                  Bio
                </label>
                <textarea
                  id="bio"
                  name="bio"
                  rows={4}
                  value={formData.bio}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  placeholder="Tell us about yourself..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-50 disabled:text-gray-500"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;