const express = require("express");
const cors = require("cors");

const { v4: uuid } = require("uuid");

const app = express();

app.use(cors());
app.use(express.json());

const users = [];

function checksExistsUserAccount(request, response, next) {
  const user = users.find((it) => it.username === request.headers.username);

  user ? next() : response.status(401).json("Error: Usuário não encontrado");
}

app.post("/users", (request, response) => {
  const newUser = {
    id: uuid(),
    name: request.body.name,
    username: request.body.username,
    todos: [],
  };

  users.push(newUser);

  response.status(202).send(newUser);
});

app.get("/todos", checksExistsUserAccount, (request, response) => {
  const user = users.find((it) => it.username === request.headers.username);
  response.status(202).send(user.todos);
});

app.post("/todos", checksExistsUserAccount, (request, response) => {
  const user = users.find((it) => it.username === request.headers.username);
  const newTodo = {
    id: uuid(),
    title: request.body.title ? request.body.title : "Sem título",
    done: false,
    deadline: request.body.deadline
      ? new Date(request.body.deadline)
      : "Sem deadline",
    created_at: new Date(),
  };
  user.todos.push(newTodo);
  response.status(202).send(newTodo);
});

app.put("/todos/:id", checksExistsUserAccount, (request, response) => {
  const user = users.find((it) => it.username === request.headers.username);

  const todo = user.todos.find((it) => it.id === request.params.id);
  todo.title = request.body.title;
  todo.deadline = new Date(request.body.deadline);

  response.status(202).send(todo);
});

app.patch("/todos/:id/done", checksExistsUserAccount, (request, response) => {
  const user = users.find((it) => it.username === request.headers.username);

  const todo = user.todos.find((it) => it.id === request.params.id);
  todo.done = true;

  response.status(202).send(todo);
});

app.delete("/todos/:id", checksExistsUserAccount, (request, response) => {
  const user = users.find((it) => it.username === request.headers.username);
  const indexTodo = user.todos.findIndex((it) => it.id === request.params.id);

  user.todos.splice(indexTodo, 1);

  response.status(202).send();
});

module.exports = app;
