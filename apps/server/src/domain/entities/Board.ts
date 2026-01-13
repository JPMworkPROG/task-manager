import { Entity } from './Entity.js'
import { Name } from '../value-objects/Name.js'
import type { Column } from './Column.js'

interface BoardProps {
  name: Name
  columns: Column[]
  createdAt: Date
  updatedAt: Date
}

interface CreateBoardInput {
  id?: string
  name: string
  columns?: Column[]
  createdAt?: Date
  updatedAt?: Date
}

export class Board extends Entity<BoardProps> {
  private constructor(id: string, props: BoardProps) {
    super(id, props)
  }

  static create(input: CreateBoardInput): Board {
    const { v4: uuidv4 } = require('uuid')
    const now = new Date()

    return new Board(input.id ?? uuidv4(), {
      name: Name.create(input.name, 'Board'),
      columns: input.columns ?? [],
      createdAt: input.createdAt ?? now,
      updatedAt: input.updatedAt ?? now,
    })
  }

  static reconstitute(
    id: string,
    name: string,
    columns: Column[],
    createdAt: Date,
    updatedAt: Date
  ): Board {
    return new Board(id, {
      name: Name.create(name, 'Board'),
      columns,
      createdAt,
      updatedAt,
    })
  }

  get name(): string {
    return this.props.name.getValue()
  }

  get columns(): Column[] {
    return [...this.props.columns].sort((a, b) => a.order - b.order)
  }

  get createdAt(): Date {
    return this.props.createdAt
  }

  get updatedAt(): Date {
    return this.props.updatedAt
  }

  addColumn(column: Column): void {
    this.props.columns.push(column)
    this.props.updatedAt = new Date()
  }

  removeColumn(columnId: string): void {
    this.props.columns = this.props.columns.filter((col) => col.id !== columnId)
    this.props.updatedAt = new Date()
  }

  getColumn(columnId: string): Column | undefined {
    return this.props.columns.find((col) => col.id === columnId)
  }

  hasColumn(columnId: string): boolean {
    return this.props.columns.some((col) => col.id === columnId)
  }

  getNextColumnOrder(): number {
    if (this.props.columns.length === 0) {
      return 0
    }
    return Math.max(...this.props.columns.map((col) => col.order)) + 1
  }
}
