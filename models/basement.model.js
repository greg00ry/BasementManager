import mongoose, { set } from "mongoose";
import * as Ingriedient from "./ingriedient.model.js"
import * as Recipe from "./recipe.model.js"
import * as Set from "./set.model.js"
import { log } from "console";

const url = "mongodb://127.0.0.1:27017/basementdb"
mongoose.connect(url)
const basementSchema = new mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    sets: [{
        type: mongoose.Schema.ObjectId,
        ref: "Set"
    }],
    created: {
        type: Date,
        required: true,
        default: Date.now
    },
})
const Basement = mongoose.model("Basement", basementSchema)




// przykladowa tablica steps - potrzebna do createSampleBasement()
const stepsArr = [
    "1. Przykladowy krok",
    "2. Przykladowy krok",
    "3. Przykladowy krok",
    "4. Przykladowy krok",
    "5. Przykladowy krok",
    "6. Przykladowy krok",
    "7. Przykladowy krok",
    "8. Przykladowy krok"
]

//const typesArr = ["Wine", "Beer", "Cider", "Strong"] - Dostepne "typy" trunkow.

// funkcje tworzące rekordy w bazie danych //
async function createIng(name) {
    return await Ingriedient.makeIngriedient(name)
}
async function createRecipe(stepArr) {
    return await Recipe.makeRecipe(stepArr)
}
async function createSet(type, name, recipe, ingridientsArr) {
    return await Set.makeSet(type, name, recipe, ingridientsArr)
}
export async function createBasement(setArray) {
    return await Basement.create({
        _id: new mongoose.Types.ObjectId(),
        sets: setArray
    })
}
//-------------------CRUDS---------------------//

export async function getAll() {
    return await Basement.find({}).populate('sets')
}

export async function getById(_id) {
    return await Basement.findById({_id}).populate('sets')
}

export async function deleteById(_id) {
    return await Basement.deleteById({_id})
}

export async function getByIdAndUpdate(_id, obj) {
    return await Basement.getByIdAndUpdate(_id, obj)
}


//funkcja tworzaca przykladową piwniczkę// 
async function createSampleBasement() {

    

    const cukier = await Ingriedient.makeIngriedient("Cukier")
    const drozdze = await createIng("Drozdze")
    const winogrono = await createIng("winogrono")
    const spirytus = await createIng("Spirytus")
    const wisnie = await createIng("Wiśnie")
    const jablka = await createIng("Jabłka")
    const chmiel = await createIng("Chmiel")
    const slod = await createIng("Słód")


    console.log(cukier)

    let beerIng = []
    beerIng.push(chmiel)
    beerIng.push(slod)
    beerIng.push(drozdze)


    let winoIng = []
    winoIng.push(winogrono)
    winoIng.push(cukier)
    winoIng.push(drozdze)

    let nalewkaIng = []
    nalewkaIng.push(wisnie)
    nalewkaIng.push(spirytus)
    nalewkaIng.push(cukier)

    let cydrIng = []
    cydrIng.push(jablka)
    cydrIng.push(cukier)
    cydrIng.push(drozdze)

    const sampleRecipe = await createRecipe(stepsArr)

    const beer = await createSet("Beer", "Piwo", sampleRecipe, beerIng)
    const wine = await createSet("Wine", "Wino", sampleRecipe, winoIng)
    const strong = await createSet("Strong", "Nalewka", sampleRecipe, nalewkaIng)
    const cider = await createSet("Cider", "Cydr", sampleRecipe, cydrIng)

    const setArray = []
    setArray.push(beer)
    setArray.push(wine)
    setArray.push(strong)
    setArray.push(cider)

    const basement = await createBasement(setArray)

    return basement

}


export async function initBasement() {


    await Basement.deleteMany({})
    await Set.Set.deleteMany({})
    await Ingriedient.Ingriedient.deleteMany({})
    await Recipe.Recipe.deleteMany({})


    try{
        
        const basementDB = await Basement.find({})
        console.log("Num basement in db:", basementDB.length);
        
        if (basementDB.length === 0) {
            const sampleBasement = await createSampleBasement()
            console.log("DB created");
            
        }
        
        
    } catch(err) {
        console.log(err);
    }
    
}
