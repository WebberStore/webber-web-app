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
  const [confirmAction, setConfirmAction] = useState(null)
  const [showConfirmation, setShowConfirmation] = useState(false)

  // model to handel the confirmation
  const handleStatusChange = (status) => {
    setConfirmAction(() => () => {
      setData((prevData) =>
        prevData.map((user) =>
          user.id === selectedUser.id ? { ...user, status } : user
        )
      )
      setSelectedUser(null) // Close modal after action
    })
    setShowConfirmation(true)
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'Active':
        return 'bg-green-500'
      case 'Deactivate':
        return 'bg-gray-400'
      case 'Pending':
        return 'bg-orange-400'
      default:
        return 'bg-gray-400'
    }
  }

  const handleConfirm = () => {
    if (confirmAction) {
      confirmAction()
      setShowConfirmation(false) // Close confirmation panel
    }
  }

  const handleCancel = () => {
    setShowConfirmation(false) // Close confirmation panel
  }

  return (
    <div className="p-8">
      {/* Summary Cards */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        <div className="bg-white p-4 rounded-lg shadow-md flex items-center">
          <div className="bg-blue-100 p-3 rounded-full">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="blue"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              className="w-8 h-8"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 11c2.485 0 4.5-2.015 4.5-4.5S14.485 2 12 2 7.5 4.015 7.5 6.5 9.515 11 12 11zM12 13.5c-2.62 0-7.5 1.315-7.5 3.75V19.5c0 .828.672 1.5 1.5 1.5h12c.828 0 1.5-.672 1.5-1.5v-2.25c0-2.435-4.88-3.75-7.5-3.75z"
              />
            </svg>
          </div>
          <div className="ml-4">
            <h3 className="text-gray-500 text-sm">Active Customers</h3>
            <p className="text-black text-2xl font-bold">125</p>
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg shadow-md flex items-center">
          <div className="bg-orange-100 p-3 rounded-full">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="orange"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              className="w-8 h-8"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 11c2.485 0 4.5-2.015 4.5-4.5S14.485 2 12 2 7.5 4.015 7.5 6.5 9.515 11 12 11zM12 13.5c-2.62 0-7.5 1.315-7.5 3.75V19.5c0 .828.672 1.5 1.5 1.5h12c.828 0 1.5-.672 1.5-1.5v-2.25c0-2.435-4.88-3.75-7.5-3.75z"
              />
            </svg>
          </div>
          <div className="ml-4">
            <h3 className="text-gray-500 text-sm">Pending Customers</h3>
            <p className="text-black text-2xl font-bold">125</p>
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg shadow-md flex items-center">
          <div className="bg-red-100 p-3 rounded-full">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="red"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              className="w-8 h-8"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 11c2.485 0 4.5-2.015 4.5-4.5S14.485 2 12 2 7.5 4.015 7.5 6.5 9.515 11 12 11zM12 13.5c-2.62 0-7.5 1.315-7.5 3.75V19.5c0 .828.672 1.5 1.5 1.5h12c.828 0 1.5-.672 1.5-1.5v-2.25c0-2.435-4.88-3.75-7.5-3.75z"
              />
            </svg>
          </div>
          <div className="ml-4">
            <h3 className="text-gray-500 text-sm">Deactivated Customers</h3>
            <p className="text-black text-2xl font-bold">125</p>
          </div>
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
                <td className="py-2 px-4 border-b">
                  <button
                    className={`py-1 px-3 rounded-full text-white ${getStatusColor(
                      user.status
                    )}`}
                  >
                    {user.status}
                  </button>
                </td>
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
          <div className="bg-white p-6 rounded-lg shadow-lg w-96 relative">
            {/* Close Button */}
            <button
              onClick={() => setSelectedUser(null)}
              className="absolute top-2 right-2 text-gray-600 hover:text-gray-800"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                className="w-6 h-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>

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

            {/* Custom Confirmation */}
            {showConfirmation && (
              <div className="mt-6 p-4 bg-gray-100 rounded-lg">
                <p className="text-gray-700 mb-4">
                  Are you sure you want to proceed with this action?
                </p>
                <div className="flex justify-end space-x-4">
                  <button
                    onClick={handleConfirm}
                    className="bg-green-500 text-white py-2 px-4 rounded"
                  >
                    Confirm
                  </button>
                  <button
                    onClick={handleCancel}
                    className="bg-red-500 text-white py-2 px-4 rounded"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

export default AccountsActivate
