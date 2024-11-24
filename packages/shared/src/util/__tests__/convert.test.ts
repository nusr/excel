import { columnNameToInt, intToColumnName, rowLabelToInt } from '../convert';

describe('convert.test.ts', () => {
  describe('rowLabelToInt', () => {
    test('invalid', () => {
      expect(rowLabelToInt('ff')).toEqual(-1);
      expect(rowLabelToInt('-10')).toEqual(-1);
    });
    test('ok', () => {
      expect(rowLabelToInt('1')).toEqual(0);
      expect(rowLabelToInt('10')).toEqual(9);
    });
  });
  describe('columnNameToInt', () => {
    test('invalid', () => {
      expect(columnNameToInt('1')).toEqual(-16);
      expect(columnNameToInt('')).toEqual(-1);
    });
    it('should convert A, B and C to 1, 2 and 3', () => {
      expect(columnNameToInt('A')).toEqual(0);
      expect(columnNameToInt('B')).toEqual(1);
      expect(columnNameToInt('C')).toEqual(2);
    });

    it('should convert a, b and c to 1, 2 and 3', () => {
      expect(columnNameToInt('a')).toEqual(0);
      expect(columnNameToInt('b')).toEqual(1);
      expect(columnNameToInt('c')).toEqual(2);
    });

    it('should convert X, Y and Z to 24, 25 and, 26', () => {
      expect(columnNameToInt('X')).toEqual(23);
      expect(columnNameToInt('Y')).toEqual(24);
      expect(columnNameToInt('Z')).toEqual(25);
    });

    it('should convert AA, AB and AC to 27, 28 and, 29', () => {
      expect(columnNameToInt('AA')).toEqual(26);
      expect(columnNameToInt('AB')).toEqual(27);
      expect(columnNameToInt('AC')).toEqual(28);
    });

    it('should convert AZ, BA to 52, 53', () => {
      expect(columnNameToInt('AZ')).toEqual(51);
      expect(columnNameToInt('BA')).toEqual(52);
    });

    it('should convert JZ, KA to 286, 287', () => {
      expect(columnNameToInt('JZ')).toEqual(285);
      expect(columnNameToInt('KA')).toEqual(286);
    });

    it('should convert ZZ, AAA to 702, 703', () => {
      expect(columnNameToInt('ZZ')).toEqual(701);
      expect(columnNameToInt('AAA')).toEqual(702);
    });

    it('should convert AEZ, AFA to 832, 833', () => {
      expect(columnNameToInt('AEZ')).toEqual(831);
      expect(columnNameToInt('AFA')).toEqual(832);
    });
    it('should convert aez, afa to 832, 833', () => {
      expect(columnNameToInt('aez')).toEqual(831);
      expect(columnNameToInt('afa')).toEqual(832);
    });
  });

  describe('intToColumnName', () => {
    it('should convert column 1, 2 and 3 to A, B and C', () => {
      expect(intToColumnName(0)).toEqual('A');
      expect(intToColumnName(1)).toEqual('B');
      expect(intToColumnName(2)).toEqual('C');
    });

    it('should convert column 24, 25 and 26 to X, Y and Z', () => {
      expect(intToColumnName(23)).toEqual('X');
      expect(intToColumnName(24)).toEqual('Y');
      expect(intToColumnName(25)).toEqual('Z');
    });

    it('should convert column 27, 28 and 29 to AA, AB and AC', () => {
      expect(intToColumnName(26)).toEqual('AA');
      expect(intToColumnName(27)).toEqual('AB');
      expect(intToColumnName(28)).toEqual('AC');
    });

    it('should convert column 52 and 53 to AZ and BA', () => {
      expect(intToColumnName(51)).toEqual('AZ');
      expect(intToColumnName(52)).toEqual('BA');
    });

    it('should convert column 286 and 287 to JZ and KA', () => {
      expect(intToColumnName(285)).toEqual('JZ');
      expect(intToColumnName(286)).toEqual('KA');
    });

    it('should convert column 702 and 703 to ZZ and AAA', () => {
      expect(intToColumnName(701)).toEqual('ZZ');
      expect(intToColumnName(702)).toEqual('AAA');
    });

    it('should convert column 832 and 833 to AEZ and AFA', () => {
      expect(intToColumnName(831)).toEqual('AEZ');
      expect(intToColumnName(832)).toEqual('AFA');
    });
  });
});
