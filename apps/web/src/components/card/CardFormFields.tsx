import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { FormField, FormGrid } from '@/components/ui/form-field'
import {
  PRIORITY_OPTIONS,
  WORK_ITEM_TYPE_OPTIONS,
  type Priority,
  type WorkItemType,
} from '@/types'

export interface CardFormData {
  title: string
  description: string
  startDate: string
  dueDate: string
  priority: Priority | ''
  workItemType: WorkItemType | ''
}

interface CardFormFieldsProps {
  data: CardFormData
  onChange: <K extends keyof CardFormData>(field: K, value: CardFormData[K]) => void
  idPrefix?: string
  requireFields?: boolean
}

export function CardFormFields({
  data,
  onChange,
  idPrefix = '',
  requireFields = false,
}: CardFormFieldsProps) {
  const id = (name: string) => `${idPrefix}${name}`

  return (
    <div className="space-y-4 py-4 max-h-[60vh] overflow-y-auto">
      <FormField id={id('title')} label="Título" required>
        <Input
          id={id('title')}
          placeholder="Digite o título do cartão"
          value={data.title}
          onChange={(e) => onChange('title', e.target.value)}
        />
      </FormField>

      <FormField id={id('description')} label="Descrição">
        <Textarea
          id={id('description')}
          placeholder="Digite uma descrição"
          value={data.description}
          onChange={(e) => onChange('description', e.target.value)}
          rows={3}
        />
      </FormField>

      <FormGrid>
        <FormField id={id('work-item-type')} label="Tipo de item" required={requireFields}>
          <Select
            value={data.workItemType}
            onValueChange={(value) => onChange('workItemType', value as WorkItemType | '')}
          >
            <SelectTrigger id={id('work-item-type')} className="w-full" aria-required={requireFields}>
              <SelectValue placeholder="Selecione..." />
            </SelectTrigger>
            <SelectContent>
              {WORK_ITEM_TYPE_OPTIONS.map(({ value, label }) => (
                <SelectItem key={value} value={value}>
                  {label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </FormField>

        <FormField id={id('priority')} label="Prioridade" required={requireFields}>
          <Select
            value={data.priority}
            onValueChange={(value) => onChange('priority', value as Priority | '')}
          >
            <SelectTrigger id={id('priority')} className="w-full" aria-required={requireFields}>
              <SelectValue placeholder="Selecione..." />
            </SelectTrigger>
            <SelectContent>
              {PRIORITY_OPTIONS.map(({ value, label }) => (
                <SelectItem key={value} value={value}>
                  {label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </FormField>
      </FormGrid>

      <FormGrid>
        <FormField id={id('start-date')} label="Data de início" required={requireFields}>
          <Input
            id={id('start-date')}
            type="date"
            value={data.startDate}
            onChange={(e) => onChange('startDate', e.target.value)}
            required={requireFields}
            aria-required={requireFields}
          />
        </FormField>

        <FormField id={id('due-date')} label="Data de término">
          <Input
            id={id('due-date')}
            type="date"
            value={data.dueDate}
            onChange={(e) => onChange('dueDate', e.target.value)}
          />
        </FormField>
      </FormGrid>
    </div>
  )
}

export function isFormValid(data: CardFormData, requireAllFields = false): boolean {
  if (!data.title.trim()) return false
  
  if (requireAllFields) {
    return Boolean(data.workItemType && data.priority && data.startDate)
  }
  
  return true
}
