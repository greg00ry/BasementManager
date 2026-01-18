import { Drinks } from "./drinks.js"
import { Recipies } from "./recipies.js"
import { Home } from "./home.js"
import { AddDrink } from "./addDrink.js"
import { AddRecipe } from "./addRecipe.js"
import { IngrBase } from "./ingrBase.js"


class Basement {
    constructor() {
        this.addRecipe = null
        this.addDrink = null
        this.ingrBase = null
        this.drinks = null
        this.recipies = null
        this.init()
    }

    init() {
        this.homeButton = document.querySelector("#home-but")
        this.drinksButton = document.querySelector("#drinks-but")
        this.recipiesButton = document.querySelector("#recipies-but")
        this.addDrinkButton = document.querySelector("#show-add-drink-but")
        this.addRecipeButton = document.querySelector("#show-add-recipe-but")
        this.ingrBaseButton = document.querySelector("#ingr-base-but")
        this.exitAddRecipeBut = document.querySelector("#exit-add-recipe-modal")
        this.exitAddDrinkBut = document.querySelector("#exit-add-drink-modal")
        this.exitIngrBaseBut = document.querySelector("#exit-ingr-base")
        this.universalModal = document.querySelector("#universal-modal")
       
        this.appInformation = document.querySelector("#app-information")
        this.drinksMenu = document.querySelector("#drinks-menu")
        this.recipeMenu = document.querySelector("#recipe-menu")
        this.addRecipeModal = document.querySelector("#recipe-modal")
        this.addDrinkModal = document.querySelector("#add-drink-modal")
        this.ingrBase = document.querySelector("#ingr-base-modal")

        // Initialize modular classes through this singleton
        this.addRecipe = new AddRecipe(this)
        this.addDrink = new AddDrink(this)
        this.ingrBase = new IngrBase(this)
        this.drinks = new Drinks(this)
        this.recipies = new Recipies(this)

        this.homeButton.addEventListener("click", () => this.showHome())
        this.drinksButton.addEventListener("click", () => this.showDrinks())
        this.recipiesButton.addEventListener("click", () => this.showRecipies())
        this.addRecipeButton.addEventListener("click", e => {
            e.preventDefault()
            this.addRecipe.showModal()
        })
        this.addDrinkButton.addEventListener("click", (e) => {
            e.preventDefault()
            this.addDrink.showModal()
        })
        this.ingrBaseButton.addEventListener("click", (e) => {
            e.preventDefault()
            this.ingrBase.showModal()
        })

        this.exitAddRecipeBut.addEventListener("click", (e) => {
            e.preventDefault()
            this.addRecipe.exitModal()
        })
        this.exitAddDrinkBut.addEventListener("click", (e) => {
            e.preventDefault()
            this.addDrink.exitModal()
        })
        this.exitIngrBaseBut.addEventListener("click", (e) => {
            e.preventDefault()
            this.ingrBase.exitModal()
        })
    }

    showHome = function () {
        
        this.hide()
        this.appInformation.classList.toggle("active")
    }
    showDrinks = function () {
        this.hide()
        this.drinksMenu.classList.toggle("active")
        this.drinks.reloadingDrinks()
    }
    showRecipies = function () {
        this.hide()
        this.recipeMenu.classList.toggle("active")
        this.recipies.reloadingRecipies()
    }
    hide = function () {
        this.drinksMenu.classList = ""
        this.appInformation.classList = ""
        this.recipeMenu.classList = ""
    }
    showModal = function (modal) {
        modal.classList = "active"
    }
    
    showMessage = (message, type = "info") => {
        this.universalModal.innerHTML = `
            <div class="modal-content modal-${type}">
                <a href="#" class="exit" onclick="document.querySelector('#universal-modal').innerHTML=''; return false;">X</a>
                <p>${message}</p>
                <button onclick="document.querySelector('#universal-modal').innerHTML=''">OK</button>
            </div>
        `
    }

    showError = (message) => {
        this.showMessage(message, "error")
    }

    showSuccess = (message) => {
        this.showMessage(message, "success")
    }

    exit = function () {
    }
}

let basement = new Basement()