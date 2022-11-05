module.exports = global.config = {

    jobTypeOptions: [
        { value: '', label: 'Any' },
        { value: 'academic', label: 'Teaching' },
        { value: 'non_academic', label: 'Non Teaching' },
        { value: 'administration', label: 'Administration' }
    ],

    statusOptions: [
        { value: '', label: 'Any' },
        { value: 'draft', label: 'Draft' },
        { value: 'submitted', label: 'Submitted' },
        { value: 'approved', label: 'Approved' },
        { value: 'rejected', label: 'Rejected' }
    ],

    statusColor: {
        "draft": "#ced4da",
        "submitted": "#20c997",
        "approved": "#20c997",
    }


    // SelectMenuProps: {
    //     PaperProps: {
    //         style: {
    //             maxHeight: 48 * 4.5 + 8,
    //             width: 250,
    //         },
    //     },
    // },

    

    // other global config variables you wish
};