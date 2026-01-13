import type { Card } from '../entities/Card.js'

export interface CardRepository {
  findById(id: string): Promise<Card | null>
  findByColumnId(columnId: string): Promise<Card[]>
  save(card: Card): Promise<Card>
  update(card: Card): Promise<Card>
  delete(id: string): Promise<void>
  exists(id: string): Promise<boolean>
}
