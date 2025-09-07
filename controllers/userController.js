const User = require('../models/User');
const DeletedUser = require('../models/DeletedUser'); // Naye model ko import kiya

// Dish 1: Active/Disabled users ki list bhejna
exports.getAllUsers = async (req, res) => {
    try {
        const users = await User.find({}).select('-passwordHash');
        res.json({ success: true, users: users });
    } catch (err) {
        res.status(500).json({ success: false, message: 'Server error aaya.', error: err.message });
    }
};

// Dish 2: Deleted users ki list bhejna
exports.getDeletedUsers = async (req, res) => {
    try {
        const users = await DeletedUser.find({});
        res.json({ success: true, users: users });
    } catch (err) {
        res.status(500).json({ success: false, message: 'Server error aaya.', error: err.message });
    }
};

// ... (updateUserStatus aur updateUserRole waise hi rahenge) ...
exports.updateUserStatus = async (req, res) => {
    try {
        const { status } = req.body;
        const user = await User.findByIdAndUpdate(req.params.id, { status }, { new: true });
        if (!user) return res.status(404).json({ success: false, message: 'User nahi mila.' });
        res.json({ success: true, message: 'User status successfully update ho gaya!' });
    } catch (err) {
        res.status(500).json({ success: false, message: 'Server error aaya.', error: err.message });
    }
};
exports.updateUserRole = async (req, res) => {
    try {
        const { role } = req.body;
        const user = await User.findByIdAndUpdate(req.params.id, { role }, { new: true });
        if (!user) return res.status(404).json({ success: false, message: 'User nahi mila.' });
        res.json({ success: true, message: 'User role successfully update ho gaya!' });
    } catch (err) {
        res.status(500).json({ success: false, message: 'Server error aaya.', error: err.message });
    }
};


// Dish 5: User ko "True Delete" karna (ek collection se doosre mein move karna)
exports.deleteUser = async (req, res) => {
    try {
        // 1. Pehle user ko 'users' collection se dhoondho
        const userToDelete = await User.findById(req.params.id);
        if (!userToDelete) {
            return res.status(404).json({ success: false, message: 'User nahi mila.' });
        }

        // 2. Uski details se ek naya 'DeletedUser' object banao
        const deletedUserRecord = new DeletedUser({
            username: userToDelete.username,
            email: userToDelete.email,
            role: userToDelete.role,
        });
        
        // 3. Uss naye object ko 'deletedusers' collection mein save karo
        await deletedUserRecord.save();
        
        // 4. Ab original user ko 'users' collection se poori tarah delete kar do
        await User.findByIdAndDelete(req.params.id);

        res.json({ success: true, message: 'User successfully delete ho gaya!' });
    } catch (err) {
        res.status(500).json({ success: false, message: 'Server error aaya.', error: err.message });
    }
};