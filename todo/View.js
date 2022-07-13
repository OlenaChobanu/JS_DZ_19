class TodoView {
    #container$ = null;
    #todoContainer = null;
    #options = null;
    #currentId = null;
    #todos = [];
    constructor(container, options) {
        this.#container$ = container;
        this.#options = options;
        this.init();
    }

    init() {
        this.initialRender();
        this.#todoContainer = $('.todos-cont');
    }

    initialRender(){
        this.#container$.append(this.createInitialBlock());
        this.initListeners();
    }

    createInitialBlock(){
        return `<div class="wrapper">
                    <div class="btn-container">
                        <input placeholder="todo title" id="title" type="text">
                        <input placeholder="todo body" id="body" type="text">
                        <button type="button" class="btn btn-add-todo">Add Todo</button>
                    </div>
                    <div class="todos-container">
                        <div class="todos-cont"></div>
                        <div class="edit-todo-cont">
                            <div class="edit-todo hidden">
                                <h2>Edit Todo:</h2>
                                <input placeholder="todo title" type="text" class="inp-edit inp-edit-todo-title">
                                <input placeholder="todo body" type="text" class="inp-edit inp-edit-todo-body">
                                <button type="button" class="btn btn-save-changes">Save changes</button>    
                            </div>
                        </div>
                    </div>
                </div>`;
    }

    initListeners(){
        $('.btn-add-todo').on('click', () => this.onTodoCreate());
        $('.todos-cont').on('click', this.onTodoClick);
        $('.btn-save-changes').on('click', () => this.onSaveChanges());
    }
    
    renderTodos(todos){
        this.#todos = todos;
        const html = todos.map(e => this.createElement(e)).join('');
        this.#todoContainer.html(html);
        this.ifTodoCompleted(todos);
    }

    ifTodoCompleted(todos) {
        let currentData = getCurrentDate(); 

        function getCurrentDate() {
            let current = new Date();
            let year = current.getFullYear();
            let month = current.getMonth() + 1;
            if (month < 10) month = '0' + month;
            let date = current.getDate();
            if (date < 10) date = '0' + date;
            return date +'.'+ month +'.'+ year;
        }
        
        todos.forEach(e => {
            e.isComplete === true ? (
                $(`#${e.id}`).addClass('completed-todo'), 
                $(`#${e.id}`).append(`<li>completeDate: ${currentData}</li>`),
                $(`#${e.id}`).children('.btn-complete').addClass('hidden')) 
                : $(`#${e.id}`).addClass('')})
    }

    createElement(todo){
        return `<ul id="${todo.id}" class="single-todo">
                    <button type="button" class="btn-delete" name="delete">x</button>
                    <li>title: ${todo.title}</li>
                    <li>body: ${todo.body}</li>
                    <li>isComplete: ${todo.isComplete}</li>
                    <button type="button" class="btn btn-complete" name="complete">Complete</button>
                </ul>`;
    }
    
    onTodoCreate = () => {
        $('.edit-todo').addClass('hidden');
        const title = $('#title').val();
        const body = $('#body').val();
        this.#options.onCreate({title, body});
        $('#title').val('');
        $('#body').val('');
    };

    onTodoClick = (e) => {
        if ($(e.target).hasClass('single-todo')) {
            this.#currentId = e.target.id;
            $('.single-todo').removeClass('single-todo-active');
            $(e.target).addClass('single-todo-active');
        } else  {
            this.#currentId = e.target.closest('.single-todo').id;
            $('.single-todo').removeClass('single-todo-active');
            $(e.target).parent('.single-todo').addClass('single-todo-active');
        }

        if(e.target.classList.contains('btn-delete')) {
            this.onTodoDelete(this.#currentId);
        } else if(e.target.classList.contains('btn-complete')) {
            this.onTodoComplete(this.#currentId); 
        } else {
            $('.edit-todo').removeClass('hidden');
        } 
    };
    
    onTodoDelete = () => {
        $('.edit-todo').addClass('hidden');
        this.#options.onDelete(this.#currentId);
    };

    onTodoComplete = () => {
        $('.edit-todo').addClass('hidden');
        const completedTodo = this.#todos.find(element => element.id == this.#currentId);
        completedTodo.isComplete = 'true';
        this.#options.onEdit(this.#currentId, completedTodo);
    };
    
    onSaveChanges = () => {
        const editTodo = this.#todos.find(element => element.id == this.#currentId);
        editTodo.isComplete = 'false';
        editTodo.title = $('.inp-edit-todo-title').val();
        editTodo.body = $('.inp-edit-todo-body').val();
        this.#options.onEdit(this.#currentId, editTodo);
        $('.inp-edit-todo-title').val('');
        $('.inp-edit-todo-body').val('');
        $('.edit-todo').addClass('hidden');
    };
}
