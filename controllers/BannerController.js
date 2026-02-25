const { Banner } = require('../models');

const getBanners = async (req, res) => {
    try {
        const banners = await Banner.findAll({
            order: [['created_at', 'DESC']]
        });
        res.status(200).json(banners);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const createBanner = async (req, res) => {
    try {
        const { title, image } = req.body;
        const banner = await Banner.create({ title, image });
        res.status(201).json(banner);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const deleteBanner = async (req, res) => {
    try {
        const { id } = req.query;
        const deleted = await Banner.destroy({
            where: { id: id }
        });
        if (deleted) {
            res.status(200).json({ message: 'Deleted successfully' });
        } else {
            res.status(404).json({ error: 'Banner not found' });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

module.exports = {
    getBanners,
    createBanner,
    deleteBanner
};
