const { Category, Subcategory } = require('../models/Categories');

// ************* CATEGORIES **********************************

// Create a new category
exports.createCategory = async (req, res) => {
  try {
    const { name, description, featuredImage } = req.body;

    // Create a new category
    const category = new Category({
      name,
      description,
      featuredImage,
    });

    // Save the category to the database
    const savedCategory = await category.save();

    res.status(201).json(savedCategory);
  } catch (error) {
    res.status(500).json(error);
  }
};


// Update a category
exports.updateCategory = async (req, res) => {
  try {
    const categoryId = req.params.id;
    const { name, description } = req.body;

    // Find the category by ID
    const category = await Category.findById(categoryId);

    if (!category) {
      return res.status(404).json({ message: 'Category not found' });
    }

    // Update the category properties
    category.name = name;
    category.description = description;

    // Save the updated category to the database
    const updatedCategory = await category.save();

    res.status(200).json(updatedCategory);
  } catch (error) {
    res.status(500).json(error);
  }
};


// Delete a category
exports.deleteCategory = async (req, res) => {
  try {
    const categoryId = req.params.id;

    // Find and delete the category
    await Category.findByIdAndDelete(categoryId);

    res.status(200).json({ message: 'Category deleted successfully' });
  } catch (error) {
    res.status(500).json(error);
  }
};

// Get a single category
exports.getCategory = async (req, res) => {
  try {
    const categoryId = req.params.id;

    // Find the category by ID
    const category = await Category.findById(categoryId).populate({
      path: 'subcategories',
      select: 'name'
    });;

    if (!category) {
      return res.status(404).json({ message: 'Category not found' });
    }

    res.status(200).json(category);
  } catch (error) {
    res.status(500).json(error);
  }
};

// Get all categories
exports.getCategories = async (req, res) => {
  try {
    // Find all categories
    const categories = await Category.find().populate({
      path: 'subcategories',
      select: 'name'
    });

    res.status(200).json(categories);
  } catch (error) {
    res.status(500).json(error);
  }
};

exports.createCategoryWithSubcategories = async (req, res) => {
  const { name, description, featuredImage, subcategories } = req.body;

  try {
      // Step 1: Create subcategory documents
      const subcategoryDocuments = subcategories.map(subcat => ({
          name: subcat.name,
          description: subcat.description,
          parent: subcat.parent  // Ensure parent is set if needed, or remove if not
      }));

      const createdSubcategories = await Subcategory.insertMany(subcategoryDocuments);

      // Step 2: Create the category with references to the subcategories
      const category = new Category({
          name,
          description,
          featuredImage,
          subcategories: createdSubcategories.map(subcat => subcat._id)
      });

      const savedCategory = await category.save();

      // Populate subcategories in the response if needed
      await savedCategory.populate({
          path: 'subcategories',
          select: 'name description parent'
      }).execPopulate();

      res.status(201).json(savedCategory);
  } catch (error) {
      console.error('Error creating category with subcategories:', error);
      res.status(500).json({ message: "Failed to create category and subcategories", error: error.message });
  }
};