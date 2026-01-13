import type { BoardRepository } from '../../../domain/repositories/BoardRepository.js'
import { Board } from '../../../domain/entities/Board.js'
import type { CreateBoardDTO, BoardDTO } from '../../dtos/BoardDTO.js'
import { toBoardDTO } from '../../dtos/BoardDTO.js'

export class CreateBoardUseCase {
  constructor(private readonly boardRepository: BoardRepository) { }

  async execute(input: CreateBoardDTO): Promise<BoardDTO> {
    const board = Board.create({ name: input.name })
    const savedBoard = await this.boardRepository.save(board)
    return toBoardDTO(savedBoard)
  }
}
