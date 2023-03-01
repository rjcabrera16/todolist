// save todos data to local storage
const saveTodos = function (todos = todosData) {
    // convert todos data to string
    todos = JSON.stringify(todos);
    // save todos data to local storage as string value by a key name todos
    localStorage.setItem('todos', todos);
};

// get todos data from local storage
const getTodos = function () {
    try {
        // get todos data from local storage and parse it to convert it to array
        const todosData = JSON.parse(localStorage.getItem('todos'));
        if (todosData) {
            // return data if no error
            return todosData;
        } else {
            // return empty array if there is an error
            return [];
        }
    } catch (error) {
        // return empty array if there is an error
        return [];
    }
};

// delete todo by id
const deleteTodo = function (id) {
    // get todos array index by id
    const index = todosData.findIndex(function (todo) {
        return todo.id === id;
    });

    // delete todo if its index is found ant not -1
    if (index > -1) {
        todosData.splice(index, 1);
    }
};

// update todo completed value by id
const updateCompleted = function (id) {
    // get todo object data by id
    const todo = todosData.find(function (todo) {
        return todo.id === id;
    });
    // change todo completed value to true if current todo completed value is false, and false if the current todo completed value is true
    todo.completed = !todo.completed;
};

// todos data
let todosData = getTodos();

// temporary data
const tempData = {
    text: '',
    sort: '',
};

// generate dom elements
const generateElements = function (id, title, completed) {
    // create elements
    const todoItem = document.createElement('div');
    const todoItemCol1 = document.createElement('div');
    const todoCheck = document.createElement('input');
    const todoCheckLabel = document.createElement('label');
    const todoTitle = document.createElement('div');
    const todoDeleteBtn = document.createElement('button');
    const todoDeleteIcon = document.createElement('i');

    // append child
    todoItem.appendChild(todoItemCol1);
    todoItem.appendChild(todoDeleteBtn);
    todoItemCol1.appendChild(todoCheck);
    todoItemCol1.appendChild(todoCheckLabel);
    todoItemCol1.appendChild(todoTitle);
    todoDeleteBtn.appendChild(todoDeleteIcon);

    // adding attributes
    todoItem.setAttribute('class', 'todo-item');
    todoItemCol1.setAttribute('class', 'todo-item-col-1');
    todoCheck.setAttribute('type', 'checkbox');
    todoCheck.setAttribute('id', id);
    todoCheck.setAttribute('class', 'todo-check');
    todoCheckLabel.setAttribute('for', id);
    todoCheckLabel.setAttribute('class', 'todo-check-label');
    todoTitle.setAttribute('class', 'todo-title');
    todoTitle.textContent = title;
    todoDeleteBtn.setAttribute('class', 'todo-delete-btn');
    todoDeleteIcon.setAttribute('class', 'fa fa-trash');

    // events
    todoCheck.addEventListener('change', function () {
        // update todo completed by value
        updateCompleted(id);
        // render updated todos
        renderTodos();
        // save updated todos data to local storage
        saveTodos();
    });

    // add checked attribute to input checkbox if todo completed value is true
    todoCheck.checked = completed;

    todoDeleteBtn.addEventListener('click', function () {
        // delete todo and update todos data in local storage
        deleteTodo(id);
        saveTodos();
        // render updated todos
        renderTodos();
    });

    // return todo item to append by todo item container
    return todoItem;
};

// render todos
const renderTodos = function (todos = todosData, temp = tempData) {
    // filtered todos
    const filteredTodos = todos.filter(function (todo) {
        const text = todo.title.toLowerCase().includes(temp.text.toLowerCase());
        if (temp.sort === 'Completed') {
            return todo.completed && text;
        } else if (temp.sort === 'Incomplete') {
            return !todo.completed && text;
        } else {
            return text;
        }
    });

    const incompleteTodos = filteredTodos.filter(function (todo) {
        return !todo.completed;
    });

    const completedTodos = filteredTodos.filter(function (todo) {
        return todo.completed;
    });

    const todoMessage = document.querySelector('.todo-message');

    if (temp.sort === 'Completed') {
        switch (completedTodos.length) {
            case 0:
                todoMessage.textContent = `You have ${completedTodos.length} completed todo`;
                break;
            case 1:
                todoMessage.textContent = `You have ${completedTodos.length} completed todo`;
                break;
            default:
                todoMessage.textContent = `You have ${completedTodos.length} completed todos`;
        }
    } else {
        switch (incompleteTodos.length) {
            case 0:
                todoMessage.textContent = `You have ${incompleteTodos.length} todo left`;
                break;
            case 1:
                todoMessage.textContent = `You have ${incompleteTodos.length} todo left`;
                break;
            default:
                todoMessage.textContent = `You have ${incompleteTodos.length} todos left`;
        }
    }

    // hide duplicate data
    document.querySelector('.todo-item-container').innerHTML = '';

    // display todos
    filteredTodos.forEach(function (todo) {
        document.querySelector('.todo-item-container').appendChild(generateElements(todo.id, todo.title, todo.completed));
    });
};
renderTodos();

// search todo
document.querySelector('.todo-search').addEventListener('input', function (e) {
    // change tempData.text value
    tempData.text = e.target.value;
    // render search result todos
    renderTodos();
});

// toggle sort menu
const todoSortMenu = document.querySelector('.todo-sort-menu');
document.querySelector('.todo-sort-btn').addEventListener('click', function () {
    todoSortMenu.classList.toggle('hidden');
});

// hide sort menu by clicking anywhere except sort button
document.addEventListener('click', function (e) {
    if (!e.target.matches('.todo-sort-btn')) {
        // hide sort menu if class doesn't contain hidden
        if (!todoSortMenu.classList.contains('hidden')) {
            todoSortMenu.classList.toggle('hidden');
        }
    }
});

// sort todo
document.querySelectorAll('.todo-sort-item').forEach(function (item) {
    item.addEventListener('click', function (e) {
        // change tempData.sort value
        tempData.sort = e.target.textContent;
        // change sort button text
        document.querySelector('.todo-sort-text').textContent = tempData.sort;
        // render sorted todos
        renderTodos();
    });
});

// add todo
document.querySelector('.todo-add-form').addEventListener('submit', function (e) {
    // stop from refreshing page
    e.preventDefault();
    const todoAddinputLabel = document.querySelector('.todo-add-input-label');
    const todoAddInput = document.querySelector('#todo-add-input');
    if (todoAddInput.value === '') {
        // display this message if input value is empty
        todoAddinputLabel.textContent = 'This field is required!';
    } else {
        // remove error message if input value is not empty
        todoAddinputLabel.textContent = '';
        // add data to todosData
        todosData.push({
            id: uuidv4(),
            title: todoAddInput.value,
            completed: false,
        });
        // save updated todosData to local storage
        saveTodos();
        // clear input value
        todoAddInput.value = '';
        // render updated todos
        renderTodos();
    }
});

window.addEventListener('storage', function (e) {
    if (e.key === 'todos') {
        todosData = JSON.parse(e.newValue);
        renderTodos();
    }
});
