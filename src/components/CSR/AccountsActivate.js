import React, { useState } from 'react'

const AccountsActivate = () => {
  const [data, setData] = useState([
    { id: 1, name: 'Kamal Perera', email: 'kmal@gmail.com', status: 'Active' },
    {
      id: 2,
      name: 'Nilantha Bandara',
      email: 'nile@gmail.com',
      status: 'Deactivate',
    },
    {
      id: 3,
      name: 'Kasun Bandara',
      email: 'kasun@gmail.com',
      status: 'Pending',
    },
  ])

  const [selectedUser, setSelectedUser] = useState(null)

  const handleStatusChange = (status) => {
    setData((prevData) =>
      prevData.map((user) =>
        user.id === selectedUser.id ? { ...user, status } : user
      )
    )
    setSelectedUser(null) // Close modal after action
  }

  return (
    <div className="p-8">
      {/* Summary Cards */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        <div className="bg-blue-100 p-6 rounded-lg shadow-md text-center">
          <h3 className="text-lg font-bold">Active Customers</h3>
          <p className="text-2xl">125</p>
        </div>
        <div className="bg-yellow-100 p-6 rounded-lg shadow-md text-center">
          <h3 className="text-lg font-bold">Pending Customers</h3>
          <p className="text-2xl">125</p>
        </div>
        <div className="bg-red-100 p-6 rounded-lg shadow-md text-center">
          <h3 className="text-lg font-bold">Deactivated Customers</h3>
          <p className="text-2xl">125</p>
        </div>
      </div>

      {/* Data Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white rounded-lg shadow-md">
          <thead>
            <tr>
              <th className="py-2 px-4 border-b">No</th>
              <th className="py-2 px-4 border-b">User</th>
              <th className="py-2 px-4 border-b">Email</th>
              <th className="py-2 px-4 border-b">Role</th>
              <th className="py-2 px-4 border-b">Status</th>
              <th className="py-2 px-4 border-b">Action</th>
            </tr>
          </thead>
          <tbody>
            {data.map((user, index) => (
              <tr key={user.id}>
                <td className="py-2 px-4 border-b">{index + 1}</td>
                <td className="py-2 px-4 border-b">{user.name}</td>
                <td className="py-2 px-4 border-b">{user.email}</td>
                <td className="py-2 px-4 border-b">Customer</td>
                <td className="py-2 px-4 border-b">{user.status}</td>
                <td className="py-2 px-4 border-b">
                  <button
                    onClick={() => setSelectedUser(user)}
                    className="bg-blue-500 text-white py-1 px-3 rounded"
                  >
                    Action
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      {selectedUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96">
            <h2 className="text-xl font-bold mb-4">
              Change Status for {selectedUser.name}
            </h2>
            <div className="flex space-x-4">
              <button
                onClick={() => handleStatusChange('Active')}
                className="bg-green-500 text-white py-2 px-4 rounded"
              >
                Activate
              </button>
              <button
                onClick={() => handleStatusChange('Deactivate')}
                className="bg-red-500 text-white py-2 px-4 rounded"
              >
                Deactivate
              </button>
            </div>
            <button
              onClick={() => setSelectedUser(null)}
              className="mt-4 text-gray-600 underline"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default AccountsActivate
