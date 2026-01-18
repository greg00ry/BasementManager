import mongoose, { mongo } from "mongoose";

const url = "mongodb://127.0.0.1:27017/basementdb"
mongoose.connect(url)

const typesArr = ["Wine", "Beer", "Cider", "Strong"]

const recipeSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        minLength: 3,
        maxLength: 100
    },
    recipeType: {
        type: String,
        required: true,
        enum: typesArr
    },
    steps: [{
        type: String,
        minLength: 3,
        maxLength: 500
    }],
    ingredients: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Ingriedient"
    }],
    created: {
        type: Date,
        required: true,
        default: Date.now
    },
})
export const Recipe = mongoose.model("Recipe", recipeSchema)


//--------CRUDS---------
export async function makeRecipe(name, recipeType, stepsArr, ingredientsArr = []) {
    return await Recipe.create({
        name: name,
        recipeType: recipeType,
        steps: stepsArr,
        ingredients: ingredientsArr
    })
}
export async function getAll() {
    return await Recipe.find({}).populate("ingredients")
}

export async function getById(_id) {
    return await Recipe.findById(_id).populate("ingredients")
}

export async function deleteById(_id) {
    return await Recipe.findByIdAndDelete(_id)
}

export async function getByIdAndUpdate(_id, obj) {
    return await Recipe.findByIdAndUpdate(_id, obj, { new: true }).populate("ingredients")
}