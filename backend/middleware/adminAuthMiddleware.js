import User from '../models/User';

//Must run authMiddkeware first before admin to get user object
export default async function adminAuth(req, res, next) {
    try {
        //Get user info
        let user =  await User.findById(req.user.id).select("isAdmin");

        //if user not found, throw error
        if(!user) {
            return res.status(400).json({ errors: [{ msg: 'Invalid Credentials' }] });
        }

        //if user has admin privileges continue, else throw error
        if(user.isAdmin) {
            next();
        } else {
            throw new Error("This user does not have admin privileges")
        }

    } catch(err) {
        console.error(err.message);
        res.status(403).json({ errors: err.message })
    }
}