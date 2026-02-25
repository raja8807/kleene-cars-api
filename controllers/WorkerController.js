const { getSupabaseAdmin, getSupabaseClient } = require('../config/supabase');
const { Worker } = require('../models');

const getWorkers = async (req, res) => {
    try {
        const workers = await Worker.findAll({
            order: [['created_at', 'DESC']]
        });
        res.status(200).json(workers);
    } catch (error) {
        console.error('Error fetching workers:', error);
        res.status(500).json({ error: error.message });
    }
};

const createWorker = async (req, res) => {
    if (req.method !== 'POST') {
        return res.status(405).json({ success: false, message: 'Method not allowed' });
    }

    const { name, email, phone, experience, password } = req.body;

    if (!email || !name) {
        return res.status(400).json({ success: false, message: "Name and Email are required." });
    }

    const supabaseAdmin = getSupabaseAdmin();
    let authUser;

    try {
        // 1. Create Supabase Auth User
        const { data, error } = await supabaseAdmin.auth.admin.createUser({
            email,
            password: password || "test@123",
            email_confirm: true,
            user_metadata: {
                role: "worker",
                name: name
            }
        });

        if (error) throw error;
        authUser = data.user;

        // 2. Insert into Workers Table
        const newWorker = await Worker.create({
            auth_user_id: authUser.id,
            name,
            email,
            phone,
            experience,
            status: "Active",
            rating: 0,
            assigned_orders_count: 0
        });

        return res.status(200).json({
            success: true,
            message: "Worker created successfully",
            workerId: authUser.id,
            worker: newWorker
        });

    } catch (error) {
        console.error("Error creating worker:", error);

        // Rollback: Delete the created auth user if DB insert fails (and user was created)
        if (authUser && authUser.id) {
            try {
                await supabaseAdmin.auth.admin.deleteUser(authUser.id);
            } catch (deleteError) {
                console.error("Failed to rollback auth user:", deleteError);
            }
        }

        return res.status(500).json({
            success: false,
            message: error.message || "Failed to create worker record."
        });
    }
};

module.exports = {
    getWorkers,
    createWorker
};
