// Configuration
export const config = {
    SUPABASE_URL: 'https://ttkcqwsfdmlzxrndjrov.supabase.co',
    SUPABASE_KEY: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InR0a2Nxd3NmZG1senhybmRqcm92Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjA3MDczMTksImV4cCI6MjA3NjI4MzMxOX0.aQEDyTLZQC8t0Z1pOWG_zNMGpDTKWu_YYmLmZq2HgXc'
};

// Constants
export const itemTypes = ['epic', 'requirement', 'test-case', 'defect'];

export const statuses = {
    epic: ['draft', 'in-review', 'approved', 'rejected'],
    requirement: ['draft', 'in-review', 'approved', 'rejected'],
    'test-case': ['not-tested', 'pass', 'fail'],
    defect: ['not-started', 'in-process', 'resolved', 'backlog']
};

export const priorities = ['low', 'medium', 'high', 'critical'];

export const relationshipTypes = ['tests', 'depends-on', 'derives-from', 'relates-to'];
