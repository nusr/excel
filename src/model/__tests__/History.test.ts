import { History } from '../History';
import { ICommand } from '@/types';

describe('History.test.ts', () => {
  test('init History', () => {
    const history = new History({});
    const command: ICommand = {
      execute: () => {},
      undo: () => {},
      redo: () => {},
    };
    history.push(command);
    history.commit();
    expect(history.get()).toEqual([command]);
  });
  test('support change options', () => {
    let value = '1';
    const change = () => {
      value = '2';
    };
    const history = new History({ change });

    expect(value).toEqual('1');

    const command: ICommand = {
      execute: () => {},
      undo: () => {},
      redo: () => {},
    };
    history.push(command);
    history.commit();
    expect(value).toEqual('2');
  });

  test('support maxLength options', () => {
    const history = new History({ maxLength: 1 });

    expect(history.getLength()).toEqual(0);
    const command: ICommand = {
      execute: () => {},
      undo: () => {},
      redo: () => {},
    };
    history.push(command);
    history.commit();
    expect(history.getLength()).toEqual(1);
    history.push(command);
    history.commit();
    expect(history.getLength()).toEqual(1);
  });
  test('update undo redo correct', () => {
    const history = new History({});

    expect(history.canRedo()).toBeFalsy();
    expect(history.canUndo()).toBeFalsy();

    const command: ICommand = {
      execute: () => {},
      undo: () => {},
      redo: () => {},
    };
    history.push(command);
    history.commit();
    history.push(command);
    history.commit();

    expect(history.canRedo()).toBeFalsy();
    expect(history.canUndo()).toBeTruthy();

    history.undo();
    expect(history.canRedo()).toBeTruthy();
    expect(history.canUndo()).toBeFalsy();

    history.redo();
    expect(history.canRedo()).toBeFalsy();
    expect(history.canUndo()).toBeTruthy();
  });

  test('update state correct', () => {
    const history = new History({});
    const oldName = 'test1';
    const newName = 'test1';
    const target = {
      name: oldName,
    };
    const command: ICommand = {
      execute: () => {
        target.name = newName;
      },
      undo: () => {
        target.name = oldName;
      },
      redo: () => {
        target.name = newName;
      },
    };
    history.push(command);
    history.commit();
    expect(target.name).toEqual(newName);

    history.undo();
    expect(target.name).toEqual(oldName);

    history.redo();
    expect(target.name).toEqual(newName);
  });
});
