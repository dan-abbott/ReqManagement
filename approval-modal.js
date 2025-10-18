// Approval Modal Component
export const createApprovalModal = (h, icons) => {
    const { CheckCircle, XCircle } = icons;
    
    return ({
        selectedItem,
        approvalAction,
        setApprovalAction,
        approvalNotes,
        setApprovalNotes,
        handleApproveItem,
        onClose
    }) => {
        if (!selectedItem) return null;

        return h('div', { 
            className: 'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50' 
        },
            h('div', { className: 'bg-white rounded-lg p-6 w-full max-w-md' },
                h('h3', { className: 'text-xl font-bold mb-4' }, 'Review Item'),
                
                // Item info
                h('div', { className: 'mb-4 p-3 bg-gray-50 rounded' },
                    h('p', { className: 'text-sm text-gray-600 mb-1' }, 'Item'),
                    h('p', { className: 'font-medium' }, selectedItem.title)
                ),
                
                // Action selection
                h('div', { className: 'mb-4' },
                    h('label', { className: 'block text-sm font-medium mb-2' }, 'Action'),
                    h('div', { className: 'flex gap-3' },
                        h('button', {
                            onClick: () => setApprovalAction('approve'),
                            className: `flex-1 p-3 rounded border-2 flex items-center justify-center gap-2 ${
                                approvalAction === 'approve' 
                                    ? 'border-green-500 bg-green-50 text-green-700' 
                                    : 'border-gray-300 hover:border-green-300'
                            }`
                        },
                            h(CheckCircle, { size: 20 }),
                            ' Approve'
                        ),
                        h('button', {
                            onClick: () => setApprovalAction('reject'),
                            className: `flex-1 p-3 rounded border-2 flex items-center justify-center gap-2 ${
                                approvalAction === 'reject' 
                                    ? 'border-red-500 bg-red-50 text-red-700' 
                                    : 'border-gray-300 hover:border-red-300'
                            }`
                        },
                            h(XCircle, { size: 20 }),
                            ' Reject'
                        )
                    )
                ),
                
                // Notes
                h('div', { className: 'mb-6' },
                    h('label', { className: 'block text-sm font-medium mb-2' }, 'Notes (Optional)'),
                    h('textarea', {
                        value: approvalNotes,
                        onChange: (e) => setApprovalNotes(e.target.value),
                        placeholder: 'Add any comments about your decision...',
                        className: 'w-full border rounded px-3 py-2 h-24',
                        rows: 3
                    })
                ),
                
                // Action buttons
                h('div', { className: 'flex gap-2' },
                    h('button', {
                        onClick: () => handleApproveItem(selectedItem.id, approvalAction, approvalNotes),
                        className: `flex-1 px-4 py-2 rounded font-medium text-white ${
                            approvalAction === 'approve' 
                                ? 'bg-green-600 hover:bg-green-700' 
                                : 'bg-red-600 hover:bg-red-700'
                        }`
                    }, `${approvalAction === 'approve' ? 'Approve' : 'Reject'} Item`),
                    h('button', {
                        onClick: onClose,
                        className: 'flex-1 bg-gray-200 px-4 py-2 rounded hover:bg-gray-300'
                    }, 'Cancel')
                )
            )
        );
    };
};
