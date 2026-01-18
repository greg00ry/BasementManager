import express from "express"
import { body, param, validationResult } from "express-validator"
import { BasementController } from "./controllers/BasementController.js"

const basement = new BasementController()
const app = express()

app.use(express.json())
app.use(express.static('static'))

// ===== VALIDATION MIDDLEWARE =====
const handleValidationErrors = (req, res, next) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() })
    }
    next()
}

// ===== BASEMENT ENDPOINTS =====
app.get("/api/basement", async (req, res) => {
    try {
        const basementData = await basement.getAllBasements()
        res.json(basementData)
    } catch (err) {
        res.status(500).json({ error: err.message })
    }
})

app.get("/api/basement/:id", async (req, res) => {
    try {
        const basementData = await basement.getBasementById(req.params.id)
        res.json(basementData)
    } catch (err) {
        res.status(500).json({ error: err.message })
    }
})



app.put("/api/basement/:id", async (req, res) => {
    try {
        const basementData = await basement.updateBasementById(req.params.id, req.body)
        res.json(basementData)
    } catch (err) {
        res.status(500).json({ error: err.message })
    }
})

app.delete("/api/basement/:id", async (req, res) => {
    try {
        const basementData = await basement.deleteBasementById(req.params.id)
        res.json(basementData)
    } catch (err) {
        res.status(500).json({ error: err.message })
    }
})

// ===== SETS ENDPOINTS =====
app.get("/api/sets", async (req, res) => {
    try {
        const setsData = await basement.getAllSets()
        res.json(setsData)
    } catch (err) {
        res.status(500).json({ error: err.message })
    }
})

app.get("/api/sets/:id", async (req, res) => {
    try {
        const setData = await basement.getSetById(req.params.id)
        res.json(setData)
    } catch (err) {
        res.status(500).json({ error: err.message })
    }
})

app.post("/api/sets", 
    body("type").isIn(["Wine", "Beer", "Cider", "Strong"]).withMessage("Invalid set type"),
    body("name").notEmpty().trim().isLength({ min: 1, max: 100 }).withMessage("Name must be 1-100 characters"),
    body("recipe").notEmpty().withMessage("Recipe is required"),
    handleValidationErrors,
    async (req, res) => {
    try {
        const { type, name, recipe, ingridientsArr } = req.body
        const setData = await basement.createSet(type, name, recipe, ingridientsArr)
        res.status(201).json(setData)
    } catch (err) {
        res.status(500).json({ error: err.message })
    }
})

app.put("/api/sets/:id", 
    param("id").isMongoId().withMessage("Invalid ID format"),
    body("type").optional().isIn(["Wine", "Beer", "Cider", "Strong"]).withMessage("Invalid set type"),
    body("name").optional().trim().isLength({ min: 1, max: 100 }).withMessage("Name must be 1-100 characters"),
    handleValidationErrors,
    async (req, res) => {
    try {
        const setData = await basement.updateSet(req.params.id, req.body)
        res.json(setData)
    } catch (err) {
        res.status(500).json({ error: err.message })
    }
})

app.delete("/api/sets/:id", 
    param("id").isMongoId().withMessage("Invalid ID format"),
    handleValidationErrors,
    async (req, res) => {
    try {
        const setData = await basement.deleteSet(req.params.id)
        res.json(setData)
    } catch (err) {
        res.status(500).json({ error: err.message })
    }
})

// ===== INGRIEDIENTS ENDPOINTS =====
app.get("/api/ingriedients", async (req, res) => {
    try {
        const ingriedients = await basement.getAllIngriedients()
        res.json(ingriedients)
    } catch (err) {
        res.status(500).json({ error: err.message })
    }
})

app.get("/api/ingriedients/:id", async (req, res) => {
    try {
        const ingriedient = await basement.getIngriedientById(req.params.id)
        res.json(ingriedient)
    } catch (err) {
        res.status(500).json({ error: err.message })
    }
})

app.post("/api/ingriedients", 
    body("name").notEmpty().trim().isLength({ min: 1, max: 100 }).withMessage("Name must be 1-100 characters"),
    handleValidationErrors,
    async (req, res) => {
    try {
        const { name } = req.body
        const ingriedient = await basement.createIngriedient(name)
        res.status(201).json(ingriedient)
    } catch (err) {
        res.status(500).json({ error: err.message })
    }
})

app.delete("/api/ingriedients/:id", 
    param("id").isMongoId().withMessage("Invalid ID format"),
    handleValidationErrors,
    async (req, res) => {
    try {
        const ingriedient = await basement.deleteIngriedient(req.params.id)
        res.json(ingriedient)
    } catch (err) {
        res.status(500).json({ error: err.message })
    }
})

// ===== RECIPES ENDPOINTS =====
app.get("/api/recipes", async (req, res) => {
    try {
        const recipes = await basement.getAllRecipes()
        res.json(recipes)
    } catch (err) {
        res.status(500).json({ error: err.message })
    }
})

app.get("/api/recipes/:id", async (req, res) => {
    try {
        const recipe = await basement.getRecipeById(req.params.id)
        res.json(recipe)
    } catch (err) {
        res.status(500).json({ error: err.message })
    }
})

app.post("/api/recipes", 
    body("name").notEmpty().trim().isLength({ min: 1, max: 100 }).withMessage("Name must be 1-100 characters"),
    body("recipeType").isIn(["Beer", "Wine", "Cider", "Strong"]).withMessage("Invalid recipe type"),
    body("stepsArr").isArray({ min: 1 }).withMessage("Steps array must have at least 1 step"),
    body("ingredientsArr").optional().isArray().withMessage("Ingredients must be an array"),
    handleValidationErrors,
    async (req, res) => {
    try {
        const { name, recipeType, stepsArr, ingredientsArr } = req.body
        const recipe = await basement.createRecipe(name, recipeType, stepsArr, ingredientsArr || [])
        res.status(201).json(recipe)
    } catch (err) {
        res.status(500).json({ error: err.message })
    }
})

app.put("/api/recipes/:id", 
    param("id").isMongoId().withMessage("Invalid ID format"),
    body("name").optional().trim().isLength({ min: 1, max: 100 }).withMessage("Name must be 1-100 characters"),
    body("recipeType").optional().isIn(["Beer", "Wine", "Cider", "Strong"]).withMessage("Invalid recipe type"),
    body("stepsArr").optional().isArray().withMessage("Steps must be an array"),
    handleValidationErrors,
    async (req, res) => {
    try {
        const recipe = await basement.updateRecipe(req.params.id, req.body)
        res.json(recipe)
    } catch (err) {
        res.status(500).json({ error: err.message })
    }
})

app.delete("/api/recipes/:id", 
    param("id").isMongoId().withMessage("Invalid ID format"),
    handleValidationErrors,
    async (req, res) => {
    try {
        const recipe = await basement.deleteRecipe(req.params.id)
        res.json(recipe)
    } catch (err) {
        res.status(500).json({ error: err.message })
    }
})

app.listen(8080, () => {
    console.log("Server running on port 8080")
})






