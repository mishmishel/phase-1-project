const inputBox = document.getElementById("input-box");
const listContainer = document.getElementById("list-container"); // contains the lists 
const addButton = document.getElementById("add-button");

addButton.disabled = true; // disabled Add button when page initially loads

inputBox.addEventListener("input", function() {
    const inputValue = inputBox.value.trim();
    addButton.disabled = inputValue === ' '; // disable Add button if input box is empty
})

function addTask() {

    const inputValue = inputBox.value.trim();

    if(inputValue === ''){
        return;
    } else { /* Else if user enters something in input box, the task will get added */
        let task = inputBox.value;
        let li = document.createElement("li");
        li.innerHTML = task;

        let taskId = task.id;

        li.setAttribute("data-task-id", taskId) // setting task ID as an attribute 

        listContainer.appendChild(li);

        /* Add X next to added task */
        let span = document.createElement("span");
        span.innerHTML = "\u00d7"; 
        li.appendChild(span);

        /*Save task to the db.json server by sending POST request*/
        fetch('http://localhost:3000/tasks', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify({task, checked: false})
        }) .then(response => {
            if (response.ok) {
                inputBox.value = ''; // to ensure that the input box is empty after submitting task
            } else {
                throw new Error ('Failed to save the task.');
            }
        }) .catch(error => {
            alert(error.message);
        });
    }
}

addButton.addEventListener("click", function() {
    if (!addButton.disabled) {
        addTask();
    }
}); // event listener on button to add task only if inputbox has content!!!

/* Fetching tasks from server using GET method */ 
fetch('http://localhost:3000/tasks')
.then(response => response.json())
.then(json => {
    json.forEach(task => {
        let li = document.createElement("li");
        li.innerHTML = task.task;

        li.setAttribute("data-task-id", task.id); // Setting task ID as a data attribute

        if (task.checked) {
            li.classList.add("checked");
        }

        listContainer.appendChild(li);

        let span = document.createElement("span");
        span.innerHTML = "\u00d7";
        
        li.appendChild(span);
    });
})
.catch(error => {
    alert('Failed to fetch tasks from the server.');
}); 

/* Allows user to press enter to add task */
inputBox.addEventListener("keyup", function(event) {
    if (event.key === 'Enter') {
        event.preventDefault();
        addTask()
    }
}); 

listContainer.addEventListener("click", function(event) {
    if (event.target.tagName === "LI") {
        event.target.classList.toggle("checked");

        // li.setAttribute("data-task-id", task.id)

        let listItem = event.target;

        // console.log(listItem)

        let taskId = listItem.getAttribute("data-task-id"); // retrieving task ID 

        // console.log(taskContent)

        console.log(taskId);

        fetch(`http://localhost:3000/tasks/${taskId}`)
        .then(response => response.json())
        .then(task => {
            task.checked = listItem.classList.contains("checked");
    
        return fetch(`http://localhost:3000/tasks/${taskId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(task)
        });
    }) .then(response => {
        if(response.ok) {

        } else {
            throw new Error('Failed to mark task as checked');
        }
    }) .catch(error => {
        alert(error.message);
    });
    
    }
    
    else if (event.target.tagName === "SPAN"){
        
        let listItem = event.target.parentNode;
        let taskText = listItem.textContent.trim(); // Returns whatever written plus X (.trim() removes white space)
        let taskContent = taskText.slice(0, -1).trim(); // Removes X from whatever written in input field (aka last character)

        console.log(listItem)
 
        fetch('http://localhost:3000/tasks')
        .then(response => response.json())
        .then(json => {
            const task = json.find(item => item.task === taskContent);

            if (!task) {
                throw new Error ('Task not found.');
            }

            return fetch(`http://localhost:3000/tasks/${task.id}`, {
                method: 'DELETE'
            });
        })
        .then(response => {
            if(response.ok) {
                event.target.parentElement.remove();
            } else {
                throw new Error ('Failed to delete the task')
            }
        })
        .catch(error => {
            alert(error.message);
        });
    }
});

/* Toggling between dark and light mode */
var icon = document.getElementById("icon");
icon.addEventListener("click", function() {
    document.body.classList.toggle("dark-theme"); /* Toggle to add class name */
    if(document.body.classList.contains("dark-theme")) {
        icon.src = "images/sun.png"
    } else {
        icon.src = "images/moon.jpg"
    }
})
