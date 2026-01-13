import { Entity } from './Entity.js'
import { Title } from '../value-objects/Title.js'
import { Description } from '../value-objects/Description.js'

export type Priority = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL'
export type WorkItemType = 'BUG' | 'FEATURE' | 'IMPROVEMENT'

interface CardProps {
  title: Title
  description: Description
  startDate: Date | null
  dueDate: Date | null
  priority: Priority | null
  workItemType: WorkItemType | null
  columnId: string
  createdAt: Date
  updatedAt: Date
}

interface CreateCardInput {
  id?: string
  title: string
  description?: string | null
  startDate?: Date | null
  dueDate?: Date | null
  priority?: Priority | null
  workItemType?: WorkItemType | null
  columnId: string
  createdAt?: Date
  updatedAt?: Date
}

export class Card extends Entity<CardProps> {
  private constructor(id: string, props: CardProps) {
    super(id, props)
  }

  static create(input: CreateCardInput): Card {
    const { v4: uuidv4 } = require('uuid')
    const now = new Date()

    return new Card(input.id ?? uuidv4(), {
      title: Title.create(input.title),
      description: Description.create(input.description),
      startDate: input.startDate ?? null,
      dueDate: input.dueDate ?? null,
      priority: input.priority ?? null,
      workItemType: input.workItemType ?? null,
      columnId: input.columnId,
      createdAt: input.createdAt ?? now,
      updatedAt: input.updatedAt ?? now,
    })
  }

  static reconstitute(
    id: string,
    title: string,
    description: string | null,
    startDate: Date | null,
    dueDate: Date | null,
    priority: Priority | null,
    workItemType: WorkItemType | null,
    columnId: string,
    createdAt: Date,
    updatedAt: Date
  ): Card {
    return new Card(id, {
      title: Title.create(title),
      description: Description.create(description),
      startDate,
      dueDate,
      priority,
      workItemType,
      columnId,
      createdAt,
      updatedAt,
    })
  }

  get title(): string {
    return this.props.title.getValue()
  }

  get description(): string | null {
    return this.props.description.getValue()
  }

  get startDate(): Date | null {
    return this.props.startDate
  }

  get dueDate(): Date | null {
    return this.props.dueDate
  }

  get priority(): Priority | null {
    return this.props.priority
  }

  get workItemType(): WorkItemType | null {
    return this.props.workItemType
  }

  get columnId(): string {
    return this.props.columnId
  }

  get createdAt(): Date {
    return this.props.createdAt
  }

  get updatedAt(): Date {
    return this.props.updatedAt
  }

  updateTitle(newTitle: string): void {
    this.props.title = Title.create(newTitle)
    this.props.updatedAt = new Date()
  }

  updateDescription(newDescription: string | null): void {
    this.props.description = Description.create(newDescription)
    this.props.updatedAt = new Date()
  }

  updateStartDate(newStartDate: Date | null): void {
    this.props.startDate = newStartDate
    this.props.updatedAt = new Date()
  }

  updateDueDate(newDueDate: Date | null): void {
    this.props.dueDate = newDueDate
    this.props.updatedAt = new Date()
  }

  updatePriority(newPriority: Priority | null): void {
    this.props.priority = newPriority
    this.props.updatedAt = new Date()
  }

  updateWorkItemType(newWorkItemType: WorkItemType | null): void {
    this.props.workItemType = newWorkItemType
    this.props.updatedAt = new Date()
  }

  moveTo(newColumnId: string): void {
    this.props.columnId = newColumnId
    this.props.updatedAt = new Date()
  }
}
