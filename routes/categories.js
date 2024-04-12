const { uploadImage, uploadSingleImage, uploadToCloudinary, uploadLoadedImage } = require("../middlewares/uploadFile");
const router = require("express").Router();
const {
  verifyTokenAndAdmin,
  verifyTokenAndAuthorization,
  verifyToken,
} = require("../controllers/verifyToken");

const {
  createCategory,
  updateCategory,
  deleteCategory,
  getCategory,
  getCategories,
  createCategoryWithSubcategories,
  createSubcategory,
  updateSubcategory,
  deleteSubcategory,
  getSubcategory,
  getSubcategories
} = require("../controllers/categories");

// CATEGORIES

// Create a new category
router.post("/", verifyTokenAndAdmin, uploadSingleImage, uploadToCloudinary, createCategory);

// Update a category
router.put("/:id", verifyTokenAndAdmin, updateCategory);

// Delete a category
router.delete("/:id", verifyTokenAndAdmin, deleteCategory);

// Get a single category
router.get("/:id", getCategory);

// Get all categories
router.get("/", getCategories);

// create new category with subcategories
router.post('/batch', createCategoryWithSubcategories);

module.exports = router;
