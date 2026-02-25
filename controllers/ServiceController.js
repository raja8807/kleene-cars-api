const { Service, Category } = require('../models');

const getServices = async (req, res) => {
    try {
        const services = await Service.findAll({
            include: [{ model: Category, attributes: ['name'] }],
            order: [['name', 'ASC']]
        });
        res.status(200).json(services);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const createService = async (req, res) => {
    try {
        const service = await Service.create(req.body);
        res.status(201).json(service);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const updateService = async (req, res) => {
    try {
        const { id } = req.body;
        const [updated] = await Service.update(req.body, {
            where: { id: id }
        });
        if (updated) {
            const updatedService = await Service.findByPk(id);
            res.status(200).json(updatedService);
        } else {
            res.status(404).json({ error: 'Service not found' });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const deleteService = async (req, res) => {
    try {
        const { id } = req.query;
        const deleted = await Service.destroy({
            where: { id: id }
        });
        if (deleted) {
            res.status(200).json({ message: 'Deleted successfully' });
        } else {
            res.status(404).json({ error: 'Service not found' });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

module.exports = {
    getServices,
    createService,
    updateService,
    deleteService
};
