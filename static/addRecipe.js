




export class AddRecipe {
    constructor(basement) {
        this.basement = basement
        this.init()
    }
    init() {
        this.postURL = "/api/recipes" //createRecipe
        this.postMethObj = {
                method: "POST",
                headers: {
                "Accept": "application/json",
                "Content-Type": "application/json"
            }
        } 
        this.getIngrURL = "/api/ingriedients"
        
        this.addRecipeModal = document.querySelector("#recipe-modal")
        this.nameText = document.querySelector("#name-area")
        this.submitRecipe = document.querySelector("#add-recipe-form")
        this.dynamicIngrSelect = document.querySelector(".dynamic-ingr-select")
        this.dynamicStepsList = document.querySelector("#dynamic-steps-list")
        this.dynamicIngrListSelect = document.querySelector("#dynamic-ingr-list-select")
        this.recipeTypeSelect = document.querySelector("#recipe-type")
        this.isSaving = false

        this.submitRecipe.addEventListener("submit", e => {
            e.preventDefault()
            this.processNewRecipe()
        })

        let stepCount = 0
        const addNextStepBtn = document.querySelector("#add-next-step")
        if (addNextStepBtn) {
            addNextStepBtn.addEventListener("click", e => {
                e.preventDefault()
                this.generateNextStep(stepCount)
                stepCount++
            })
        }

        let ingrCount = 0
        this.dynamicIngrSelect.addEventListener("change", e => {
            e.preventDefault()
            if (e.target.value === "add-new") {
                this.openAddIngrModal()
                e.target.value = ""
            } else if (e.target.value) {
                this.generateNextIngr(ingrCount, e.target.value, e.target.options[e.target.selectedIndex].text)
                e.target.value = ""
                ingrCount++
            }
        })
        
    }

    exitModal = () => {
        this.addRecipeModal.classList.remove("active")
    }

    showModal = async () => {
        this.addRecipeModal.classList.add("active")
        await this.reloadIngrList()
        this.reloadNextSteps()
    }
     
    getIngrs = async () => {
        try {
            const response = await fetch("/api/ingriedients")
            const data = await response.json()
            
            return data
        } catch (error) {
            console.error(error)
            alert("Błąd przy pobieraniu składników: " + error.message)
        }
        return null
    }


    reloadIngrList = async () => {
        // Clear only dynamically added options, keep first placeholder option
        const options = this.dynamicIngrSelect.querySelectorAll("option")
        options.forEach((option) => {
            option.remove()
        })

        const ingrs = await this.getIngrs()
        if (!ingrs) {
            alert("Nie udało się załadować listy składników")
            return
        }

        for (const i of ingrs) {
            const ingrHtml = this.getIngrHtmlListItem(i)
            this.dynamicIngrSelect.appendChild(ingrHtml)
        }

        // Add "Dodaj składnik" option at the end
        const addNewOption = document.createElement("option")
        addNewOption.value = "add-new"
        addNewOption.textContent = "➕ Dodaj składnik"
        this.dynamicIngrSelect.appendChild(addNewOption)
    }

    

    getIngrHtmlListItem = (ingrData) => {
        const option = document.createElement("option")
        option.textContent = `${ingrData.name}`
        option.value = ingrData._id

        return option
    }

    reloadNextSteps = () => {
        const steps = this.dynamicStepsList.querySelectorAll("li")
        steps.forEach((step) => {
            step.remove()
        })
    }

    generateNextStep = (stepCount) => {
        const step = document.createElement("li")
        step.id = `step-${stepCount}`
        step.classList.add("step")
        
        const stepLabel = document.createElement("span")
        stepLabel.textContent = `Krok ${stepCount + 1}`
        step.appendChild(stepLabel)
        
        const input = document.createElement("input")
        input.type = "text"
        input.classList.add("step-text")
        input.placeholder = "Dodaj treść instrukcji..."
        step.appendChild(input)

        const deleteLink = document.createElement("a")
        deleteLink.href = "#"
        deleteLink.classList.add("delete-dynamic-ingr")
        deleteLink.textContent = "X"
        
        deleteLink.addEventListener("click", (e) => {
            e.preventDefault()
            step.remove()
        })
        
        step.appendChild(deleteLink)
        this.dynamicStepsList.appendChild(step)
    }

    generateNextIngr = (ingrCount, ingrId, ingrName) => {
        const li = document.createElement("li")
        li.id = `ingr-${ingrCount}`
        
        const span = document.createElement("span")
        span.textContent = ingrName
        li.appendChild(span)

        const deleteLink = document.createElement("a")
        deleteLink.href = "#"
        deleteLink.classList.add("delete-dynamic-ingr")
        deleteLink.textContent = "X"
        deleteLink.dataset.ingrId = ingrId
        
        deleteLink.addEventListener("click", (e) => {
            e.preventDefault()
            li.remove()
        })
        
        li.appendChild(deleteLink)
        this.dynamicIngrListSelect.appendChild(li)
    }

    openAddIngrModal = async () => {
        // Use the IngrBase instance from Basement singleton
        this.basement.ingrBase.showModal()
    }

    processNewRecipe = async () => {
        if(this.isSaving) return

        const recipeName = this.nameText.value.trim()
        const recipeType = this.recipeTypeSelect.value.trim()
        const stepLiElements = this.dynamicStepsList.querySelectorAll("li")
        const ingrLiElements = this.dynamicIngrListSelect.querySelectorAll("li")
        
        // Validate inputs
        if (!recipeName) {
            alert("Podaj nazwę przepisu!")
            return
        }

        if (!recipeType) {
            alert("Wybierz typ przepisu!")
            return
        }

        if (stepLiElements.length === 0) {
            alert("Dodaj co najmniej jeden krok do przepisu!")
            return
        }

        if (ingrLiElements.length === 0) {
            alert("Wybierz co najmniej jeden składnik!")
            return
        }

        // Extract step texts from input elements
        const stepsArr = []
        stepLiElements.forEach((li) => {
            const input = li.querySelector("input.step-text")
            if (input && input.value.trim()) {
                stepsArr.push(input.value.trim())
            }
        })

        if (stepsArr.length === 0) {
            alert("Wszystkie kroki muszą mieć treść!")
            return
        }

        // Extract ingredient IDs from the list
        const ingredientsArr = []
        ingrLiElements.forEach((li) => {
            const deleteLink = li.querySelector("a.delete-dynamic-ingr")
            if (deleteLink && deleteLink.dataset.ingrId) {
                ingredientsArr.push(deleteLink.dataset.ingrId)
            }
        })

        this.isSaving = true

        try {
            const response = await fetch(this.postURL, {
                method: "POST",
                headers: {
                    "Accept": "application/json",
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    name: recipeName,
                    recipeType: recipeType,
                    stepsArr: stepsArr,
                    ingredientsArr: ingredientsArr
                })
            })

            if (!response.ok) {
                alert(`Błąd serwera: ${response.status}`)
                console.error("Server returned non-OK status", response.status)
                return
            }

            const data = await response.json()

            if(data && data._id) {
                console.log("Nowy przepis zapisany z _id:", data._id)
                alert("Przepis został dodany pomyślnie!")
                this.exitModal()
                this.nameText.value = ""
                this.recipeTypeSelect.value = ""
                this.dynamicIngrSelect.value = ""
                // Clear steps and ingredients
                this.dynamicStepsList.querySelectorAll("li").forEach(li => li.remove())
                this.dynamicIngrListSelect.querySelectorAll("li").forEach(li => li.remove())
            } else {
                alert("Nie udało się dodać przepisu")
                console.warn("Recipe not saved on server")
            }

        } catch (error) {
            alert("Błąd przy dodawaniu przepisu: " + error.message)
            console.error("Error saving recipe:", error)
        } finally {
            this.isSaving = false
        }
    }


}