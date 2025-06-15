
const Address = require('../../models/cart/Address');
// Add Address : /api/address/add
 const addAddress = async(req, res)=>{
    try {
        const { address, userId } = req.body
        await Address.create({...address, userId})
        res.json({success: true, message: "Address added successfully"})
    } catch (error) {
        console.log(error.message);
        res.json({ success: false, message: error.message });
    }
}

// Get Address : /api/address/get
 const getAddress = async(req, res)=>{
    try {
        const { userId } = req.body
        const addresses = await Address.find({userId})
        res.json({success: true, addresses})
    } catch (error) {
        console.log(error.message);
        res.json({ success: false, message: error.message });
    }
}
module.exports = {
    addAddress,
    getAddress,

};
