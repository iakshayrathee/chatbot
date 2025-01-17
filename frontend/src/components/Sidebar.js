import React from 'react';

const Sidebar = ({ users, selectedUser, onSelectUser }) => {
  return (
    <div className='w-1/4 border-r p-4 bg-gray-100 h-full'>
      <h2 className='font-bold text-lg mb-4'>Users</h2>
      <ul className='list-none p-0'>
        {users.map((user) => (
          <li
            key={user}
            className={`p-2 cursor-pointer rounded hover:bg-gray-300 transition ${
              selectedUser === user ? 'bg-gray-200' : ''
            }`}
            onClick={() => onSelectUser(user)}
          >
            {user}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Sidebar;
