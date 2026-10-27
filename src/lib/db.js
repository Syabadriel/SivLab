import { supabase } from './supabase.js';

// Helper to convert snake_case to camelCase for item rows
function mapItemKeys(item) {
    if (!item) return null;

    // Map item_history from separate table relation if available
    const dbHistory = (item.item_history || []).map(h => ({
        date: h.created_at ? new Date(h.created_at).toISOString().split('T')[0] : '',
        text: h.description || '',
        action: h.action || ''
    }));

    // Fallback if there are no logs
    const history = dbHistory.length > 0 ? dbHistory : [
        { date: item.purchase_date, text: "Barang dicatat masuk ke inventaris" }
    ];

    return {
        id: item.id,
        code: item.code,
        name: item.name,
        categoryId: item.category_id,
        locationId: item.location_id,
        condition: item.condition,
        status: item.status,
        purchaseDate: item.purchase_date,
        price: item.price,
        supplier: item.supplier,
        responsibleId: item.responsible_id,
        responsible: item.profiles?.full_name || 'Tidak Ada',
        brand: item.brand,
        model: item.model,
        serial: item.serial,
        warranty: item.warranty,
        invoice: item.invoice,
        description: item.description,
        history,
    };
}

// Helper to convert snake_case to camelCase for borrowing rows
function mapBorrowingKeys(b) {
    if (!b) return null;
    return {
        id: b.id,
        code: b.code,
        itemId: b.item_id,
        itemCode: b.items?.code || '',
        itemName: b.items?.name || '',
        borrowerId: b.borrower_id,
        borrower: b.borrower_name || b.profiles?.full_name || 'Tidak Ada',
        purpose: b.purpose,
        borrowDate: b.borrow_date,
        returnDate: b.return_date,
        status: b.status,
    };
}

// Helper to convert snake_case to camelCase for maintenance rows
function mapMaintenanceKeys(m) {
    if (!m) return null;
    return {
        id: m.id,
        code: m.code,
        itemId: m.item_id,
        itemCode: m.items?.code || '',
        itemName: m.items?.name || '',
        type: m.type,
        cost: m.cost,
        date: m.date,
        status: m.status,
        technician: m.technician || 'Teknisi Lab',
    };
}

export const dbService = {
    // Authentication
    async signIn(email, password) {
        const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
            email,
            password,
        });
        if (authError) throw authError;

        const { data: profile, error: profError } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', authData.user.id)
            .single();

        if (profError) throw profError;
        return profile;
    },

    async signOut() {
        await supabase.auth.signOut();
    },

    async getCurrentProfile() {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return null;
        const { data: profile } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', user.id)
            .single();
        return profile;
    },

    async fetchProfiles() {
        const { data, error } = await supabase.from('profiles').select('*');
        if (error) throw error;
        return data;
    },

    // Categories
    async fetchCategories() {
        const { data, error } = await supabase.from('categories').select('*');
        if (error) throw error;
        return data;
    },

    async addCategory(name, icon = 'Tags', description = '') {
        const { data, error } = await supabase
            .from('categories')
            .insert({ name, icon, description })
            .select()
            .single();
        if (error) throw error;
        return data;
    },

    async deleteCategory(id) {
        const { error } = await supabase.from('categories').delete().eq('id', id);
        if (error) throw error;
        return true;
    },

    // Locations
    async fetchLocations() {
        const { data, error } = await supabase.from('locations').select('*');
        if (error) throw error;
        return data;
    },

    async addLocation(name, description = '') {
        const { data, error } = await supabase
            .from('locations')
            .insert({ name, description })
            .select()
            .single();
        if (error) throw error;
        return data;
    },

    async updateLocation(id, updates) {
        const { data, error } = await supabase
            .from('locations')
            .update(updates)
            .eq('id', id)
            .select()
            .single();
        if (error) throw error;
        return data;
    },

    async deleteLocation(id) {
        const { error } = await supabase.from('locations').delete().eq('id', id);
        if (error) throw error;
        return true;
    },

    // Items
    async fetchItems() {
        const { data, error } = await supabase
            .from('items')
            .select('*, profiles:responsible_id(full_name), item_history(*)');
        if (error) throw error;
        return (data || []).map(mapItemKeys);
    },

    async addItem(item) {
        const payload = {
            code: item.code,
            name: item.name,
            category_id: item.categoryId || null,
            location_id: item.locationId || null,
            condition: item.condition,
            status: item.status,
            purchase_date: item.purchaseDate,
            price: item.price,
            supplier: item.supplier,
            responsible_id: item.responsibleId || null,
            brand: item.brand,
            model: item.model,
            serial: item.serial,
            warranty: item.warranty,
            invoice: item.invoice,
            description: item.description,
        };

        const { data, error } = await supabase.from('items').insert(payload).select('*, profiles:responsible_id(full_name)').single();
        if (error) throw error;

        let insertedHistory = [];
        if (item.history && item.history.length > 0) {
            const historyPayload = item.history.map(h => ({
                item_id: data.id,
                description: h.text || 'Barang dicatat masuk ke inventaris',
                action: 'create'
            }));
            const { data: histData, error: histError } = await supabase
                .from('item_history')
                .insert(historyPayload)
                .select();
            if (!histError && histData) {
                insertedHistory = histData;
            } else if (histError) {
                console.error("Gagal menambahkan riwayat barang:", histError.message);
            }
        }

        const dataWithHistory = {
            ...data,
            item_history: insertedHistory
        };

        return mapItemKeys(dataWithHistory);
    },

    async updateItem(id, updates) {
        const payload = {};
        if (updates.code !== undefined) payload.code = updates.code;
        if (updates.name !== undefined) payload.name = updates.name;
        if (updates.categoryId !== undefined) payload.category_id = updates.categoryId;
        if (updates.locationId !== undefined) payload.location_id = updates.locationId;
        if (updates.condition !== undefined) payload.condition = updates.condition;
        if (updates.status !== undefined) payload.status = updates.status;
        if (updates.purchaseDate !== undefined) payload.purchase_date = updates.purchaseDate;
        if (updates.price !== undefined) payload.price = updates.price;
        if (updates.supplier !== undefined) payload.supplier = updates.supplier;
        if (updates.responsibleId !== undefined) payload.responsible_id = updates.responsibleId;
        if (updates.brand !== undefined) payload.brand = updates.brand;
        if (updates.model !== undefined) payload.model = updates.model;
        if (updates.serial !== undefined) payload.serial = updates.serial;
        if (updates.warranty !== undefined) payload.warranty = updates.warranty;
        if (updates.invoice !== undefined) payload.invoice = updates.invoice;
        if (updates.description !== undefined) payload.description = updates.description;

        const { data, error } = await supabase
            .from('items')
            .update(payload)
            .eq('id', id)
            .select('*, profiles:responsible_id(full_name), item_history(*)')
            .single();
        if (error) throw error;

        // If history updates are explicitly requested
        if (updates.history !== undefined && Array.isArray(updates.history) && updates.history.length > 0) {
            const historyPayload = updates.history.map(h => ({
                item_id: id,
                description: h.text || '',
                action: h.action || 'update'
            }));
            await supabase.from('item_history').insert(historyPayload);

            const { data: updatedItemWithHistory } = await supabase
                .from('items')
                .select('*, profiles:responsible_id(full_name), item_history(*)')
                .eq('id', id)
                .single();
            if (updatedItemWithHistory) {
                return mapItemKeys(updatedItemWithHistory);
            }
        }

        return mapItemKeys(data);
    },

    async deleteItem(id) {
        const { error } = await supabase.from('items').delete().eq('id', id);
        if (error) throw error;
        return true;
    },

    // Borrowings
    async fetchBorrowings() {
        const { data, error } = await supabase
            .from('borrowings')
            .select('*, items(code, name), profiles:borrower_id(full_name)');
        if (error) throw error;
        return (data || []).map(mapBorrowingKeys);
    },

    async addBorrowing(b) {
        const payload = {
            code: b.code,
            item_id: b.itemId,
            borrower_id: b.borrowerId || null,
            borrower_name: b.borrowerName || null,
            purpose: b.purpose,
            borrow_date: b.borrowDate,
            return_date: b.returnDate,
            status: b.status,
        };
        const { data, error } = await supabase
            .from('borrowings')
            .insert(payload)
            .select('*, items(code, name), profiles:borrower_id(full_name)')
            .single();
        if (error) throw error;
        return mapBorrowingKeys(data);
    },

    async updateBorrowing(id, updates) {
        const payload = {};
        if (updates.status !== undefined) payload.status = updates.status;
        if (updates.returnDate !== undefined) payload.return_date = updates.returnDate;

        const { data, error } = await supabase
            .from('borrowings')
            .update(payload)
            .eq('id', id)
            .select('*, items(code, name), profiles:borrower_id(full_name)')
            .single();
        if (error) throw error;
        return mapBorrowingKeys(data);
    },

    // Maintenance
    async fetchMaintenance() {
        const { data, error } = await supabase
            .from('maintenance')
            .select('*, items(code, name)');
        if (error) throw error;
        return (data || []).map(mapMaintenanceKeys);
    },

    async addMaintenance(m) {
        const payload = {
            code: m.code,
            item_id: m.itemId,
            type: m.type,
            cost: m.cost,
            date: m.date,
            status: m.status,
            technician: m.technician || null,
        };
        const { data, error } = await supabase
            .from('maintenance')
            .insert(payload)
            .select('*, items(code, name)')
            .single();
        if (error) throw error;
        return mapMaintenanceKeys(data);
    },

    async updateMaintenance(id, updates) {
        const payload = {};
        if (updates.status !== undefined) payload.status = updates.status;
        if (updates.cost !== undefined) payload.cost = updates.cost;

        const { data, error } = await supabase
            .from('maintenance')
            .update(payload)
            .eq('id', id)
            .select('*, items(code, name)')
            .single();
        if (error) throw error;
        return mapMaintenanceKeys(data);
    },

    // Notifications
    async fetchNotifications() {
        const { data, error } = await supabase
            .from('notifications')
            .select('*')
            .order('created_at', { ascending: false });
        if (error) throw error;
        return (data || []).map(n => ({
            id: n.id,
            text: n.text,
            time: new Date(n.created_at).toLocaleDateString(),
            unread: true, // We can default it or map if needed
            tone: 'info',
        }));
    },
};
