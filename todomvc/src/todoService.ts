const TODOS = 'todos-crank';
const SEQUENCE = 'todos-crank-sequence';

interface Sequence {
  value: number;
}

function nextSequenceValue() {
  const sequenceJson = localStorage.getItem(SEQUENCE);

  let sequence: Sequence;
  if (sequenceJson) {
    sequence = JSON.parse(sequenceJson);
  } else {
    sequence = { value: 0 };
  }

  sequence.value += 1;
  localStorage.setItem(SEQUENCE, JSON.stringify(sequence));
  return sequence.value;
}

export interface Todo {
  id: number;
  title: string;
  completed: boolean;
}

export function getAllTodos(): Todo[] {
  const todosJson = localStorage.getItem(TODOS);
  if (todosJson) {
    return JSON.parse(todosJson);
  } else {
    return [];
  }
}

export function getActiveTodos() {
  return getAllTodos().filter((t) => !t.completed);
}

export function getCompletedTodos() {
  return getAllTodos().filter((t) => t.completed);
}

export function saveTodo(title: string) {
  const todos = getAllTodos();
  todos.push({ id: nextSequenceValue(), title, completed: false });
  localStorage.setItem(TODOS, JSON.stringify(todos));
}

export function deleteTodo(todo: Todo) {
  const todos = getAllTodos().filter((t) => t.id != todo.id);
  localStorage.setItem(TODOS, JSON.stringify(todos));
}

export function setTodoStatus(todo: Todo, completed: boolean) {
  const todos = getAllTodos().map((t) => {
    if (t.id === todo.id) {
      t.completed = completed;
    }
    return t;
  });
  localStorage.setItem(TODOS, JSON.stringify(todos));
}

export function deleteCompletedTodos() {
  const todos = getAllTodos().filter((t) => !t.completed);
  localStorage.setItem(TODOS, JSON.stringify(todos));
}

export function toggleAllCompleted() {
  const todos = getAllTodos();
  const allCompleted = todos.every((t) => t.completed);
  todos.forEach((t) => (t.completed = !allCompleted));
  localStorage.setItem(TODOS, JSON.stringify(todos));
}

export function updateTodoTitle(todo: Todo, title: string) {
  const todos = getAllTodos().map((t) => {
    if (t.id === todo.id) {
      t.title = title;
    }
    return t;
  });
  localStorage.setItem(TODOS, JSON.stringify(todos));
}
