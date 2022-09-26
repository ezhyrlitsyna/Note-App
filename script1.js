let createBtn = document.querySelector("#createNote");
let modal = document.querySelector(".modal");
let formClose = document.querySelector("#form-close");
let formSubmit = document.querySelector("#form-submit");
let form = document.querySelector("#form");
let noteList = document.querySelector(".note-list");
let btnDoneNote = document.querySelector("#doneList");
let btnDeleteNotes = document.querySelector("#deleteList");
let formTitle = form.querySelector("h2");
let activeTask =  document.querySelector(".task-active");
let archivesTask =  document.querySelector(".task-archived");
let activeThought =  document.querySelector(".thoughts-active");
let archivesThought =  document.querySelector(".thoughts-archived");
let activeIdea =  document.querySelector(".idea-active");
let archivesIdea =  document.querySelector(".idea-archived");
let activeQuotes =  document.querySelector(".quotes-active");
let archivesQuotes =  document.querySelector(".quotes-archived");
let arrayForTest = [
                    {name: "Shop", createdDate: "2022-9-26", category: "task", content: "tomato", date: "", oldDate: "", done: false, },
                    {name: "Love", createdDate: "2022-9-26", category: "thought", content: "some text", date: "", oldDate: "", done: false,},
                    {name: "Dentist", createdDate: "2022-9-26", category: "task", content: "Next appointment", date: "2022-09-30", oldDate: "", done: false,},
                    {name: "Shevchenko", createdDate: "2022-9-26", category: "quote", content: "Kobzar", date: "", oldDate: "", done: false,},
                    {name: "Create new project", createdDate: "2022-9-26", category: "idea", content: "I have to speak to my shef", date: "", oldDate: "", done: false,},
                    {name: "Sofa", createdDate: "2022-9-26", category: "thought", content: "Change sofa in living-room", date: "", oldDate: "", done: false,},
                    {name: "Care of my health", createdDate: "2022-9-26", category: "idea", content: "Buy shoes for jogging", date: "", oldDate: "", done: false,},
];
let notes = arrayForTest || JSON.parse(localStorage.getItem("notes" ));
let startedCategoryValue = form.elements.category.value;
let notesDone = [];

let updateNote = false;
let updateNoteId;
let arrayDoneIndex = [];
let doneListView = false; 
let oldNoteDate = "";


createBtn.addEventListener("click", function(){
    formTitle.textContent = "add a new note";
    formSubmit.value = "Create Note";
    modal.style.display = "block";
})
formClose.addEventListener("click", function(){
    form.elements.name.value = "";
    form.elements.category.value = startedCategoryValue;
    form.elements.content.value = "";
    form.elements.date.value = "";

    updateNote = false; 

    modal.style.display = "none";
})
form.addEventListener("submit", function(){
    createNoteObj();
    showNote(notes);
    countCategory(notes, notesDone);
});
btnDoneNote.addEventListener("click", function(){
    if(!doneListView){
        showNote(notesDone);
        noteList.style.opacity = 0.7;
        doneListView= true;
    } else {
        showNote(notes);
        noteList.style.opacity = 1;
        doneListView = false;
    }
});
btnDeleteNotes.addEventListener("click", function(){
    deleteAllNotes();
    countCategory(notes, notesDone);
})
countCategory(notes, notesDone);
function createNoteObj(){
    let noteName = form.elements.name.value;
    let noteCreatedDate = `${new Date().getFullYear()}-${new Date().getMonth()+1}-${new Date().getDate()}`;
    let noteCategory = form.elements.category.value;
    let noteContent = form.elements.content.value;
    let noteDate = form.elements.date.value;
    let noteInfo = {
        name: noteName,
        createdDate: noteCreatedDate,
        category: noteCategory,
        content: noteContent,
        date : noteDate,
        oldDate: oldNoteDate,
        done: false,
    }

    if(!updateNote){
        notes.push(noteInfo);
    } else{
        notes[updateNoteId] = noteInfo;
        updateNote = false;
    }
    localStorage.setItem("notes", JSON.stringify(notes));
    formClose.click();
}
function showNote(array){
    document.querySelectorAll(".note").forEach(note => note.remove());
    if(!array) return;
    array.forEach((note, index) => {
        let noteView = `<div class="note">
                            <div class="note-name">
                                <div class="icon"></div>
                                <p>${note.name}</p>
                            </div>
                            <div class="note-time">
                                <p>${note.createdDate}</p>
                            </div>
                            <div class="note-category">
                                <p>${note.category}</p>
                            </div>
                            <div class="note-content">
                                <p>${note.content}</p>
                            </div>
                            <div class="note-dates">
                                <p>${note.oldDate} ${note.date}</p>
                            </div>
                            <div class="note-buttons">
                                <button id="editNote" onclick="editNote(${index}, '${note.name}', '${note.category}', '${note.content}','${note.oldDate}', '${note.date}')"></button>
                                <button id="doneNote" onclick="markDoneNote(${index}, '${note.name}')"></button>
                                <button id="deleteNote" onclick="deleteNote(${index}, '${note.name}')"></button>
                        </div>`
        noteList.insertAdjacentHTML("beforeend", noteView);
        setIcon(note.category, index);
    });
}
showNote(notes);
function deleteNote(index, nameNote){
    let result = notes.find(note => note.name == nameNote );
    if(result){
        notes.splice(index, 1);
        localStorage.setItem("notes", JSON.stringify(notes));
        showNote(notes);
    }else{
        notesDone.splice(index, 1);
        localStorage.setItem("notes", JSON.stringify(notes));
        showNote(notesDone);
    }
    countCategory(notes, notesDone);
   
   
}
function editNote(noteIndex, noteName, noteCategory, noteContent, noteOldDate, noteDate){
    modal.style.display = "block";
    formSubmit.value = "Save Changes";
    form.elements.name.value = noteName;
    noteCreatedDate = `${new Date().getDate()}/${new Date().getMonth()+1}/${new Date().getFullYear()}`;
    form.elements.category.value = noteCategory;
    setIcon(noteCategory, noteIndex);
    form.elements.content.value = noteContent;
    form.elements.date.value = noteDate;
    if(form.elements.date.value){
        oldNoteDate = form.elements.date.value;
    }
    formTitle.textContent = "Update your note";

    updateNote = true;
    updateNoteId = noteIndex;
    countCategory(notes, notesDone);

}
function markDoneNote(index ,nameNote){
    let note;
    let result = notes.find(note => note.name == nameNote );
    if(result){
        note = notes[index];
    }else{
        note = notesDone[index];
    }
    let confirmMessage;
    if(!note.done){
        confirmMessage = confirm("Is your note is done?");
        if(confirmMessage){
            note.done = true;
            notesDone.push(note);
            notes.splice(index, 1);
            localStorage.setItem("notes", JSON.stringify(notes));
            showNote(notes);
        }
    }else{
        confirmMessage = confirm("Do you want to restore this note?");
        if(confirmMessage){
            note.done = false;
            notes.push(note);
            notesDone.splice(index, 1);
            localStorage.setItem("notes", JSON.stringify(notes));
            showNote(notesDone);}
        }
    countCategory(notes, notesDone);
}

function setIcon(noteCategory, noteIndex){
    let noteIcon = document.querySelectorAll(".icon")[noteIndex];
    switch(noteCategory){
        case "task":
            noteIcon.style.backgroundImage = 'url("./images/mycollection/002-shopping-basket.png")';
            break;
        case "idea":
            noteIcon.style.backgroundImage = 'url("./images/mycollection/001-light-bulb.png")';
            break;
        case "thought":
            noteIcon.style.backgroundImage = 'url("./images/mycollection/003-power.png")';
            break;
        case "quote":
            noteIcon.style.backgroundImage = 'url("./images/mycollection/004-quote.png")';
            break;
    }
}
function deleteAllNotes(){
    let confirmMessage = confirm("Do you want to delete all notes?");
    if(confirmMessage){
        document.querySelectorAll(".note").forEach(note => note.remove());
        notes = [];
        notesDone = [];
        localStorage.setItem("notes", JSON.stringify(notes));
    }
}
function countCategory(notes, notesDone){
    let countTaskActive = 0, countTaskArchived = 0,
        countThoughtActive = 0, countThoughtArchived = 0,
        countIdeaActive = 0, countIdeaArchived = 0,
        countQuotesActive = 0, countQuotesArchived = 0;
    notes.map((note) => {
        if(!notes) return ;
        switch(note.category){
            case "task":
                countTaskActive++;
                break;
            case "thought":
                countThoughtActive++;
                break;
            case "idea":
                countIdeaActive++;
                break;
            case "quote":
                countQuotesActive++;
                break;
        }
    });
    activeTask.textContent =  countTaskActive;
    activeThought.innerHTML =  countThoughtActive;
    activeIdea.innerHTML =  countIdeaActive;
    activeQuotes.innerHTML =  countQuotesActive;


    notesDone.map((note) => {
    if(!notesDone) return ;
    switch(note.category){
        case "task":
            countTaskArchived++;
            break;
        case "thought":
            countThoughtArchived++;
            break;
        case "idea":
            countIdeaArchived++;
            break;
        case "quote":
            countQuotesArchived++;
            break;
    }
   });
   archivesTask.textContent = countTaskArchived; 
   archivesThought.innerHTML = countThoughtArchived;
   archivesIdea.innerHTML = countIdeaArchived;
   archivesQuotes.innerHTML = countQuotesArchived;
}




  
    



