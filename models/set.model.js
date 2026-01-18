

import mongoose, { mongo } from "mongoose";

const url = "mongodb://127.0.0.1:27017/basementdb"
mongoose.connect(url)


const typesArr = ["Wine", "Beer", "Cider", "Strong"]


const setSchema = new mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    name: {
        type: String,
        required: true
    },
    setType: {
        type: String,
        enum: typesArr,
        required: true
    },
    made: {
        type: Date,
        default: Date.now
    },
    comments: [{
        type: String,
        required: false,
        minLength: 0,
        maxLength: 10000
    }],
    recipe: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Recipe"
    }
    
})

export const Set = mongoose.model("Set", setSchema)

//-------CRUDS-------//

export async function makeSet(type, name, recipe) {
    return await Set.create({
        _id: new mongoose.Types.ObjectId(),
        name: name,
        setType: type,
        recipe: recipe
    })
}

export async function getAll() {
    return await Set.find({}).populate({
        path: 'recipe',
        populate: {
            path: 'ingredients'
        }
    })
}

export async function getById(_id) {
    return await Set.findById({_id}).populate({
        path: 'recipe',
        populate: {
            path: 'ingredients'
        }
    })
}

export async function deleteById(_id) {
    return await Set.deleteOne({_id})
}

export async function getByIdAndUpdate(_id, obj) {
    return await Set.findByIdAndUpdate(_id, obj, { new: true })
}


