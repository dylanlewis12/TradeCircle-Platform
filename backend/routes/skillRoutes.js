import express from 'express';
import {
  addSkill,
  getAllSkills,
  getUserSkills,
  deleteUserSkill,
  updateSkill,
  getNonUserSkills
} from '../controllers/skillsControllers.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/', protect, addSkill);

router.get('/', getAllSkills); //gets skills for all user

router.get('/category/:category', getAllSkills);

router.get('/user/:userId', getUserSkills); //gets skills of current user

router.get('/marketplace/:userId', getNonUserSkills);

router.put('/:id', protect, updateSkill);

router.delete('/:id', protect, deleteUserSkill);

export default router;