import Sidebar from "@/Components/Sidebar";
import React, { useState } from "react";

const Profile: React.FC = () => {
  const [profile, setProfile] = useState({
    name: "PRIYA",
    role: "Admin",
    email: "priya2003@gmail.com",
    phone: "9801970779",
    age: 20,
    address: "Salem",
    currentPassword: "",
  });

  const [file, setFile] = useState<File | null>(null);
  const [profileImage, setProfileImage] = useState<string>(
    "https://t4.ftcdn.net/jpg/03/87/95/83/240_F_387958369_JYlS0tXqtdg0WktKaE8jKnjuipySwEf6.jpg"
  );

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setProfile((prevProfile) => ({ ...prevProfile, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      setFile(selectedFile);

      // Generate a local URL for the selected file
      const fileURL = URL.createObjectURL(selectedFile);
      setProfileImage(fileURL);
    }
  };

  const handleEdit = () => {
    alert("Profile Updated!");
  };

  return (
    <>
      <Sidebar />
      <div className="flex flex-col items-center ml-28 mb-11 bg-gray-100 min-h-screen">
        <div className="w-full max-w-2xl p-6 bg-white shadow-lg rounded-lg mt-11">
          <h2 className="text-2xl font-semibold text-center mb-4 text-blue-600">
            Update Your Profile
          </h2>
          <div className="bg-green-100 p-4 rounded-lg text-center mb-6">
            <div className="w-24 h-24 bg-gray-200 rounded-full mx-auto mb-3">
              {profileImage ? (
                <img
                  src={profileImage}
                  alt="Profile"
                  className="w-full h-full rounded-full object-cover"
                />
              ) : (
                <span className="text-gray-500">No Image</span>
              )}
            </div>
            <h3 className="text-lg font-bold">{profile.name}</h3>
            <p className="text-gray-600">Role: {profile.role}</p>
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="mt-3 block mx-auto"
            />
          </div>
          <form>
            <div className="mb-4">
              <label className="block text-gray-600">Name</label>
              <input
                type="text"
                name="name"
                value={profile.name}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border rounded"
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-600">Email address</label>
              <input
                type="email"
                name="email"
                value={profile.email}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border rounded"
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-600">Phone</label>
              <input
                type="text"
                name="phone"
                value={profile.phone}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border rounded"
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-600">Age</label>
              <input
                type="number"
                name="age"
                value={profile.age}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border rounded"
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-600">Address</label>
              <input
                type="text"
                name="address"
                value={profile.address}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border rounded"
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-600">
                Current Password (required to update email)
              </label>
              <input
                type="password"
                name="currentPassword"
                value={profile.currentPassword}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border rounded"
              />
            </div>
            <button
              type="button"
              onClick={handleEdit}
              className="w-full bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            >
              Edit
            </button>
          </form>
        </div>
      </div>
    </>
  );
};

export default Profile;
