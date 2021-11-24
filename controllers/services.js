const Service = require('../app/models/Service')


// @desc Get all services
// @route GET /api/v1/services
// @access Public

exports.getServices = async (req, res, next) => {
    try {
        const services = await Service.find();

        return res.status(200).json({
            success: true,
            count: services.length,
            data: services
        })
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' })
    }
};

// @desc Create a service
// @route POST /api/v1/services
// @access Public

exports.addService = async (req, res, next) => {
    try {
        const service = await Service.create(req.body);

        return res.status(200).json({
            success: true,
            data: service
        })
    } catch (err) {
        console.error(err);
        if (err.code === 11000) {
            return res.status(400).json({ error: 'Your already in our community' })
        }
        res.status(500).json({ error: 'Server error' })
    }
};
