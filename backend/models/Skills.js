const mongoose = require("mongoose");

const SkillSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
        index: true, // Index for faster queries
    },
    name: {
        type: String,
        required: true,
        trim: true, //Remove extra white space for skill name input
        index: true,
    },
    description: {
        type: String,
        default: "",
    },
    icon: {
        type: String,
        default: null,
    },
    category: {
        type: String,
        enum: [
            "technology",
            "languistic",
            "crafts",
            "services",
            "academic",
            "creative",
            "medical",
            "leadership",
            "business",
            "communication",
            "trades",
            "other",
        ],
        default: "other",
        index: true,
    },
    listingType: {
        type: String,
        enum: ["seeking", "offering"],
        required: true,
    },
    hoursAvailable: {
        type: Number,
        default: 0,
    },
    status: {
        type: String,
        enum: ["active", "fulfilled", "inactive"],
        default: "active", 
        index: true,
    },
    proficiencyLevel: {
        type: String,
        enum: ["beginner", "intermediate", "advanced", "expert"],
        default: "beginner",
    },
    yearsOfExperience: {
        type: Number,
        default: 0,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    updatedAt: {
        type: Date,
    }
});

//Create Skill schema indexes
SkillSchema.index({name: 1})
SkillSchema.index({category: 1})
SkillSchema.index({ category: 1, listingType: 1 }); // Browse offerings by category
SkillSchema.index({ userId: 1, status: 1 }); // User's active skills
SkillSchema.index({ status: 1, listingType: 1 }); // Active offerings/seekings

export default mongoose.model("Skill", SkillSchema);