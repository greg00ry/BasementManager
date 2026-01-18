import mongoose from "mongoose";

const url = "mongodb://127.0.0.1:27017/basementdb"
mongoose.connect(url)
const ingriedientSchema = new mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    name: {
        type: String,
        required: true
    },
    amount: {
        type: Number,
        required: false,
        default: 1
    },
    created: {
        type: Date,
        required: true,
        default: Date.now
    },
})
export const Ingriedient = mongoose.model("Ingriedient", ingriedientSchema)


//-------CRUDS------------
export async function makeIngriedient (name) {
    return await Ingriedient.create({
        _id: new mongoose.Types.ObjectId(),
        name: name
    })
}

export async function getAll() {
    return await Ingriedient.find({})
}

export async function getById(_id) {
    return await Ingriedient.findById({_id})
}

export async function deleteById(_id) {
    return await Ingriedient.findByIdAndDelete(_id)
}

export async function getByIdAndUpdate(_id, obj) {
    return await Ingriedient.getByIdAndUpdate(_id, obj)
}






