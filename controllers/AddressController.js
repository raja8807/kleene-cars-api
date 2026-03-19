function checkIsWithinRadius(checkLat, checkLng) {
    const R = 6371; // Earth radius in km
    const radiusKm = 5;

    const mainLat = 8.7246982;
    const mainLng = 77.773785;


    const dLat = (checkLat - mainLat) * Math.PI / 180;
    const dLng = (checkLng - mainLng) * Math.PI / 180;

    const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(mainLat * Math.PI / 180) *
        Math.cos(checkLat * Math.PI / 180) *
        Math.sin(dLng / 2) *
        Math.sin(dLng / 2);

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    const distance = R * c;

    return distance <= radiusKm;
}

const getIsWithinRadius = async (req, res) => {


    try {

        const { latitude, longitude } = req.body;

        const issWithinRadius = checkIsWithinRadius(latitude, longitude)


        res.status(200).json({
            data: issWithinRadius,
            success: true
        });
    } catch (error) {
        console.error('Error fetching customers:', error);
        res.status(500).json({ error: error.message });
    }
};


module.exports = {
    getIsWithinRadius
};