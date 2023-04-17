let locale = Appian.getLocale(); //Returns the user's locale (eg. en-US). This accounts for system settings, user settings, etc.
let accentColor = Appian.getAccentColor(); //Returns the accent color of the Appian environment in hexadecimal format
let inputTasks;
let inputColumns;
let defaultTasks = [{
    "id": 1,
    "title": "Design website layout",
    "description": "Create wireframes and mockups for the website layout",
    "status": "ToDo",
    "priority": "High",
    "assignee": "mark.ansink@appian.com",
    "dueDate": "04 April 2023",
}, {
    "id": 2,
    "title": "Develop homepage",
    "description": "Code the HTML, CSS, and JavaScript for the homepage",
    "status": "Active",
    "assignee": "mark.ansink@appian.com",
    "priority": "Low",
    "assignee": "mark.ansink@appian.com",
    "dueDate": "04 April 2023",
}, {
    "id": 3,
    "title": "Implement backend functionality",
    "description": "Create APIs and database connections for the website",
    "status": "Active",
    "assignee": "mark.ansink@appian.com",
    "priority": "Medium",
    "assignee": "mark.ansink@appian.com",
    "dueDate": "04 April 2023",
}, {
    "id": 4,
    "title": "Test website",
    "description": "Perform manual and automated testing to ensure the website works as expected",
    "status": "Done",
    "assignee": "mark.ansink@appian.com",
    "priority": "Low",
    "assignee": "mark.ansink@appian.com",
    "dueDate": "04 April 2023",
}];
let defaultColumns = ["ToDo", "Active", "Done"];
let columns;
let tasks;
let board = document.querySelector(".board");
let selectedCard = null;

function defaultValue(string){
    const value = string ?? '-';
    return value
};

let colorCode = accentColor;
let lightenValue = 100; // increase each color component by 20

let red = parseInt(colorCode.substring(1, 3), 16);
let green = parseInt(colorCode.substring(3, 5), 16);
let blue = parseInt(colorCode.substring(5, 7), 16);

red = Math.min(255, red + lightenValue);
green = Math.min(255, green + lightenValue);
blue = Math.min(255, blue + lightenValue);

let lighterColorCode = "#" +
    red.toString(16).padStart(2, "0") +
    green.toString(16).padStart(2, "0") +
    blue.toString(16).padStart(2, "0");

Appian.Component.onNewValue(function (allParameters) { // Whenever a new value is provided to ANY input, this function is invoked with ALL inputs as a dictionary. This includes when the component is initialized.
    inputTasks = allParameters['tasks'];
    inputColumns = allParameters['columns'];
    selectedCard = allParameters["selectedTask"];





    // Add Columns
    if (!inputColumns) {
        columns = defaultColumns;
    } else {
        columns = inputColumns;
    }

    board.innerHTML = '';
    columns.forEach((column) => {

        const listElement = document.createElement("div");
        listElement.className = "tasks";
        listElement.draggable = false;
        const columnName = column.toUpperCase();
        listElement.innerHTML = `<h5 class="mt-0 task-header" id="${column}-header">${columnName} (0)</h5>
              <div id="${column}" name="${column}" class="task-list-items">`
        board.appendChild(listElement);

    });

// Add Tasks
    let draggingCard = null;
    const taskLists = document.querySelectorAll(".task-list-items");

    if (!inputTasks) {
        tasks = defaultTasks
    } else {
        tasks = inputTasks
    }


    tasks.forEach((card) => {
        let divCard = document.getElementById(card.status);

        // If Column is not found do nothing,
        // TODO Maybe add validation here
        if (divCard===null){return};


        const cardElement = document.createElement("div");
        cardElement.className = "card mb-0";
        cardElement.draggable = true;
        cardElement.id = card.id;
        cardElement.style.borderLeftColor = accentColor;
        if (card.id===selectedCard){
            cardElement.style.backgroundColor=lighterColorCode;
        }
        addCardClickListener(cardElement);
        cardElement.addEventListener("dragend", () => {

        });

        cardElement.innerHTML = `
        <div class="card-body p-3" id="${card.id}">
        
          <small class="float-end text-muted card-date">
<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="${accentColor}" class="bi bi-calendar-event" viewBox="0 0 16 16">
  <path d="M11 6.5a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-1a.5.5 0 0 1-.5-.5v-1z"/>
  <path d="M3.5 0a.5.5 0 0 1 .5.5V1h8V.5a.5.5 0 0 1 1 0V1h1a2 2 0 0 1 2 2v11a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V3a2 2 0 0 1 2-2h1V.5a.5.5 0 0 1 .5-.5zM1 4v10a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V4H1z"/>
</svg>${defaultValue(card.dueDate)}</small>
          <span class="badge 
          ${
            card.priority === "High"
                ? "bg-danger"
                : card.priority === "Medium"
                    ? "bg-warning"
                    : card.priority === "Low"
                        ? "bg-success"
                        : ""
        }
          text-light">${card.priority}</span>
          <h5 class="mt-2 card-title text-secondary">${defaultValue(card.title)}</h5>
        
          <div class="dropdown float-end">
            <a class="dropdown-toggle text-muted arrow-none" data-bs-toggle="dropdown" aria-expanded="false"></a>
            <i class="mdi mdi-dots-vertical font-18 text-dark" role="button"></i>
          </div>
          <p class="mb-0">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="${accentColor}" class="bi bi-person-fill" viewBox="0 0 16 16">
  <path d="M3 14s-1 0-1-1 1-4 6-4 6 3 6 4-1 1-1 1H3Zm5-6a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z"></path>
</svg>
            
            <span class="align-middle text-secondary">${defaultValue(card.assignee)}</span>
          </p>
         
        </div>
      `;

        // Add event listener for dragstart on created card element
        cardElement.addEventListener("dragstart", function (event) {
            draggingCard = event.target;
            event.dataTransfer.setData("text/plain", event.target.id);
            event.target.classList.add("dragging");

        });

        document.getElementById(card.status).appendChild(cardElement);
    });

    function updateTaskStatus(id, newStatus) {
        let task =tasks.find(t => t.id === parseInt(id));
        if (task) {
            task.status = newStatus;
        }
    };

    // DRAG OVER
    taskLists.forEach((taskList) => {
        taskList.addEventListener("dragover", function (event) {
            event.preventDefault();
        });
    });

    // DROP TASK
    taskLists.forEach((taskList) => {
        taskList.addEventListener("drop", function (event) {
            event.preventDefault();
            const cardId = event.dataTransfer.getData("text/plain");
            const column = event.target.closest(".task-list-items");
            updateTaskStatus(cardId, column.id);
            Appian.Component.saveValue("tasks", tasks)
            if (draggingCard !== null) {
                column.appendChild(draggingCard);
                draggingCard = null;
            }
        });
    });


    document.addEventListener("dragend", function (event) {
        if (draggingCard !== null) {
            draggingCard.classList.remove("dragging");
            draggingCard = null;
        }
    });

    function updateTaskCount() {
        taskLists.forEach(taskList => {

            const childCount = document.getElementById(taskList.id).childElementCount;
            document.getElementById(taskList.id + "-header").innerText = (taskList.id).toUpperCase() + " (" + childCount + ")";
        })


    }

    taskLists.forEach((taskList) => {
        taskList.addEventListener("drop", function (event) {
            updateTaskCount();
        });
    });

    updateTaskCount();
    function addCardClickListener(cardElement) {
        cardElement.addEventListener('click', (event) => {

            if (selectedCard===parseInt(cardElement.id)) {
                cardElement.style.backgroundColor="white";
                selectedCard=null;
                Appian.Component.saveValue("selectedTask", null);
            }
            else {
                selectedCard = cardElement.id;
                cardElement.style.backgroundColor=lighterColorCode;
                Appian.Component.saveValue("selectedTask", cardElement.id);
            }
        });
    }
});




