//VARIABLES
//app
const clearApp  = document.querySelector("#clearIcon");
const listApp = document.querySelector("#list")
const inputApp = document.querySelector("#input");
const addButton = document.querySelector("#buttonSubmit");

const clearMessage = document.querySelector("#clearMessage");
const clearYes = document.querySelector("#clearYes");
//message
const deleteMessage = document.querySelector("#deleteMessage");
const deleteYes = document.querySelector("#deleteYes");
//trashcan
var icon


//EVENTS
//main document
document.addEventListener("click", clickElement)
document.addEventListener("keydown", closeKey);
document.addEventListener("DOMContentLoaded", loadStorage);
//app
listApp.addEventListener("scroll", closeMessage);
addButton.addEventListener("click", addItem);


//CLOSE MESSAGE
//function
function closeMessage(){
    const allMessages = document.querySelectorAll(".message");
    allMessages.forEach(message=>message.classList.remove("show"))
}

//with escape key
function closeKey(event){
    if (event.key=="Escape"){
        closeMessage()
    }
}; 

//ADD ITEM
function addItem(event){
    event.preventDefault();
    if (inputApp.value != ""){
        //create item
        const value = inputApp.value;
        createItem(value);

        //add value to storage
        storeValue(value);

        //refresh input
        inputApp.value="";
    }
}

//CLICK ELEMENT
function clickElement(event){
    var target = event.target;

    //clicking something other than message
    if(!(target.matches(".message, .message span"))){

        //clicking clear icon
        if(target == clearApp){
            deleteMessage.classList.remove("show")
            clearMessage.classList.toggle("show")
        
        //clicking clear-yes button    
        } else if(target == clearYes){
            localStorage.clear();
            const items = document.querySelectorAll(".item");
            items.forEach(element => element.remove());

            closeMessage();
        
        //clicking trashcan icon   
        } else if (target.classList.contains("itemRemove")){
            icon = event.target;
            var positionIcon = target.getBoundingClientRect();
            deleteMessage.style.top=`${positionIcon.top + 25}px`;
            deleteMessage.style.left=`${positionIcon.left}px`;
            clearMessage.classList.remove("show")
            deleteMessage.classList.toggle("show");

        //clicking delete-yes button
        } else if(target == deleteYes){
            var item = icon.parentElement;
            const value = item.querySelector(".itemText").innerText;
            
            item.remove();
            deleteValue(value);
            
            closeMessage();
        
        //clicking anything else    
        } else {
            closeMessage();
        }
    }     
} 


//CREATE ITEM DYNAMICALLY
function createItem(value){
    //VARIABLES
    //item   
    const item = document.createElement("li");
    const itemDate = document.createElement("div");
    const itemText = document.createElement("div");
    const itemRemove = document.createElement("i");
    //date
    const date = new Date();

    //CREATE ELEMENTS
    //add values    
    itemDate.innerHTML= date.getDate() + "&nbsp" + date.toLocaleString("default", { month: "short" });
    itemText.innerHTML= value;
    //add classes
    item.classList.add("item");
    itemDate.classList.add("itemDate");
    itemText.classList.add("itemText");
    itemRemove.classList.add("itemRemove","fa", "fa-trash-o");

    //APPEND ELEMENTS
    //append elements to item
    item.appendChild(itemDate);
    item.appendChild(itemText);
    item.appendChild(itemRemove);
    //append item to list
    document.getElementById("list").appendChild(item);
}




//LOAD ITEMS FROM STORAGE
function loadStorage(){
    if (localStorage.getItem("list")=== null){
        var list = [];
    } else {
        var list = JSON.parse(localStorage.getItem("list"));
    }
    list.forEach(value => createItem(value))
}

//REMOVE FROM STORAGE
function deleteValue(value){
    let list; 

    if (localStorage.getItem("list")=== null){
        list = [];
    } else {
        list = JSON.parse(localStorage.getItem("list"));
    }

    const index = list.indexOf(value);
    list.splice(index, 1);
    localStorage.setItem("list", JSON.stringify(list));
}

//ADD TO STORAGE
function storeValue(value){
    let list; 

    if (localStorage.getItem("list")=== null){
        list = [];
    } else {
        list = JSON.parse(localStorage.getItem("list"));
    }

    list.push(value);
    localStorage.setItem("list", JSON.stringify(list));
}

   