import express from 'express';
import {
  addSkill,
  getAllSkills,
  getUserSkill,
  deleteUserSkill,
  updateSkill
} from '../controllers/skillsControllers.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/', protect, addSkill);

router.get('/', getAllSkills);

router.get('/category/:category', getAllSkills); // Can reuse getAllSkills with category filter

router.get('/user/:id', getUserSkill);

router.put('/:id', protect, updateSkill);

router.delete('/:id', protect, deleteUserSkill);

export default router;