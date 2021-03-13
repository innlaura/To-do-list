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
//perform different actions depending on what gets clicked
document.addEventListener("click", clickElement);
//check for ESCAPE KEY being pressed
document.addEventListener("keydown", closeKey);
//when page is loaded, retrieve data from local storage and create respective items
document.addEventListener("DOMContentLoaded", loadStorage);
//when list of items gets scrolled, close any open message
listApp.addEventListener("scroll", closeMessage);



//FUNCTIONS DOCUMENT

//CLOSE MESSAGE
//single function whose purpose is to close messages regardless of their ids
function closeMessage(){
    //select all elements whose classlist include "message"
    const allMessages = document.querySelectorAll(".message");
    //go through each element and remove class "show", which allows otherwise hidden elements to be displayed
    allMessages.forEach(message=>message.classList.remove("show"))
}


//ESCAPE KEY
//allows you to close messages by clicking ESC
function closeKey(event){
    if (event.key=="Escape"){
        closeMessage()
    }
}; 


//CLICK ELEMENT
function clickElement(event){
    var target = event.target;

    //IF SOMETHING OTHER THAN A MESSAGE IS CLICKED
    //N.B. checking for ".message span" will prevent message from being closed in case user clicks on span inside of message
    if(!(target.matches(".message, .message span"))){

        //"CLEAR-STORAGE" ICON
        if(target == clearApp){
            //close any other message (if open)
            deleteMessage.classList.remove("show")
            //toggle between closing and opening "clear-storage" message as icon gets clicked
            clearMessage.classList.toggle("show")
        
        //"CLEAR-STORAGE" CONFIRMATION BUTTON 
        } else if(target == clearYes){
            //clear storage
            localStorage.clear();
            //remove all items from list by going through any existing element with class "item" and deleting it
            const items = document.querySelectorAll(".item");
            items.forEach(element => element.remove());
            //close "clear-storage" message
            closeMessage();
        
        //TRASHCAN ICON
        } else if (target.classList.contains("itemRemove")){
            
            //CLOSE "CLEAR-STORAGE" MESSAGE (IF OPEN)
            clearMessage.classList.remove("show")
            
            //OPEN/CLOSE "DELETE-ITEM" MESSAGE
            //identify correct trashcan and set it as "icon"
            icon = event.target;
            //get trashcan position
            var positionIcon = target.getBoundingClientRect();
            //position "delete-item" message 25px under trashcan (same left, same top+25px)
            deleteMessage.style.top=`${positionIcon.top + 25}px`;
            deleteMessage.style.left=`${positionIcon.left}px`;
            //toggle between opening and closing "delete-item" message as trashcan icon gets clicked
            deleteMessage.classList.toggle("show");
        
        //"DELETE-ITEM" CONFIRMATION BUTTON
        } else if(target == deleteYes){
            //identify item by getting parent element of clicked trashcan, which we previously set as "icon"
            const item = icon.parentElement;
            //get innertext of div "itemText" contained inside item
            const value = item.querySelector(".itemText").innerText;
            
            //remove item from document
            item.remove();
            //delete value from local storage
            deleteValue(value); 
            //close "delete-item" message
            closeMessage();

        //ADD BUTTON    
        } else if(target == addButton){
            //prevent form from being submitted and page being refreshed, as everything is handled on the client's side
            event.preventDefault();
            
            //make sure input is not empty
            if (inputApp.value != ""){
                //pass input value to "create item" function
                const value = inputApp.value;
                createItem(value);
                //pass input value to "store value" function
                storeValue(value);
                //refresh input
                inputApp.value="";
            }    
        
        //ANYTHING ELSE
        //any click event happening outside of the message that doesn't get handled above will simply close said message 
        } else {
            closeMessage();
        }
    }     
}


//CREATE ITEM DYNAMICALLY
function createItem(value){
    //VARIABLES
    //elements 
    const item = document.createElement("li");
    const itemDate = document.createElement("div");
    const itemText = document.createElement("div");
    const itemRemove = document.createElement("i");
    //today's date
    const date = new Date();

    //CREATE ELEMENTS
    //convert date into desired format
    const dateFormat = date.getDate() + "&nbsp" + date.toLocaleString("default", { month: "short" });
    
    //insert date into respective div****
    itemDate.innerHTML= dateFormat
    //insert value into respective div (value is either passed to function through "addItem" or "loadStorage")
    itemText.innerHTML= value;
    
    //add classes to elements
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


    /* ****BUG ALERT: 
    date gets dynamically created everytime through "new date()" method instead of retrieved from local storage, 
    which accounts for the app always showing today's date instead of the correct one. Might get fixed in the future. */
}



//FUNCTIONS STORAGE

//LOAD ARRAY INTO LOCAL STORAGE
function setItem(list){
    //load modified array into local storage as JSON (array is converted into a string and key name set to "list")
    localStorage.setItem("list", JSON.stringify(list))
}

//GET ITEMS FROM STORAGE
function loadStorage(){
    //CHECK FOR KEY "LIST" IN LOCAL STORAGE
    //new array
    let list;

    //if key is not present, set "list" as empty
    if (localStorage.getItem("list")=== null){
        list = [];
    //if key IS present, parse it into an object and set it as "list"   
    } else {
        list = JSON.parse(localStorage.getItem("list"));
    }

    //CREATE ITEMS
    //go through each value inside of list (if any) and create respective items through function
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

    //get index of passed value
    const index = list.indexOf(value);
    //remove respective item from array
    list.splice(index, 1);
    //save array into storage
    setItem(list)
}

//ADD TO STORAGE
function storeValue(value){
    let list; 

    if (localStorage.getItem("list")=== null){
        list = [];
    } else {
        list = JSON.parse(localStorage.getItem("list"));
    }

    //insert new value into array
    list.push(value);
    //save array into storage
    setItem(list)
}


   
