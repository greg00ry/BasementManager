export class AddDrink {
    constructor(basement) {
        this.basement = basement
        this.init()
    }
    init() {
        this.typesArr = [
            "Beer",
            "Wine",
            "Cider",
            "Strong"
        ]
        this.postUrl = "/api/sets"
        this.getURLs = [
            "/api/recipes",
            "/api/recipes/:id"
        ]
        this.postMethObj = {
                method: "POST",
                headers: {
                "Accept": "application/json",
                "Content-Type": "application/json"
            }
        }

        this.addDrinkModal = document.querySelector("#add-drink-modal")
        this.drinkNameText = document.querySelector("#drink-name-text")
        this.drinksTypeSelect = document.querySelector("#drinks-type")
        this.recipiesSelect = document.querySelector("#recipies")
        this.submitDrink = document.querySelector("#add-drink-modal form")
        this.isSaving = false

        this.submitDrink.addEventListener("submit", e => {
            e.preventDefault()
            this.processNewDrink()
        })
    }

    exitModal = () => {
        this.addDrinkModal.classList.remove("active")
    }

    showModal = async () => {
        this.addDrinkModal.classList.add("active")
        await this.reloadRecipesList()
    }

    getRecipes = async () => {
        try {
            const response = await fetch("/api/recipes")
            const data = await response.json()
            return data
        } catch (error) {
            console.error(error)
            this.basement.showError("Błąd przy pobieraniu przepisów: " + error.message)
        }
        return null
    }

    reloadRecipesList = async () => {
        // Clear all options
        const options = this.recipiesSelect.querySelectorAll("option")
        options.forEach((option) => {
            option.remove()
        })

        const recipes = await this.getRecipes()
        if (!recipes) {
            this.basement.showError("Nie udało się załadować listy przepisów")
            return
        }

        // Add default option
        const defaultOption = document.createElement("option")
        defaultOption.value = ""
        defaultOption.textContent = "-- Wybierz przepis --"
        this.recipiesSelect.appendChild(defaultOption)

        for (const recipe of recipes) {
            const option = document.createElement("option")
            option.value = recipe._id
            option.textContent = `${recipe.name} (${recipe.recipeType})`
            this.recipiesSelect.appendChild(option)
        }
    }

    processNewDrink = async () => {
        if(this.isSaving) return

        const drinkName = this.drinkNameText.value.trim()
        const drinkType = this.drinksTypeSelect.value.trim()
        const recipeId = this.recipiesSelect.value.trim()

        // Validate inputs
        if (!drinkName) {
            this.basement.showError("Podaj nazwę trunku!")
            return
        }

        if (!drinkType) {
            this.basement.showError("Wybierz typ trunku!")
            return
        }

        if (!recipeId) {
            this.basement.showError("Wybierz przepis!")
            return
        }

        this.isSaving = true

        try {
            // Get recipe details to extract ingredients
            const recipeResponse = await fetch(`/api/recipes/${recipeId}`)
            if (!recipeResponse.ok) {
                this.basement.showError("Błąd przy pobieraniu szczegółów przepisu")
                this.isSaving = false
                return
            }

            const recipe = await recipeResponse.json()
            const ingredientsArr = recipe.ingredients || []

            const response = await fetch(this.postUrl, {
                method: "POST",
                headers: {
                    "Accept": "application/json",
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    type: drinkType,
                    name: drinkName,
                    recipe: recipeId
                })
            })

            if (!response.ok) {
                this.basement.showError(`Błąd serwera: ${response.status}`)
                console.error("Server returned non-OK status", response.status)
                return
            }

            const data = await response.json()

            if(data && data._id) {
                console.log("Nowy trunek zapisany z _id:", data._id)
                this.basement.showSuccess("Trunek został dodany pomyślnie!")
                this.exitModal()
                this.drinkNameText.value = ""
                this.drinksTypeSelect.value = ""
                this.recipiesSelect.value = ""
            } else {
                this.basement.showError("Nie udało się dodać trunku")
                console.warn("Drink not saved on server")
            }

        } catch (error) {
            this.basement.showError("Błąd przy dodawaniu trunku: " + error.message)
            console.error("Error saving drink:", error)
        } finally {
            this.isSaving = false
        }
    }
}