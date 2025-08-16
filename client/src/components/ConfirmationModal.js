import React from 'react';

const ConfirmationModal = ({
    isOpen,
    onClose,
    onConfirm,
    title = "Confirm Action",
    message = "Are you sure you want to proceed? This action cannot be undone.",
    confirmText = "Confirm",
    cancelText = "Cancel"
}) => {
    if (!isOpen) {
        return null;
    }

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl max-w-sm w-full">
                <div className="p-6">
                    <h2 className="text-xl font-bold text-gray-800">{title}</h2>
                    <p className="mt-2 text-gray-600">{message}</p>
                </div>
                <div className="bg-gray-50 px-6 py-4 flex justify-end space-x-4 rounded-b-lg">
                    <button
                        onClick={onClose}
                        className="bg-gray-200 text-gray-800 font-bold py-2 px-4 rounded hover:bg-gray-300"
                    >
                        {cancelText}
                    </button>
                    <button
                        onClick={onConfirm}
                        className="bg-red-600 text-white font-bold py-2 px-4 rounded hover:bg-red-700"
                    >
                        {confirmText}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ConfirmationModal;
