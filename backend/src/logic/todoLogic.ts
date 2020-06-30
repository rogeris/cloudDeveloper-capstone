import * as uuid from 'uuid'

import { TodoItem } from '../models/TodoItem'
import { TodoUpdate } from '../models/TodoUpdate'
import { TodosAccess } from '../DAOs/todosDAO'
import { CreateTodoRequest } from '../requests/CreateTodoRequest'
import { UpdateTodoRequest } from '../requests/UpdateTodoRequest'
import { parseUserId } from '../auth/utils'

const todoAccess = new TodosAccess()

export async function getUserTodos(jwtToken: string): Promise<TodoItem[]> {
  const userId = parseUserId(jwtToken)

  return await todoAccess.getTodosByUserId(userId)
}

export async function createTodo(
  createTodoRequest: CreateTodoRequest,
  jwtToken: string
): Promise<TodoItem> {

  const itemId = uuid.v4()
  const userId = parseUserId(jwtToken)

  return await todoAccess.createTodo({
    itemId: itemId,
    userId: userId,
    name: createTodoRequest.name,
    dueDate: createTodoRequest.dueDate,
    done: false,
    createdAt: new Date().toISOString()
  })
}

export async function deleteTodo(
  itemId: string,
  jwtToken: string
): Promise<TodoItem> {

  const userId = parseUserId(jwtToken)

  return await todoAccess.deleteTodo(itemId, userId)
}

export async function updateTodo(
  itemId: string,
  updateTodoRequest: UpdateTodoRequest,
  jwtToken: string
): Promise<TodoUpdate> {

  const userId = parseUserId(jwtToken)

  const updatedTodo: unknown = await todoAccess.updateTodo(userId, itemId,{
    name: updateTodoRequest.name,
    dueDate: updateTodoRequest.dueDate,
    done: updateTodoRequest.done
  })

  return updatedTodo as TodoUpdate
}

export async function updateAttachmentUrl(
  itemId: string,
  attachmentUrl: string,
  jwtToken: string
): Promise<TodoUpdate> {

  const userId = parseUserId(jwtToken)

  const updatedTodo: unknown = await todoAccess.updateAttachmentUrl(itemId, userId, attachmentUrl)

  return updatedTodo as TodoUpdate
}
