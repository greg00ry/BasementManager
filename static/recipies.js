
export class Recipies {
    constructor(basement) {
        this.basement = basement
        this.init()
    }
    init() {
        this.getURLs = [
            "/api/recipes", //getAllRecipies()
            "/api/recipes/:id" //getRecipeById(_id)
        ]
        this.putURL = "/api/recipes/:id" //updateRecipes(_id, obj)
        this.deleteURL = "/api/recipes" //deleteRecipe(_id)

        this.recipesList = document.querySelector("#recipe-list")
    }

    reloadingRecipies = async () => {
        this.removeAllChildNodes(this.recipesList)

        const recipes = await this.getAllRecipies()

        if (!recipes) {
            this.basement.showError("Nie udało się załadować listy przepisów")
            return
        }

        for (const r of recipes) {
            const recipeHtml = this.getRecipiesHtmlListItem(r)
            this.recipesList.appendChild(recipeHtml)
        }
    }

    getRecipiesHtmlListItem = (recipeData) => {
        const li = document.createElement("li")
        li.classList.add("drinks-bars")
        li.id = recipeData._id
        li.innerHTML = `
            <a href="#" id="drink-delete-but">X</a> 
            <p id="type">${recipeData.recipeType}</p>
            <p id="name">Nazwa: ${recipeData.name}</p>
            <p id="steps">liczba kroków: ${recipeData.steps.length}</p>
            <p id="created">utworzono dnia: ${recipeData.created}</p>
        `

        li.querySelector("#drink-delete-but").addEventListener("click", e => {
            e.preventDefault()
            this.deleteRecipe(recipeData._id)
        })

        return li
    }

    removeAllChildNodes = (parent) => {
        if (!parent) return
        while(parent.firstChild) {
            parent.removeChild(parent.firstChild)
        }
    }

    deleteRecipe = async (id) => {
        try {
            const response = await fetch(`${this.deleteURL}/${id}`, {
                method: "DELETE",
                headers: {
                    "Accept": "application/json",
                    "Content-Type": "application/json"
                }
            })

            if (!response.ok) {
                this.basement.showError(`Błąd serwera: ${response.status}`)
                console.error("Server returned non-OK status", response.status)
                return
            }

            const data = await response.json()

            if(data && data.deletedCount > 0) {
                console.log("Usunięty przepis z ID:", id)
                this.basement.showSuccess("Przepis został usunięty!")
                await this.reloadingRecipies()
            } else {
                this.basement.showError("Nie udało się usunąć przepisu")
                console.warn("Recipe not deleted on server")
            }

        } catch(err) {
            this.basement.showError("Błąd przy usuwaniu przepisu: " + err.message)
            console.error("Error deleting recipe: " + err)
        }
    }

    getAllRecipies = async () => {
        const response = await fetch(this.getURLs[0])
        const data = await response.json()
        return data
    }
}
