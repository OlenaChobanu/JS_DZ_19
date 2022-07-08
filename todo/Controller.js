class TodoController {
    #container$ = null;
    #view = null;
    #model = null;

    constructor(el) {
        this.#container$ = el;
        this.#view = new TodoView(this.#container$, {
            onCreate: this.onCreateTodo,
            onDelete: this.onDeleteTodo,
            onEdit: this.onEditTodo,
        });
        this.#model = new TodoModel('todos/');
        this.#model.getAllTodos().then(r => {
            this.#view.renderTodos(r);
        });
    }

    onCreateTodo = (todo) => {
        this.#model.createTodo(todo).then(r => {
            this.#model.getAllTodos().then(r => {
                this.#view.renderTodos(r);
            })
        });
    }

    onDeleteTodo = (id) => {
        this.#model.deleteTodo(id).then(r => {
            this.#model.getAllTodos().then(r => {
                this.#view.renderTodos(r);
            })
        })
    }

    onEditTodo = (id, todo) => {
        this.#model.editTodo(id, todo)
            .then(r => {
                r;
                this.#model.getAllTodos().then(r => {
                    this.#view.renderTodos(r);
                })
            })
    }
}