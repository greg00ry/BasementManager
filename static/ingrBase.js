
export class IngrBase {
    constructor(basement) {
        this.basement = basement
        this.init()
    }
    init() {
        this.getURLS = [
            "/api/ingriedients", //getAllIngriedients
            "/api/ingriedients/:id" //getIngriedientById(_id)
        ]
        this.postUrl = "/api/ingriedients"
        this.postMethObj = {
                method: "POST",
                headers: {
                "Accept": "application/json",
                "Content-Type": "application/json"
            }
        }
        this.putURL = "/api/ingriedients/:id"
        this.deleteURL = "/api/ingriedients" 

        this.ingrList = document.querySelector("#dyn-ingr-list")
        this.ingrModal = document.querySelector("#ingr-base-modal")
        this.ingrName = document.querySelector("#ingr-name-text")
        this.isSaving = false

        document.querySelector("#add-ingr form").addEventListener("submit", e => {
            e.preventDefault()
            this.processNewIngr()
        })
    }

    showModal = async function () {
        this.ingrModal.classList.add("active")
        await this.reloadIngrList()
    }

    exitModal = () => {
        this.removeAllChildNodes(this.ingrList)
        this.ingrModal.classList.remove("active")
    }

    reloadIngrList = async () => {
        this.removeAllChildNodes(this.ingrList)

        const ingrs = await this.getIngrs()
        if (!ingrs) {
            alert("Nie udało się załadować listy składników")
            return
        }

        for (const i of ingrs) {
            const ingrHtml = this.getIngrHtmlListItem(i)
            this.ingrList.appendChild(ingrHtml)
        }
    }

    getIngrHtmlListItem = (ingrData) => {
        const li = document.createElement("li")
        li.innerHTML = `${ingrData.name}<a href="#" class="delete-dynamic-ingr" id="${ingrData._id}">X</a>`

        li.querySelector("a").addEventListener("click", e => {
            e.preventDefault()
            this.deleteIngr(ingrData._id)
        })

        return li
    }

    getIngrs = async () => {
        try {
            const response = await fetch(this.getURLS[0])
            const data = await response.json()
            return data
        } catch (error) {
            console.error(error)
            alert("Błąd przy pobieraniu składników: " + error.message)
        }
        return null
    }

    removeAllChildNodes(parent) {
        if (!parent) return
        while(parent.firstChild) {
            parent.removeChild(parent.firstChild)
        }
    }

    processNewIngr = async () => {
        if(this.isSaving) return

        if (this.ingrName.value.length === 0) {
            alert("Podaj nazwę składnika!")
            return
        }

        // Validate if ingredient already exists
        const ingrName = this.ingrName.value.trim()
        const existingIngr = await this.checkIngrExists(ingrName)
        if (existingIngr) {
            console.log("Składnik już istnieje w bazie:", ingrName)
            alert(`Składnik "${ingrName}" już istnieje w bazie danych!`)
            return
        }

        this.isSaving = true

        try {
            const response = await fetch(this.postUrl, {
                method: "POST",
                headers: {
                    "Accept": "application/json",
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    name: ingrName
                })
            })

            if (!response.ok) {
                alert(`Błąd serwera: ${response.status}`)
                console.error("Server returned non-OK status", response.status)
                return
            }

            const data = await response.json()

            if(data && data._id) {
                console.log("Nowy element zapisany w bazie z _id:", data._id)
                alert("Składnik został dodany pomyślnie!")
                await this.reloadIngrList()
                this.ingrName.value = ""
            } else {
                alert("Nie udało się dodać składnika")
                console.warn("Ingredient not saved on server")
            }

        } catch (error) {
            alert("Błąd przy dodawaniu składnika: " + error.message)
            console.error("Error saving ingredient:", error)
        } finally {
            this.isSaving = false
        }

    }

    checkIngrExists = async (ingrName) => {
        try {
            const ingrs = await this.getIngrs()
            if (!ingrs || ingrs.length === 0) return false
            
            // Case-insensitive comparison
            const exists = ingrs.some(ingr => 
                ingr.name.toLowerCase() === ingrName.toLowerCase()
            )
            return exists
        } catch (error) {
            console.error("Error checking ingredient:", error)
            return false
        }
    }

    deleteIngr = async (id) => {
        try {
            const response = await fetch(`${this.deleteURL}/${id}`, {
                method: "DELETE",
                headers: {
                    "Accept": "application/json",
                    "Content-Type": "application/json"
                }
            })

            if (!response.ok) {
                alert(`Błąd serwera: ${response.status}`)
                console.error("Server returned non-OK status", response.status)
                return
            }

            const data = await response.json()

            if(data && data._id) {
                console.log("Usunięty element z ID:", id)
                alert("Składnik został usunięty!")
                await this.reloadIngrList()
            } else {
                alert("Nie udało się usunąć składnika")
                console.warn("Ingredient not deleted on server")
            }
        } catch (error) {
            alert("Błąd przy usuwaniu składnika: " + error.message)
            console.error("Error deleting ingredient:", error)
        }
    }





}