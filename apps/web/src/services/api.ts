import axios from 'axios'
import type {
  Board,
  Card,
  Column,
  CreateBoardData,
  CreateCardData,
  CreateColumnData,
  UpdateCardData,
} from '@/types'

const API_BASE_URL = import.meta.env.VITE_API_URL

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Boards
export async function getBoards(): Promise<Board[]> {
  const response = await api.get<Board[]>('/boards')
  return response.data
}

export async function getBoard(id: string): Promise<Board> {
  const response = await api.get<Board>(`/boards/${id}`)
  return response.data
}

export async function createBoard(data: CreateBoardData): Promise<Board> {
  const response = await api.post<Board>('/boards', data)
  return response.data
}

// Columns
export async function createColumn(
  boardId: string,
  data: CreateColumnData
): Promise<Column> {
  const response = await api.post<Column>(`/boards/${boardId}/columns`, data)
  return response.data
}

// Cards
export async function createCard(
  columnId: string,
  data: CreateCardData
): Promise<Card> {
  const response = await api.post<Card>(`/columns/${columnId}/cards`, data)
  return response.data
}

export async function updateCard(
  id: string,
  data: UpdateCardData
): Promise<Card> {
  const response = await api.put<Card>(`/cards/${id}`, data)
  return response.data
}

export async function deleteCard(id: string): Promise<void> {
  await api.delete(`/cards/${id}`)
}

export async function moveCard(
  id: string,
  newColumnId: string
): Promise<Card> {
  const response = await api.patch<Card>(`/cards/${id}/move`, { newColumnId })
  return response.data
}

export default api
