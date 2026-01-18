
export class Drinks {
    constructor(basement) {
        this.basement = basement
        this.init()
    }
    init() {
        this.getURLs = [
            "/api/sets", //getAllSets()
            "/api/sets/:id" //getSetById(_id)
        ]
        this.putURL = "/api/sets/:id" //updateSet(_id, obj)
        this.deleteURL = "/api/sets" //deleteSet(_id)

        this.drinksList = document.querySelector("#drinks-list")
       
    }

    reloadingDrinks = async () => {
        this.removeAllChildNodes(this.drinksList)

        const drinks = await this.getAllDrinks()

        if (!drinks) {
            this.basement.showError("Nie udało się załadować listy składników")
            return
        }

        for (const d of drinks) {
            const drinksHtml = this.getDrinksHtmlListItem(d)
            this.drinksList.appendChild(drinksHtml)
        }

    }

    getDrinksHtmlListItem = (drinkData) => {
        const li = document.createElement("li")
        li.classList.add("drinks-bars")
        li.id = drinkData._id
        li.innerHTML = `
            <a href="#" id="drink-delete-but">X</a> 
            <p id="type">${drinkData.setType}</p>
            <p id="name">Nazwa: ${drinkData.name}</p>
            <p id="created">Nastawiono dnia: ${drinkData.made}</p>
            <a href="#" id="recipe">Przepis //(link do dodania)</a> 
        ` //zaimplementowac link do przepisu

        li.querySelector("#drink-delete-but").addEventListener("click", e => {
            e.preventDefault()
            this.deleteDrink(drinkData._id)
        })

        return li
    }

    removeAllChildNodes = (parent) => {
        if (!parent) return
        while(parent.firstChild) {
            parent.removeChild(parent.firstChild)
        }
    }

    deleteDrink = async (id) => {
        try {
            console.log("Usuwanie trunku z ID:", id)

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
                console.log("Usunięty trunek z ID:", id)
                this.basement.showSuccess("Trunek został usunięty!")
                await this.reloadingDrinks()
            } else {
                this.basement.showError("Nie udało się usunąć trunku")
                console.warn("Drink not deleted on server")
            }

        } catch(err) {
            this.basement.showError("Błąd przy usuwaniu trunku: " + err.message)
            console.error("Error deleting drink: " + err)
        }
    }

    getAllDrinks = async () => {
        const response = await fetch(this.getURLs[0])
        const data = await response.json()
        return data
    }

    
}