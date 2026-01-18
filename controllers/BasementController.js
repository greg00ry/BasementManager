import * as Basement from "../models/basement.model.js"
import * as Ingriedient from "../models/ingriedient.model.js"
import * as Recipe from "../models/recipe.model.js"
import * as Set from "../models/set.model.js"

export class BasementController {
    constructor() {
        this.init()
    }

    async init() {
        //await Basement.initBasement()
    }

    // ===== BASEMENT =====
    async getAllBasements() {
        return await Basement.getAll()
    }

    async getBasementById(_id) {
        return await Basement.getById(_id)
    }

    async updateBasementById(_id, obj) {
        return await Basement.getByIdAndUpdate(_id, obj)
    }

    async deleteBasementById(_id) {
        return await Basement.deleteById(_id)
    }

    // ===== INGRIEDIENTS =====
    async createIngriedient(name) {
        return await Ingriedient.makeIngriedient(name)
    }

    async getAllIngriedients() {
        return await Ingriedient.getAll()
    }

    async getIngriedientById(_id) {
        return await Ingriedient.getById(_id)
    }

    async deleteIngriedient(_id) {
        return await Ingriedient.deleteById(_id)
    }

    // ===== RECIPES =====
    async createRecipe(name, recipeType, stepsArr, ingredientsArr = []) {
        return await Recipe.makeRecipe(name, recipeType, stepsArr, ingredientsArr)
    }

    async getAllRecipes() {
        return await Recipe.getAll()
    }

    async getRecipeById(_id) {
        return await Recipe.getById(_id)
    }

    async deleteRecipe(_id) {
        return await Recipe.deleteById(_id)
    }

    async updateRecipe(_id, obj) {
        return await Recipe.getByIdAndUpdate(_id, obj)
    }

    // ===== SETS =====
    async createSet(type, name, recipe, ingridientsArr) {
        return await Set.makeSet(type, name, recipe, ingridientsArr)
    }

    async getAllSets() {
        return await Set.getAll()
    }

    async getSetById(_id) {
        return await Set.getById(_id)
    }

    async deleteSet(_id) {
        return await Set.deleteById(_id)
    }

    async updateSet(_id, obj) {
        return await Set.getByIdAndUpdate(_id, obj)
    }
}