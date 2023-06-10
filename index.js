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
            body: JSON.stringify({task})
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
    } 
    else if (event.target.tagName === "SPAN"){
        // event.target.parentElement.remove();

        let listItem = event.target.parentNode;
        console.log(listItem)
        let taskText = listItem.textContent.trim();

        fetch('http://localhost:3000/tasks')
        .then(response => response.json())
        .then(data => {
            const task = data.find(item => item.task === taskText);

            if(!task) {
                throw new Error ('Task not found.');
            }

            return fetch(`http://localhost:3000/tasks/${task.id}`, {
                method: 'DELETE'
            });
        })
        .then(response => {
            if (response.ok) {
                listItem.remove();
        } else {
            throw new Error('Failed to delete the task');
        }
        })  .catch(error => {
         alert(error.message);
        });
    }
});

