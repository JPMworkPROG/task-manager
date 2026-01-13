import { Entity } from './Entity.js'
import { Name } from '../value-objects/Name.js'
import type { Card } from './Card.js'

interface ColumnProps {
  name: Name
  order: number
  boardId: string
  cards: Card[]
  createdAt: Date
  updatedAt: Date
}

interface CreateColumnInput {
  id?: string
  name: string
  order: number
  boardId: string
  cards?: Card[]
  createdAt?: Date
  updatedAt?: Date
}

export class Column extends Entity<ColumnProps> {
  private constructor(id: string, props: ColumnProps) {
    super(id, props)
  }

  static create(input: CreateColumnInput): Column {
    const { v4: uuidv4 } = require('uuid')
    const now = new Date()

    return new Column(input.id ?? uuidv4(), {
      name: Name.create(input.name, 'Column'),
      order: input.order,
      boardId: input.boardId,
      cards: input.cards ?? [],
      createdAt: input.createdAt ?? now,
      updatedAt: input.updatedAt ?? now,
    })
  }

  static reconstitute(
    id: string,
    name: string,
    order: number,
    boardId: string,
    cards: Card[],
    createdAt: Date,
    updatedAt: Date
  ): Column {
    return new Column(id, {
      name: Name.create(name, 'Column'),
      order,
      boardId,
      cards,
      createdAt,
      updatedAt,
    })
  }

  get name(): string {
    return this.props.name.getValue()
  }

  get order(): number {
    return this.props.order
  }

  get boardId(): string {
    return this.props.boardId
  }

  get cards(): Card[] {
    return [...this.props.cards]
  }

  get createdAt(): Date {
    return this.props.createdAt
  }

  get updatedAt(): Date {
    return this.props.updatedAt
  }

  addCard(card: Card): void {
    this.props.cards.push(card)
    this.props.updatedAt = new Date()
  }

  removeCard(cardId: string): void {
    this.props.cards = this.props.cards.filter((card) => card.id !== cardId)
    this.props.updatedAt = new Date()
  }

  hasCard(cardId: string): boolean {
    return this.props.cards.some((card) => card.id === cardId)
  }

  getCardCount(): number {
    return this.props.cards.length
  }
}
