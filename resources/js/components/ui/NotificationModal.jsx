import React, { useEffect } from 'react';

const NotificationModal = ({ 
    isOpen, 
    onClose, 
    title, 
    message, 
    type = "success", // success, error, info, warning
    autoClose = true,
    autoCloseDelay = 3000
}) => {
    useEffect(() => {
        if (isOpen && autoClose) {
            const timer = setTimeout(() => {
                onClose();
            }, autoCloseDelay);

            return () => clearTimeout(timer);
        }
    }, [isOpen, autoClose, autoCloseDelay, onClose]);

    if (!isOpen) return null;

    const getTypeStyles = () => {
        switch (type) {
            case 'success':
                return {
                    icon: '✅',
                    bgColor: 'bg-green-100',
                    textColor: 'text-green-800',
                    borderColor: 'border-green-200'
                };
            case 'error':
                return {
                    icon: '❌',
                    bgColor: 'bg-red-100',
                    textColor: 'text-red-800',
                    borderColor: 'border-red-200'
                };
            case 'warning':
                return {
                    icon: '⚠️',
                    bgColor: 'bg-yellow-100',
                    textColor: 'text-yellow-800',
                    borderColor: 'border-yellow-200'
                };
            case 'info':
                return {
                    icon: 'ℹ️',
                    bgColor: 'bg-blue-100',
                    textColor: 'text-blue-800',
                    borderColor: 'border-blue-200'
                };
            default:
                return {
                    icon: '✅',
                    bgColor: 'bg-green-100',
                    textColor: 'text-green-800',
                    borderColor: 'border-green-200'
                };
        }
    };

    const styles = getTypeStyles();

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg max-w-md w-full shadow-xl">
                {/* Content */}
                <div className="p-6">
                    <div className="flex items-center space-x-4">
                        <div className={`w-12 h-12 rounded-full ${styles.bgColor} flex items-center justify-center`}>
                            <span className="text-2xl">{styles.icon}</span>
                        </div>
                        <div className="flex-1">
                            <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
                            <p className="text-sm text-gray-600 mt-1">{message}</p>
                        </div>
                    </div>

                    {autoClose && (
                        <div className="mt-4">
                            <div className={`w-full h-1 ${styles.bgColor} rounded-full overflow-hidden`}>
                                <div 
                                    className={`h-full ${styles.bgColor.replace('100', '500')} animate-pulse`}
                                    style={{
                                        animation: `shrink ${autoCloseDelay}ms linear forwards`
                                    }}
                                ></div>
                            </div>
                            <p className="text-xs text-gray-500 mt-2 text-center">
                                Auto-closing in {autoCloseDelay / 1000} seconds...
                            </p>
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="px-6 py-4 bg-gray-50 rounded-b-lg flex justify-end">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
                    >
                        Close
                    </button>
                </div>
            </div>

            <style jsx>{`
                @keyframes shrink {
                    from { width: 100%; }
                    to { width: 0%; }
                }
            `}</style>
        </div>
    );
};

export default NotificationModal;