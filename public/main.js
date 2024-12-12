const form = document.getElementById("offerForm")


form.addEventListener("submit", async function(event){
    event.preventDefault()
    const formData = new FormData(this)
    const desc = document.getElementById("description").value 
    
    //formData.append("description", desc)

    console.log(formData.get("image") + " this is form")

    try {
        const response = await fetch("http://localhost:3000/upload", {
            method: "POST",
            body: formData
        })

        if (!response.ok) {
            throw new Error("upload failed")
        }

        const responseData = await response.json()
        console.log(responseData)


    } catch (error) {
        console.log("error occured " + error)
    } finally {
        fetchOffers()
    }

})


const fetchOffers = async () => {

    try {
        const response = await fetch("http://localhost:3000/offers")
         
        if (!response.ok) {
            throw new Error("Error fetching")
        }

        const data = await response.json()
        displayOffers(data)


    } catch (error) {
        console.log(error)
    }

}



const displayOffers = (data) => {
    const offerContainer = document.getElementById("offersContainer")
    offerContainer.innerHTML = ""
    data.forEach(element => {
        const offerElement = document.createElement("div")
        offerElement.classList.add("offerDiv", "col", "s12", "m6", "l4")
    


        const card = document.createElement("div")
        card.classList.add("card", "hoverable")
        
        

        const imgCard = document.createElement("div")
        imgCard.classList.add("card-image")


        if (element.imagePath) {

            const img = document.createElement("img")
            img.classList.add("responsive-img")
            img.style.height = "200px";
            console.log(element.imagePath)
            img.src = element.imagePath
            imgCard.appendChild(img)
            
        }

        const title = document.createElement("span")
        title.classList.add("card-title")
        title.textContent = element.title

        imgCard.appendChild(title)

        const cardContent = document.createElement("div")
        cardContent.classList.add("card-content")


        const desc = document.createElement("p")
        desc.textContent = element.description

        const price = document.createElement("p")
        price.textContent = element.price

        cardContent.appendChild(desc)
        cardContent.appendChild(price)

        card.appendChild(imgCard)
        card.appendChild(cardContent)
        offerElement.appendChild(card)

        offerContainer.appendChild(offerElement)
        
    
    })
        
  
}

fetchOffers()