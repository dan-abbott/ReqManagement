// Data handlers and CRUD operations
export const createHandlers = (supabase, user, state, setState) => {
    const { items, setItems, relationships, setRelationships, comments, setComments, auditLogs, setAuditLogs } = state;
    
    // Create audit log
    const createAuditLog = async (itemId, action, fieldName, oldValue, newValue) => {
        if (!supabase || !user) return;
        
        try {
            const logEntry = {
                item_id: itemId,
                user_email: user.email,
                user_name: user.user_metadata?.full_name || user.email,
                action: action,
                field_name: fieldName,
                old_value: oldValue ? String(oldValue) : null,
                new_value: newValue ? String(newValue) : null,
                timestamp: new Date().toISOString()
            };
            
            const { data, error } = await supabase.from('audit_logs').insert([logEntry]).select();
            
            if (error) throw error;
            
            if (data && data[0]) {
                setAuditLogs([data[0], ...auditLogs]);
            }
        } catch (error) {
            console.error('Error creating audit log:', error);
        }
    };
    
    // Create item
    const handleCreateItem = async (formData, selectedProject) => {
        if (!supabase) return;
        
        try {
            const newItem = {
                project_id: selectedProject.id,
                type: formData.type,
                title: formData.title,
                description: formData.description,
                rationale: formData.rationale || null,
                test_method: formData.test_method || null,
                status: formData.status,
                priority: formData.priority || null,
                owner: formData.owner || null,
                reviewer_email: formData.reviewer_email || null,
                parent_id: formData.parentId,
                children: [],
                version: 1
            };

            const { data, error } = await supabase.from('items').insert([newItem]).select();
            
            if (error) throw error;
            
            if (data && data[0]) {
                setItems([...items, data[0]]);
                
                await createAuditLog(data[0].id, 'create', null, null, `Created ${data[0].type}: ${data[0].title}`);
                
                if (formData.parentId) {
                    const parent = items.find(i => i.id === formData.parentId);
                    if (parent) {
                        const updatedChildren = [...(parent.children || []), data[0].id];
                        await supabase.from('items').update({ children: updatedChildren }).eq('id', formData.parentId);
                        setItems(prev => prev.map(item => 
                            item.id === formData.parentId 
                                ? { ...item, children: updatedChildren }
                                : item
                        ));
                    }
                }
            }
            
            return true;
        } catch (error) {
            console.error('Error creating item:', error);
            alert('Error creating item: ' + error.message);
            return false;
        }
    };
    
    // Update item
    const handleUpdateItem = async (id, updates) => {
        if (!supabase || !user) return;
        
        try {
            const item = items.find(i => i.id === id);
            
            // Create audit logs for each changed field
            for (const [key, newValue] of Object.entries(updates)) {
                const oldValue = item[key];
                if (oldValue !== newValue) {
                    await createAuditLog(id, 'update', key, oldValue, newValue);
                }
            }
            
            const { error } = await supabase
                .from('items')
                .update({ 
                    ...updates, 
                    version: item.version + 1,
                    updated_at: new Date().toISOString()
                })
                .eq('id', id);
            
            if (error) throw error;
            
            setItems(prev => prev.map(item => 
                item.id === id 
                    ? { ...item, ...updates, version: item.version + 1 }
                    : item
            ));
            
            return true;
        } catch (error) {
            console.error('Error updating item:', error);
            alert('Error updating item: ' + error.message);
            return false;
        }
    };
    
    // Approve/Reject item
    const handleApproveItem = async (itemId, action, notes) => {
        if (!supabase || !user) return false;
        
        const item = items.find(i => i.id === itemId);
        if (!item || item.reviewer_email !== user.email) {
            alert('Only the assigned reviewer can approve or reject this item.');
            return false;
        }
        
        try {
            const newStatus = action === 'approve' ? 'approved' : 'rejected';
            
            await createAuditLog(itemId, action, 'status', item.status, newStatus);
            if (notes) {
                await createAuditLog(itemId, 'review_notes', null, null, notes);
            }
            
            const { error } = await supabase
                .from('items')
                .update({ 
                    status: newStatus,
                    updated_at: new Date().toISOString()
                })
                .eq('id', itemId);
            
            if (error) throw error;
            
            setItems(prev => prev.map(i => 
                i.id === itemId 
                    ? { ...i, status: newStatus }
                    : i
            ));
            
            return true;
        } catch (error) {
            console.error('Error processing review:', error);
            alert('Error processing review: ' + error.message);
            return false;
        }
    };
    
    // Delete item
    const handleDeleteItem = async (id) => {
        if (!supabase) return;
        
        try {
            const item = items.find(i => i.id === id);
            
            if (item.parent_id) {
                const parent = items.find(i => i.id === item.parent_id);
                if (parent) {
                    const updatedChildren = parent.children.filter(c => c !== id);
                    await supabase.from('items').update({ children: updatedChildren }).eq('id', item.parent_id);
                }
            }
            
            const { error } = await supabase.from('items').delete().eq('id', id);
            
            if (error) throw error;
            
            setItems(prev => prev.filter(i => i.id !== id));
            setRelationships(prev => prev.filter(r => r.from_id !== id && r.to_id !== id));
            
            return true;
        } catch (error) {
            console.error('Error deleting item:', error);
            alert('Error deleting item: ' + error.message);
            return false;
        }
    };
    
    // Add comment
    const handleAddComment = async (itemId, newComment) => {
        if (!supabase || !newComment.trim() || !user) return;
        
        try {
            const comment = {
                item_id: itemId,
                author: user.user_metadata?.full_name || user.email,
                author_email: user.email,
                text: newComment,
                timestamp: new Date().toISOString()
            };
            
            const { data, error } = await supabase.from('comments').insert([comment]).select();
            
            if (error) throw error;
            
            if (data && data[0]) {
                setComments([data[0], ...comments]);
            }
            
            await createAuditLog(itemId, 'comment', null, null, newComment);
            
            return true;
        } catch (error) {
            console.error('Error adding comment:', error);
            alert('Error adding comment: ' + error.message);
            return false;
        }
    };
    
    // Add relationship
    const handleAddRelationship = async (from, to, type) => {
        if (!supabase) return;
        
        try {
            const relationship = {
                from_id: from,
                to_id: to,
                type: type
            };
            
            const { data, error } = await supabase.from('relationships').insert([relationship]).select();
            
            if (error) throw error;
            
            if (data && data[0]) {
                setRelationships([...relationships, data[0]]);
            }
            
            return true;
        } catch (error) {
            console.error('Error adding relationship:', error);
            alert('Error adding relationship: ' + error.message);
            return false;
        }
    };
    
    // Delete relationship
    const handleDeleteRelationship = async (relationshipId) => {
        if (!supabase) return;
        
        try {
            const { error } = await supabase.from('relationships').delete().eq('id', relationshipId);
            
            if (error) throw error;
            
            setRelationships(prev => prev.filter(r => r.id !== relationshipId));
            
            return true;
        } catch (error) {
            console.error('Error deleting relationship:', error);
            alert('Error deleting relationship: ' + error.message);
            return false;
        }
    };
    
    // Create project
    const handleCreateProject = async (projectData) => {
        if (!supabase || !user) return;
        
        try {
            const { data, error } = await supabase.from('projects').insert([projectData]).select();
            
            if (error) throw error;
            
            if (data && data[0]) {
                return data[0];
            }
        } catch (error) {
            console.error('Error creating project:', error);
            alert('Error creating project: ' + error.message);
        }
        
        return null;
    };
    
    return {
        handleCreateItem,
        handleUpdateItem,
        handleApproveItem,
        handleDeleteItem,
        handleAddComment,
        handleAddRelationship,
        handleDeleteRelationship,
        handleCreateProject,
        createAuditLog
    };
};
