import React, { useState } from 'react';
import ProfileEdit from './components/ProfileEdit';
import ProfileView from './components/ProfileView';

const Profile = () => {
  const [isEdit, setIsEdit] = useState(false);

  return (
    <div>
      {isEdit ? (
        <ProfileEdit setEdit={setIsEdit} />
      ) : (
        <ProfileView setEdit={setIsEdit} />
      )}
    </div>
  );
};

export default Profile;
