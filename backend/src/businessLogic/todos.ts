// models 
import { TodoItem } from '../models/TodoItem'
import { TodoUpdate } from '../models/TodoUpdate'

import { TodoAccess } from '../dataLayer/todosAccess'


import { CreateTodoRequest } from '../requests/CreateTodoRequest'

const todoAccess = new TodoAccess()

export async function getTodos(userId:string): Promise<TodoItem[]> {
    return todoAccess.getTodos(userId)
}

export async function createTodo(userId:string, todoId:string, newTodo: CreateTodoRequest): Promise<TodoItem> {
    return todoAccess.createTodo(userId, todoId, newTodo)
}

export async function updateTodo(userId:string, todoId:string, updatedTodo: TodoUpdate): Promise<TodoUpdate> {
    return todoAccess.updateTodo(userId, todoId, updatedTodo)
}

export async function deleteTodo(userId:string, todoId:string): Promise<void> {
    await todoAccess.deleteTodo(userId, todoId)
}

export async function updateTodoImageUrl(userId:string, todoId:string, imageUrl:string): Promise<void> {
    await todoAccess.updateTodoImageUrl(userId, todoId, imageUrl)
}