const { getSupabaseAdmin, getSupabaseClient } = require('../config/supabase');
const { Worker, WorkerAssignment, Order } = require('../models');
const { generateShortId } = require('../utils/idGenerator');
const { Op } = require('sequelize');

const getWorkers = async (req, res) => {
    try {
        const { date, time, status } = req.query;
        const where = {};
        if (status) {
            where.status = status;
        }

        const workers = await Worker.findAll({
            where,
            include: [
                {
                    model: WorkerAssignment,
                    include: [
                        {
                            model: Order,
                            attributes: ['id', 'scheduled_date', 'scheduled_time', 'status'],
                        }
                    ]
                }
            ],
            order: [['created_at', 'DESC']]
        });

        if (date && time) {
            const results = workers.map(worker => {
                const isBusy = worker.WorkerAssignments?.some(wa =>
                    wa.Order?.scheduled_date === date &&
                    wa.Order?.scheduled_time === time &&
                    wa.Order?.status !== 'Cancelled'
                );

                const workerJson = worker.toJSON();
                workerJson.is_busy = isBusy;
                return workerJson;
            });
            return res.status(200).json(results);
        }

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

    const { name, email, phone, experience, password, id_proof_url } = req.body;

    if (!email || !name || !password) {
        return res.status(400).json({ success: false, message: "Name, Email and Password are required." });
    }

    const supabaseAdmin = getSupabaseAdmin();
    let authUser;

    try {
        // 1. Create Supabase Auth User
        const { data, error } = await supabaseAdmin.auth.admin.createUser({
            email,
            password: password || "worker@123",
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
            worker_id: generateShortId('WKR'),
            name,
            email,
            phone,
            experience,
            id_proof_url,
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

const updateWorker = async (req, res) => {
    try {
        const { id } = req.params;
        const worker = await Worker.findByPk(id);

        if (!worker) {
            return res.status(404).json({ success: false, message: "Worker not found" });
        }

        await worker.update(req.body);

        return res.status(200).json({
            success: true,
            message: "Worker updated successfully",
            worker
        });
    } catch (error) {
        console.error("Error updating worker:", error);
        return res.status(500).json({
            success: false,
            message: error.message || "Failed to update worker record."
        });
    }
};

const updateWorkerPushToken = async (req, res) => {
    try {

        console.log('ok');

        const { pushToken } = req.body;
        const authUserId = req.user.id;

        console.log(pushToken);


        if (!pushToken) {
            return res.status(400).json({ message: 'Push token is required' });
        }

        const worker = await Worker.findOne({ where: { auth_user_id: authUserId } });
        if (!worker) {
            return res.status(404).json({ message: 'Worker not found' });
        }

        const result = await worker.update({ push_token: pushToken });

        console.log(result);

        res.status(200).json({
            message: 'Push token updated successfully'
        });


    } catch (error) {
        console.error('Error in updateWorkerPushToken:', error);
        res.status(500).json({ message: 'Internal server error', error: error.message });
    }
};

const updateWorkerStatus = async (req, res) => {
    try {
        const { status } = req.body;
        const authUserId = req.user.id;

        if (!status) {
            return res.status(400).json({ message: 'Status is required' });
        }

        const worker = await Worker.findOne({ where: { auth_user_id: authUserId } });
        if (!worker) {
            return res.status(404).json({ message: 'Worker not found' });
        }

        await worker.update({ status });

        res.status(200).json({
            message: `Status updated to ${status} successfully`,
            status: worker.status
        });
    } catch (error) {
        console.error('Error in updateWorkerStatus:', error);
        res.status(500).json({ message: 'Internal server error', error: error.message });
    }
};

module.exports = {
    getWorkers,
    createWorker,
    updateWorker,
    updateWorkerPushToken,
    updateWorkerStatus
};

