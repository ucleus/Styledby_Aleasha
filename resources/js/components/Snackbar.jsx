import React, { useEffect } from 'react';

const Snackbar = ({ message, onClose }) => {
    useEffect(() => {
        if (!message) return;
        const timer = setTimeout(onClose, 4000);
        return () => clearTimeout(timer);
    }, [message, onClose]);

    if (!message) return null;

    return (
        <div className="fixed bottom-4 left-1/2 -translate-x-1/2 bg-gray-800 text-white px-4 py-2 rounded shadow-lg z-50">
            {message}
        </div>
    );
};

export default Snackbar;
