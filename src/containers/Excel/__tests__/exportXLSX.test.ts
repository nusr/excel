import { EHorizontalAlign, EUnderLine, EVerticalAlign } from '@/types';
import { convertToXMLData } from '../exportXLSX';
import { initController } from '@/controller';
import { mockImage } from '../../../model/mockData';

function trimData(content: string) {
  const list = content
    .split('\n')
    .map((v) => v.trim())
    .filter((v) => v);

  const result: string[] = [];
  for (const item of list) {
    const t = item
      .split(' ')
      .map((v) => v.trim())
      .filter((v) => v)
      .join(' ');
    result.push(t);
  }
  return result;
}

describe('exportXLSX.test.ts', () => {
  describe('convertToXMLData', () => {
    test('empty', () => {
      const controller = initController();
      const result = convertToXMLData(controller);
      expect(trimData(result['xl/worksheets/sheet1.xml'])).toEqual(
        trimData(`<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
        <worksheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main"
          xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships"
          xmlns:mc="http://schemas.openxmlformats.org/markup-compatibility/2006" mc:Ignorable="x14ac xr xr2 xr3"
          xmlns:x14ac="http://schemas.microsoft.com/office/spreadsheetml/2009/9/ac"
          xmlns:xr="http://schemas.microsoft.com/office/spreadsheetml/2014/revision"
          xmlns:xr2="http://schemas.microsoft.com/office/spreadsheetml/2015/revision2"
          xmlns:xr3="http://schemas.microsoft.com/office/spreadsheetml/2016/revision3" xr:uid="{9B2CBB7B-9BFB-4EF9-A18C-0B0DED5460D3}">
          <dimension ref="A1:D5"/>
          <sheetViews>
            <sheetView tabSelected="1" workbookViewId="0">
            <selection activeCell="A1" sqref="A1"/>
            </sheetView>
          </sheetViews>
          <sheetFormatPr defaultRowHeight="13.9" x14ac:dyDescent="0.4"/>
          <sheetData/>
          <phoneticPr fontId="0" type="noConversion"/>
          <pageMargins left="0.7" right="0.7" top="0.75" bottom="0.75" header="0.3" footer="0.3"/>
        </worksheet>`),
      );
    });
    test('normal', () => {
      const controller = initController();
      controller.setCell(
        [
          [true, false, 'true', 'false', 'ab'],
          ['=SUM(1,SUM(1,3))', 5, 6, '测', '永1'],
        ],
        [
          [
            {
              isBold: true,
              isItalic: true,
              fontSize: 20,
              isStrike: true,
              isWrapText: true,
              fontColor: '#000',
              fillColor: '#fff',
              fontFamily: 'simsun',
              underline: EUnderLine.DOUBLE,
              numberFormat: 'General',
              horizontalAlign: EHorizontalAlign.LEFT,
              verticalAlign: EVerticalAlign.TOP,
            },
          ],
        ],
        {
          row: 0,
          col: 0,
          rowCount: 1,
          colCount: 1,
          sheetId: controller.getCurrentSheetId(),
        },
      );
      controller.setDefineName(
        {
          row: 0,
          col: 0,
          colCount: 1,
          rowCount: 1,
          sheetId: controller.getCurrentSheetId(),
        },
        'foo',
      );
      controller.setColWidth(1, 80);
      controller.hideCol(1, 1);
      controller.addDrawing({
        title: 'Chart Title',
        type: 'chart',
        uuid: '1',
        width: 400,
        height: 250,
        originHeight: 250,
        originWidth: 400,
        marginX: 0,
        marginY: 0,
        sheetId: controller.getCurrentSheetId(),
        fromCol: 4,
        fromRow: 4,
        chartType: 'bar',
        chartRange: {
          row: 0,
          col: 0,
          colCount: 3,
          rowCount: 3,
          sheetId: controller.getCurrentSheetId(),
        },
      });
     
      controller.addSheet();
      controller.addDrawing({
        title: 'icon',
        type: 'floating-picture',
        uuid: '2',
        imageSrc: mockImage,
        width: 200,
        height: 356,
        originHeight: 356,
        originWidth: 200,
        sheetId: controller.getCurrentSheetId(),
        fromCol: 1,
        fromRow: 1,
        marginX: 0,
        marginY: 0,
      });
      controller.renameSheet('test sheet');
      controller.setDefineName(
        {
          row: 0,
          col: 0,
          colCount: 1,
          rowCount: 1,
          sheetId: controller.getCurrentSheetId(),
        },
        'doo',
      );
      const result = convertToXMLData(controller);
      expect(trimData(result['xl/worksheets/sheet1.xml'])).toEqual(
        trimData(`<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
        <worksheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main"
          xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships"
          xmlns:mc="http://schemas.openxmlformats.org/markup-compatibility/2006" mc:Ignorable="x14ac xr xr2 xr3"
          xmlns:x14ac="http://schemas.microsoft.com/office/spreadsheetml/2009/9/ac"
          xmlns:xr="http://schemas.microsoft.com/office/spreadsheetml/2014/revision"
          xmlns:xr2="http://schemas.microsoft.com/office/spreadsheetml/2015/revision2"
          xmlns:xr3="http://schemas.microsoft.com/office/spreadsheetml/2016/revision3" xr:uid="{9B2CBB7B-9BFB-4EF9-A18C-0B0DED5460D3}">
          <dimension ref="A1:D5"/>
          <sheetViews>
            <sheetView  workbookViewId="0">
            <selection activeCell="A1" sqref="A1"/>
            </sheetView>
          </sheetViews>
          <sheetFormatPr defaultRowHeight="13.9" x14ac:dyDescent="0.4"/>
          <cols><col min="2" max="2" width="10" customWidth="1" hidden="1"/></cols>
          <sheetData>
            <row r="1"  x14ac:dyDescent="0.4">
              <c r="A1" s="1"><v>TRUE</v></c>
              <c r="B1" ><v>FALSE</v></c>
              <c r="C1" ><v>TRUE</v></c>
              <c r="D1" ><v>FALSE</v></c>
              <c r="E1" ><v>ab</v></c>
            </row>
            <row r="2"  x14ac:dyDescent="0.4">
              <c r="A2" ><f>SUM(1,SUM(1,3))</f><v>5</v></c>
              <c r="B2" ><v>5</v></c>
              <c r="C2" ><v>6</v></c>
              <c r="D2" ><v>测</v></c>
              <c r="E2" ><v>永1</v></c>
            </row>
          </sheetData>
          <phoneticPr fontId="0" type="noConversion"/>
          <pageMargins left="0.7" right="0.7" top="0.75" bottom="0.75" header="0.3" footer="0.3"/>
        </worksheet>`),
      );
      expect(trimData(result['xl/styles.xml'])).toEqual(
        trimData(`<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
      <styleSheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main"
        xmlns:mc="http://schemas.openxmlformats.org/markup-compatibility/2006" mc:Ignorable="x14ac x16r2 xr"
        xmlns:x14ac="http://schemas.microsoft.com/office/spreadsheetml/2009/9/ac"
        xmlns:x16r2="http://schemas.microsoft.com/office/spreadsheetml/2015/02/main"
        xmlns:xr="http://schemas.microsoft.com/office/spreadsheetml/2014/revision">
        <fonts count="2">
          <font>
            <sz val="11"/>
            <color theme="1"/>
            <name val="Calibri"/>
            <charset val="134"/>
            <scheme val="minor"/>
          </font>
          <font>
            <u/>
            <b/>
            <i/>
            <strike/>
            <sz val="20"/>
            <color rgb="FF000000"/>
            <name val="simsun"/>
            <charset val="0"/>
            <scheme val="minor"/>
          </font>
        </fonts>
        <fills count="2">
          <fill>
            <patternFill patternType="none"/>
          </fill>
          <fill>
            <patternFill patternType="solid">
            <fgColor rgb="FFFFFFFF"/>
            <bgColor indexed="64"/>
            </patternFill>
          </fill>
        </fills>
        <cellXfs count="2">
          <xf numFmtId="0" fontId="0" fillId="0" borderId="0" xfId="0">
            <alignment vertical="center"/>
          </xf>
          <xf numFmtId="0" fontId="1" fillId="1" borderId="0" xfId="0" applyFill="1" applyFont="1" applyNumberFormat="1" applyAlignment="1">
            <alignment wrapText="1" horizontal="left" vertical="top"/>
          </xf>
        </cellXfs>
        <borders count="1">
          <border>
            <left/>
            <right/>
            <top/>
            <bottom/>
            <diagonal/>
          </border>
        </borders>
        <cellStyleXfs count="1">
          <xf numFmtId="0" fontId="0" fillId="0" borderId="0" xfId="0">
            <alignment vertical="center"/>
          </xf>
        </cellStyleXfs>
        <cellStyles count="1">
          <cellStyle name="常规" xfId="0" builtinId="0"/>
        </cellStyles>
        <dxfs count="0"/>
        <tableStyles count="0" defaultTableStyle="TableStyleMedium2" defaultPivotStyle="PivotStyleLight16"/>
        <extLst>
          <ext uri="{EB79DEF2-80B8-43e5-95BD-54CBDDF9020C}"
            xmlns:x14="http://schemas.microsoft.com/office/spreadsheetml/2009/9/main">
            <x14:slicerStyles defaultSlicerStyle="SlicerStyleLight1"/>
          </ext>
          <ext uri="{9260A510-F301-46a8-8635-F512D64BE5F5}"
            xmlns:x15="http://schemas.microsoft.com/office/spreadsheetml/2010/11/main">
            <x15:timelineStyles defaultTimelineStyle="TimeSlicerStyleLight1"/>
          </ext>
        </extLst>
      </styleSheet>`),
      );
      expect(trimData(result['xl/workbook.xml'])).toEqual(
        trimData(`<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
      <workbook xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main"
        xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships"
        xmlns:mc="http://schemas.openxmlformats.org/markup-compatibility/2006" mc:Ignorable="x15 xr xr6 xr10 xr2"
        xmlns:x15="http://schemas.microsoft.com/office/spreadsheetml/2010/11/main"
        xmlns:xr="http://schemas.microsoft.com/office/spreadsheetml/2014/revision"
        xmlns:xr6="http://schemas.microsoft.com/office/spreadsheetml/2016/revision6"
        xmlns:xr10="http://schemas.microsoft.com/office/spreadsheetml/2016/revision10"
        xmlns:xr2="http://schemas.microsoft.com/office/spreadsheetml/2015/revision2">
        <fileVersion appName="xl" lastEdited="7" lowestEdited="7" rupBuild="27328"/>
        <workbookPr defaultThemeVersion="166925"/>
        <mc:AlternateContent xmlns:mc="http://schemas.openxmlformats.org/markup-compatibility/2006">
          <mc:Choice Requires="x15">
            <x15ac:absPath url="C:UsersstevexuDesktop"
              xmlns:x15ac="http://schemas.microsoft.com/office/spreadsheetml/2010/11/ac"/>
          </mc:Choice>
        </mc:AlternateContent>
        <xr:revisionPtr revIDLastSave="0" documentId="13_ncr:1_{39800FFC-1B5B-45A9-B956-6FB55C475C9F}" xr6:coauthVersionLast="47" xr6:coauthVersionMax="47" xr10:uidLastSave="{00000000-0000-0000-0000-000000000000}"/>
        <bookViews>
        <workbookView xWindow="-98" yWindow="-98" windowWidth="19396" windowHeight="11475"  activeTab="1" xr2:uid="{11AE31A3-10C3-4738-A21D-56F9E9832A43}"/>
        </bookViews>
        <sheets>
          <sheet name="Sheet1" sheetId="1" r:id="rId1"/>
          <sheet name="test sheet" sheetId="2" r:id="rId2"/>
        </sheets>
        <definedNames>
          <definedName name="foo">Sheet1!$A$1</definedName>
          <definedName name="doo">'test sheet'!$A$1</definedName>
        </definedNames>
        <calcPr calcId="191029"/>
        <extLst>
          <ext uri="{140A7094-0E35-4892-8432-C4D2E57EDEB5}"
            xmlns:x15="http://schemas.microsoft.com/office/spreadsheetml/2010/11/main">
            <x15:workbookPr chartTrackingRefBase="1"/>
          </ext>
        </extLst>
      </workbook>`),
      );

      expect(trimData(result['[Content_Types].xml'])).toEqual(
        trimData(`<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
      <Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types">
        <Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/>
        <Default Extension="xml" ContentType="application/xml"/>
        <Default Extension="jpeg" ContentType="image/jpeg"/>
        <Override PartName="/xl/worksheets/sheet1.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.worksheet+xml"/>
        <Override PartName="/xl/worksheets/sheet2.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.worksheet+xml"/>
        <Override PartName="/xl/charts/chart1.xml" ContentType="application/vnd.openxmlformats-officedocument.drawingml.chart+xml"/>
        <Override PartName="/xl/charts/colors1.xml" ContentType="application/vnd.ms-office.chartcolorstyle+xml"/>
        <Override PartName="/xl/charts/style1.xml" ContentType="application/vnd.ms-office.chartstyle+xml"/>
        <Override PartName="/xl/drawings/drawing1.xml" ContentType="application/vnd.openxmlformats-officedocument.drawing+xml"/>
        <Override PartName="/xl/drawings/drawing2.xml" ContentType="application/vnd.openxmlformats-officedocument.drawing+xml"/>
        <Override PartName="/xl/workbook.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet.main+xml"/>
        <Override PartName="/xl/theme/theme1.xml" ContentType="application/vnd.openxmlformats-officedocument.theme+xml"/>
        <Override PartName="/xl/styles.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.styles+xml"/>
        <Override PartName="/xl/sharedStrings.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.sharedStrings+xml"/>
        <Override PartName="/docProps/core.xml" ContentType="application/vnd.openxmlformats-package.core-properties+xml"/>
        <Override PartName="/docProps/app.xml" ContentType="application/vnd.openxmlformats-officedocument.extended-properties+xml"/>
      </Types>`),
      );

      expect(trimData(result['xl/drawings/_rels/drawing1.xml.rels'])).toEqual(
        trimData(`<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
      <Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">
      <Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/chart" Target="../charts/chart1.xml"/>
      </Relationships>`),
      );

      expect(trimData(result['xl/drawings/_rels/drawing2.xml.rels'])).toEqual(
        trimData(`<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
      <Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">
      <Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/image" Target="../media/image1.jpeg"/>
      </Relationships>`),
      );
    });
  });
});
