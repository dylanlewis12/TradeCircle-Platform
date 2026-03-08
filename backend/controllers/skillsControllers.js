import User from '../models/User.js';
import Skill from '../models/Skills.js';

/*
GET    /api/skills/search              - Search skills by name/category
GET    /api/skills/category/:category  - Get skills by category
GET    /api/skills/:id                 - Get skill details
*/

export const addSkill = async(req, res) => {
    try {
        const userId = req.user.id;
        const { name, description, icon, category, hoursAvailable, status, proficiencyLevel, yearsOfExperience,  } = req.body;

        if(!userId || !name || !category || !hoursAvailable || !status || !proficiencyLevel || !yearsOfExperience) {
            return res.status(404).json({ message: "Insuffient data. Missing required data fields" });
        }


        //category validation
        const validCategories = ["technology", "linguistic", "crafts", "services", "academic", "creative", "medical", "leadership", "business", "communication", "trades", "other"];
        if (category && !validCategories.includes(category)) {
            return res.status(400).json({ message: "Invalid category" });
        }

        // Create new skill
        const newSkill = new Skill({
            userId,
            name,
            description,
            icon,
            category: category || "other",
            hoursAvailable: hoursAvailable || 0,
            status: status || "active",
            proficiencyLevel: proficiencyLevel || "beginner",
            yearsOfExperience: yearsOfExperience || 0
        });

        await newSkill.save();

        res.status(201).json({
            message: "Skill created successfully",
            skill: newSkill
        });

    } catch(error) {
        res.status(500).json({ message: error.message });
    }
}

export const getAllSkills = async(req, res) => {
  try {
    const { page = 1, limit = 10, category, proficiencyLevel, listingType, status } = req.query;
    const skip = (page - 1) * limit;

    // Build filter object
    let filter = {};

    // Handle multiple categories
    if (category) {
      const categories = Array.isArray(category) ? category : [category];
      filter.category = { $in: categories };
    }

    // Handle multiple proficiency levels
    if (proficiencyLevel) {
      const levels = Array.isArray(proficiencyLevel) ? proficiencyLevel : [proficiencyLevel];
      filter.proficiencyLevel = { $in: levels };
    }

    // Handle multiple statuses
    if (status) {
      const statuses = Array.isArray(status) ? status : [status];
      filter.status = { $in: statuses };
    } else {
      // Default to active if no status filter specified
      filter.status = 'active';
    }

    // Handle listing type
    if (listingType) {
      filter.listingType = listingType;
    }

    const skills = await Skill.find(filter)
      .populate("userId", "userName profilePicture rating") // User Info
      .skip(skip)
      .limit(parseInt(limit))
      .sort({ createdAt: -1 }); // Sort by created date

    // Get total count for pagination
    const totalSkills = await Skill.countDocuments(filter);
    const totalPages = Math.ceil(totalSkills / limit);

    res.status(200).json({
      message: "Skills retrieved successfully",
      skills,
      pagination: {
        currentPage: parseInt(page),
        totalPages,
        totalSkills,
        limit: parseInt(limit)
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getUserSkills = async(req, res) => {
    try {
        const { userId } = req.params;
        const { category, proficiencyLevel, status } = req.query;
        
        console.log('getUserSkills called with userId:', userId); // Debug
        
        let filter = { userId };

        if (category) {
        const categories = Array.isArray(category) ? category : [category];
        filter.category = { $in: categories };
        }

        if (proficiencyLevel) {
        const levels = Array.isArray(proficiencyLevel) ? proficiencyLevel : [proficiencyLevel];
        filter.proficiencyLevel = { $in: levels };
        }

        if (status) {
        const statuses = Array.isArray(status) ? status : [status];
        filter.status = { $in: statuses };
        }

        console.log('Filter object:', filter); // Debug
        
        const skills = await Skill.find(filter).sort({ createdAt: -1 });
        
        console.log('Skills found:', skills.length); // Debug
        console.log('Skills:', skills); // Debug

        res.status(200).json({
        message: "User skills retrieved successfully",
        skills
        });
    } catch (error) {
        console.error('Error in getUserSkills:', error);
        res.status(500).json({ message: error.message });
    }
};

export const getNonUserSkills = async(req, res) => {
    try {
        const { userId } = req.params;
        const { category, proficiencyLevel, status } = req.query;
        
        console.log('getUserSkills called with userId:', userId); // Debug
        
        let filter = { 
            userId: {$ne : userId},
            status: 'active'
        };

        if (category) {
        const categories = Array.isArray(category) ? category : [category];
        filter.category = { $in: categories };
        }

        if (proficiencyLevel) {
        const levels = Array.isArray(proficiencyLevel) ? proficiencyLevel : [proficiencyLevel];
        filter.proficiencyLevel = { $in: levels };
        }

        if (status) {
        const statuses = Array.isArray(status) ? status : [status];
        filter.status = { $in: statuses };
        }

        console.log('Filter object:', filter); // Debug
        
      const skills = await Skill.find(filter)
        .populate('userId', 'id userName profilePicture rating email')  // Populate user details
        .sort({ createdAt: -1 });
          
        console.log('Skills found:', skills.length); // Debug
        console.log('Skills:', skills); // Debug

        res.status(200).json({
        message: "User skills retrieved successfully",
        skills
        });
    } catch (error) {
        console.error('Error in getUserSkills:', error);
        res.status(500).json({ message: error.message });
    }
};

export const deleteUserSkill = async(req,res) => {
    try {
        const skillId = req.params.id;
        const userId = req.user.id; //From protect middleware

        const skill = await Skill.findById(skillId);

        if(!skill) {
            return res.status(404).json({ message: "Skill not found" });
        }

        // Verify the skill belongs to the authenticated user
        if (skill.userId.toString() !== userId) {
        return res.status(403).json({ message: "You can only delete your own skills" });
        }

        //Delete skill
        await Skill.findByIdAndDelete(skillId);

        res.status(200).json({ message: "Skill deleted successfully" });
    } catch(error) {
        res.status(500).json({ message: error.message });
    }

}

export const updateSkill = async (req, res) => {
  try {
    const userId = req.user.id; // Authenticated user
    const skillId = req.params.id;
    const { name, description, category, listingType, proficiencyLevel, yearsOfExperience, hoursAvailable, status } = req.body;

    // Find the skill
    const skill = await Skill.findById(skillId);

    if (!skill) {
      return res.status(404).json({ message: "Skill not found" });
    }

    // Verify the skill belongs to the authenticated user
    if (skill.userId.toString() !== userId) {
      return res.status(403).json({ message: "You can only update your own skills" });
    }

    // Update only provided fields
    const updateData = {};
    if (name) updateData.name = name;
    if (description) updateData.description = description;
    if (category) updateData.category = category;
    if (listingType) updateData.listingType = listingType;
    if (proficiencyLevel) updateData.proficiencyLevel = proficiencyLevel;
    if (yearsOfExperience !== undefined) updateData.yearsOfExperience = yearsOfExperience;
    if (hoursAvailable !== undefined) updateData.hoursAvailable = hoursAvailable;
    if (status) updateData.status = status;
    updateData.updatedAt = Date.now();

    // Update the skill
    const updatedSkill = await Skill.findByIdAndUpdate(
      skillId,
      updateData,
      { new: true } // Returns updated document
    );

    res.status(200).json({
      message: "Skill updated successfully",
      skill: updatedSkill
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};