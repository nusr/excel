// import type { StyleType, ResultType, IRange } from '@/types';
// type AddSheet = {
  // type: 'add_sheet';
  // sheetId: string;
  // name: string;
// };
// type deleteSheet = {
  // type: 'delete_sheet';
  // sheetId: string;
// };
// type SetCellValue = {
  // type: 'set_cell_value';
  // value: ResultType;
  // range: IRange[];
// };
// type DeleteCellValue = {
  // type: 'delete_cell_value';
  // range: IRange[];
// };
// type SetCellStype = {
  // type: 'set_cell_style';
  // value: Partial<StyleType>;
  // range: IRange[];
// };
// 
// type DeleteCellStype = {
  // type: 'delete_cell_style';
  // range: IRange[];
// };
// 
// type Operation =
  // | AddSheet
  // | deleteSheet
  // | SetCellValue
  // | DeleteCellValue
  // | SetCellStype
  // | DeleteCellStype;
// 
type CommandType = 'add';
interface BaseCommand {
  execute(): void;
  undo(): void;
}
// interface CommandValue {
  // type: CommandType;
// }
export class UndoRedoManager {
  private history: any[] = [];
  private position = 0;
  private readonly commandMap: Record<CommandType, BaseCommand>;
  constructor(commandMap: Record<CommandType, BaseCommand>) {
    this.commandMap = commandMap;
  }
  do(commandType: CommandType) {
    if (this.position < this.history.length - 1) {
      this.history = this.history.slice(0, this.position + 1);
    }
    const command = this.commandMap[commandType];
    if (command) {
      this.history.push(command);
      this.position += 1;
      command.execute();
    }
  }
  undo() {
    if (this.position > 0) {
      this.history[this.position].undo();
      this.position -= 1;
    }
  }
  redo() {
    if (this.position < this.history.length - 1) {
      this.position += 1;
      this.history[this.position].execute();
    }
  }
}
