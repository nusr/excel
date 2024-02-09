import { convertXMLToJSON } from '../Excel/import';

describe('Excel.test.ts', () => {
  test('convertXMLToJSON', () => {
    const mockXML = `<worksheet>
      <sheetData>
        <row r="1" spans="1:1">
          <c r="A1" s="1">
            <v>123</v>
          </c>
        </row>
        <row r="2" spans="1:1">
          <c r="A2" s="2"/>
        </row>
      </sheetData>
    </worksheet>`;
    const result = convertXMLToJSON(mockXML);
    expect(result).toEqual({
      worksheet: {
        sheetData: {
          row: [
            {
              r: '1',
              spans: '1:1',
              c: {
                r: 'A1',
                s: '1',
                v: {
                  '#text': '123',
                },
              },
            },
            {
              r: '2',
              spans: '1:1',
              c: {
                r: 'A2',
                s: '2',
              },
            },
          ],
        },
      },
    });
  });
});
