const { getSupabaseClient } = require('../config/supabase');
const { User } = require('../models');

const getProfile = async (req, res) => {
    try {
        const supabase = getSupabaseClient(req.headers.authorization);
        const { data: { user }, error: authError } = await supabase.auth.getUser();

        if (authError || !user || user?.user_metadata?.role !== 'admin') {
            return res.status(401).json({ error: 'Unauthorized' });
        }

        // Fetch profile from our database using Sequelize
        const profile = await User.findOne({
            where: { id: user.id },
            attributes: ['role', 'full_name', 'phone', 'gender', 'avatar_url', 'id']
        });

        if (!profile) {
            // Logic from existing app: return generic role if strict profile not found, or maybe just 404
            // Existing app returned { role: 'customer' }
            return res.status(200).json({ role: 'customer' });
        }

        res.status(200).json(profile);
    } catch (error) {
        console.error('Error fetching profile:', error);
        res.status(500).json({ error: error.message });
    }
};

module.exports = {
    getProfile
};
