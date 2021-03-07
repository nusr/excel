import { columnNameToInt, intToColumnName } from "../convert";
// console.log('columnNameToInt("XFD")', columnNameToInt("XFD"));
describe("convert.test.ts", () => {
  describe("columnNameToInt", () => {
    it("should convert A, B and C to 1, 2 and 3", function () {
      expect(columnNameToInt("A")).toEqual(1);
      expect(columnNameToInt("B")).toEqual(2);
      expect(columnNameToInt("C")).toEqual(3);
    });

    it("should convert a, b and c to 1, 2 and 3", function () {
      expect(columnNameToInt("a")).toEqual(1);
      expect(columnNameToInt("b")).toEqual(2);
      expect(columnNameToInt("c")).toEqual(3);
    });

    it("should convert X, Y and Z to 24, 25 and, 26", function () {
      expect(columnNameToInt("X")).toEqual(24);
      expect(columnNameToInt("Y")).toEqual(25);
      expect(columnNameToInt("Z")).toEqual(26);
    });

    it("should convert AA, AB and AC to 27, 28 and, 29", function () {
      expect(columnNameToInt("AA")).toEqual(27);
      expect(columnNameToInt("AB")).toEqual(28);
      expect(columnNameToInt("AC")).toEqual(29);
    });

    it("should convert AZ, BA to 52, 53", function () {
      expect(columnNameToInt("AZ")).toEqual(52);
      expect(columnNameToInt("BA")).toEqual(53);
    });

    it("should convert JZ, KA to 286, 287", function () {
      expect(columnNameToInt("JZ")).toEqual(286);
      expect(columnNameToInt("KA")).toEqual(287);
    });

    it("should convert ZZ, AAA to 702, 703", function () {
      expect(columnNameToInt("ZZ")).toEqual(702);
      expect(columnNameToInt("AAA")).toEqual(703);
    });

    it("should convert AEZ, AFA to 832, 833", function () {
      expect(columnNameToInt("AEZ")).toEqual(832);
      expect(columnNameToInt("AFA")).toEqual(833);
    });
    it("should convert aez, afa to 832, 833", function () {
      expect(columnNameToInt("aez")).toEqual(832);
      expect(columnNameToInt("afa")).toEqual(833);
    });
  });

  describe("intToColumnName", () => {
    it("should convert column 1, 2 and 3 to A, B and C", function () {
      expect(intToColumnName(1)).toEqual("A");
      expect(intToColumnName(2)).toEqual("B");
      expect(intToColumnName(3)).toEqual("C");
    });

    it("should convert column 24, 25 and 26 to X, Y and Z", function () {
      expect(intToColumnName(24)).toEqual("X");
      expect(intToColumnName(25)).toEqual("Y");
      expect(intToColumnName(26)).toEqual("Z");
    });

    it("should convert column 27, 28 and 29 to AA, AB and AC", function () {
      expect(intToColumnName(27)).toEqual("AA");
      expect(intToColumnName(28)).toEqual("AB");
      expect(intToColumnName(29)).toEqual("AC");
    });

    it("should convert column 52 and 53 to AZ and BA", function () {
      expect(intToColumnName(52)).toEqual("AZ");
      expect(intToColumnName(53)).toEqual("BA");
    });

    it("should convert column 286 and 287 to JZ and KA", function () {
      expect(intToColumnName(286)).toEqual("JZ");
      expect(intToColumnName(287)).toEqual("KA");
    });

    it("should convert column 702 and 703 to ZZ and AAA", function () {
      expect(intToColumnName(702)).toEqual("ZZ");
      expect(intToColumnName(703)).toEqual("AAA");
    });

    it("should convert column 832 and 833 to AEZ and AFA", function () {
      expect(intToColumnName(832)).toEqual("AEZ");
      expect(intToColumnName(833)).toEqual("AFA");
    });
  });
});
