const inputBox = document.getElementById("input-box");
const listContainer = document.getElementById("list-container");

function addTask() {
    /* If the input box is empty and user clicks add this will send alert */
    if(inputBox.value === ''){
        alert("Don't be lazy! You have to write something!");
    } else { /* Else if user enters something in input box, the task will get added */
        let task = inputBox.value;
        let li = document.createElement("li");
        li.innerHTML = task;

        listContainer.appendChild(li);

        /* Add X next to added task */
        let span = document.createElement("span");
        span.innerHTML = "\u00d7";
        li.appendChild(span);

        /*Save task to the db.json server by sending POST request*/
        fetch('http://localhost:3000/tasks', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({task, checked: false})
        }) .then(response => {
            if (response.ok) {
                inputBox.value = '';
            } else {
                throw new Error ('Failed to save the task.');
            }
        }) .catch(error => {
            alert(error.message);
        });
    }
}

/* Fetching tasks from server using GET method */ 
fetch('http://localhost:3000/tasks')
.then(response => response.json())
.then(json => {
    json.forEach(task => {
        let li = document.createElement("li");
        li.innerHTML = task.task;

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

        let listItem = event.target;
        let taskText = listItem.textContent.trim(); // Returns whatever written plus X
        let taskContent = taskText.slice(0, -1).trim(); // Removes X from whatever written in input field

        // console.log(taskContent)

        fetch('http://localhost:3000/tasks')
        .then(response => response.json())
        .then(json => { const task = json.find(item => item.task === taskContent);
        if (!task) {
            throw new Error ('Task not found.'); 
        } task.checked = listItem.classList.contains("checked");
    
        return fetch(`http://localhost:3000/tasks/${task.id}`, {
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
        // event.target.parentElement.remove();
        let listItem = event.target.parentNode;
        let taskText = listItem.textContent.trim(); // Returns whatever written plus X
        let taskContent = taskText.slice(0, -1).trim(); // Removes X from whatever written in input field

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

var icon = document.getElementById("icon");
icon.addEventListener("click", function() {
    document.body.classList.toggle("dark-theme");
    if(document.body.classList.contains("dark-theme")) {
        icon.src = "images/sun.png"
    } else {
        icon.src = "images/moon.jpg"
    }
})
