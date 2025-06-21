import {
  makeFont,
  convertToCssString,
  parseHTML,
  parseText,
  convertPxToPt,
  convertToPx,
} from '../style';
import { EUnderLine } from '../../types';

describe('style.test.ts', () => {
  describe('convertPxToPt', () => {
    test('ok', () => {
      expect(convertPxToPt(22)).toEqual('16pt');
      expect(convertPxToPt(76)).toEqual('57pt');
    });
  });
  describe('convertToPx', () => {
    test('ok', () => {
      expect(convertToPx('16pt')).toEqual(22);
      expect(convertToPx('57pt')).toEqual(76);
      expect(convertToPx('57')).toEqual(57);
      expect(convertToPx('57px')).toEqual(57);
    });
    test('invalid', () => {
      expect(convertToPx('aa')).toEqual(-1);
    });
  });
  describe('parseText', () => {
    test('ok \n', () => {
      expect(parseText('=SUM(1,2)\t2\ntest\ttrue')).toEqual([
        ['=SUM(1,2)', '2'],
        ['test', 'true'],
      ]);
    });
    test('ok \r\n', () => {
      expect(parseText('=SUM(1,2)\t2\r\ntest\ttrue')).toEqual([
        ['=SUM(1,2)', '2'],
        ['test', 'true'],
      ]);
    });
    test('filter empty', () => {
      expect(parseText('\t \n \t ')).toEqual([]);
      expect(parseText('1 \t 2 \n \t ')).toEqual([['1', '2']]);
    });
  });
  describe('makeFont', () => {
    it('should get normal normal 12px sans-serif', () => {
      expect(makeFont()).toEqual('normal normal 12px Source Code Pro,sans-serif');
    });
    it('should get normal normal 12px simsun,sans-serif', () => {
      expect(makeFont('italic', 'bold', 14, 'simsun')).toEqual(
        'italic bold 14px Source Code Pro,simsun,sans-serif',
      );
    });
  });
  describe('convertToCssString', () => {
    test('ok', () => {
      const result: string[] = [
        'color:red',
        'background-color:white',
        'font-size:20pt',
        'font-family:serif',
        'font-style:italic',
        'font-weight:700',
        'white-space:normal',
        'text-decoration-line:underline line-through',
        'text-decoration-style: double',
      ];
      expect(
        convertToCssString({
          fontColor: 'red',
          fillColor: 'white',
          fontFamily: 'serif',
          fontSize: 20,
          isItalic: true,
          isWrapText: true,
          isBold: true,
          underline: EUnderLine.DOUBLE,
          isStrike: true,
          numberFormat: '',
        }),
      ).toEqual(result.join(';') + ';');
    });
    test('only underline', () => {
      const result: string[] = ['text-decoration-line:underline'];
      expect(
        convertToCssString({
          underline: EUnderLine.SINGLE,
        }),
      ).toEqual(result.join(';') + ';');
    });
    test('only strike', () => {
      const result: string[] = ['text-decoration-line:line-through'];
      expect(
        convertToCssString({
          isStrike: true,
        }),
      ).toEqual(result.join(';') + ';');
    });
  });
  describe('parseHTML', () => {
    test('normal', () => {
      const mockHTML = `<html
      xmlns:v="urn:schemas-microsoft-com:vml"
      xmlns:o="urn:schemas-microsoft-com:office:office"
      xmlns:x="urn:schemas-microsoft-com:office:excel"
      xmlns="http://www.w3.org/TR/REC-html40"
    >
      <head>
        <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
        <meta name="ProgId" content="Excel.Sheet" />
        <meta name="Generator" content="Microsoft Excel 15" />
        <style>
          .xl3{
            font-weight: 700;
          }
          .test{ }
          .xl1{color:#738DF2;background-color:#FCE869;font-size:36pt;font-style:italic;font-weight:700;white-space:normal;text-decoration-line:underline line-through;text-decoration-style: double;}
          .xl2{color:#738DF2;background-color:#FCE869;font-style:italic;font-weight:700;white-space:normal;text-decoration-line:underline line-through;text-decoration-style: double;}
          td{
            color:red;
          }
        </style>
      </head>
    
      <body>
        <table>
          <tr>
            <s>a</s>
            <td class="xl3"><i>1</i> </td>
            <td class="xl1"> large text </td>
            <td class="xl2"> This is a very long text that needs to be wrapped </td>
            <td><b>2</b></td>
            <td></td>
          </tr>
        </table>
      </body>
    </html>`;
      const result = parseHTML(mockHTML);
      expect(result).toEqual({
        colMap: new Map(),
        rowMap: new Map(),
        textList: [
          [
            '1',
            'large text',
            'This is a very long text that needs to be wrapped',
            '2',
            '',
          ],
        ],
        styleList: [
          [
            { fontColor: 'red', isBold: true, isItalic: true },
            {
              fillColor: '#FCE869',
              fontColor: '#738DF2',
              fontSize: 36,
              isItalic: true,
              isBold: true,
              isStrike: true,
              isWrapText: true,
              underline: EUnderLine.DOUBLE,
            },
            {
              fillColor: '#FCE869',
              fontColor: '#738DF2',
              isBold: true,
              isItalic: true,
              isStrike: true,
              isWrapText: true,
              underline: EUnderLine.DOUBLE,
            },
            {
              fontColor: 'red',
              isBold: true,
            },
            {
              fontColor: 'red',
            },
          ],
        ],
      });
    });
    test('wps', () => {
      const mockHTML = `<html xmlns:v="urn:schemas-microsoft-com:vml" xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40">
      <head>
      <meta http-equiv=Content-Type content="text/html; charset=utf-8">
      <meta name=Generator content="Microsoft Excel">
      <!--[if !mso]>
      <style>
      v:* {behavior:url(#default#VML);}
      o:* {behavior:url(#default#VML);}
      x:* {behavior:url(#default#VML);}
      .shape {behavior:url(#default#VML);}
      </style>
      <![endif]-->
      <style>
      <!--.font0
        {color:#000000;
        font-size:11.0pt;
        font-family:Calibri;
        font-weight:400;
        font-style:normal;
        text-decoration:none;}
      .font1
        {color:#000000;
        font-size:11.0pt;
        font-family:Calibri;
        font-weight:700;
        font-style:italic;
        text-decoration:none;}
      .font2
        {color:#E54C5E;
        font-size:11.0pt;
        font-family:Calibri;
        font-weight:400;
        font-style:italic;
        text-decoration:underline;
        text-underline-style:single;}
      .font3
        {color:#000000;
        font-size:24.0pt;
        font-family:Monaco;
        font-weight:400;
        font-style:normal;
        text-decoration:none;}
      br
        {mso-data-placement:same-cell;}
      td
        {padding-top:1px;
        padding-left:1px;
        padding-right:1px;
        mso-ignore:padding;
        color:#000000;
        font-size:11.0pt;
        font-weight:400;
        font-style:normal;
        text-decoration:none;
        font-family:Calibri;
        mso-generic-font-family:auto;
        mso-font-charset:134;
        mso-number-format:General;
        border:none;
        mso-background-source:auto;
        mso-pattern:auto;
        text-align:general;
        vertical-align:middle;
        white-space:nowrap;
        mso-rotate:0;
        mso-protection:locked visible;}
      .et2
        {font-weight:700;
        font-style:italic;
        mso-generic-font-family:auto;
        mso-font-charset:134;}
      .et3
        {color:#E54C5E;
        font-style:italic;
        text-decoration:underline;
        text-underline-style:single;
        mso-generic-font-family:auto;
        mso-font-charset:134;
        background:#D0CECE;
        mso-pattern:auto none;}
      .et4
        {font-size:24.0pt;
        font-family:Monaco;
        mso-generic-font-family:auto;
        mso-font-charset:134;
        text-align:right;
        vertical-align:top;}
      -->
      </style>
      </head>
      <body>
      <!--StartFragment-->
      <table border=0 cellpadding=0 cellspacing=0 width=172 height=51 style='border-collapse:collapse;width:172.03pt;'>
       <col width=57 style='width:57.60pt;' span=3>
       <tr height=16 style='height:16.80pt;'>
        <td class=et2 height=16 width=57 x:num="1" align=right style='height:16.80pt;width:57.60pt;'><u>1</u></td>
        <td class=et3 width=57 align=right style='width:57.60pt;'><s>2</s></td>
       </tr>
       <tr height=34 style='height:34.40pt;'>
        <td height=34 x:str style='height:34.40pt;'>test</td>
        <td class=et4 x:num="4">4</td>
       </tr>
      </table>
      <!--EndFragment-->
      </body>
      
      </html>`;
      const result = parseHTML(mockHTML);
      expect(result).toEqual({
        colMap: new Map([
          [0, 76],
          [1, 76],
        ]),
        rowMap: new Map([
          [0, 22],
          [1, 46],
        ]),
        textList: [
          ['1', '2'],
          ['test', '4'],
        ],
        styleList: [
          [
            {
              fontColor: '#000000',
              fontFamily: 'Calibri',
              fontSize: 11,
              isBold: true,
              isItalic: true,
              underline: EUnderLine.SINGLE,
            },
            {
              fontColor: '#E54C5E',
              fontFamily: 'Calibri',
              fontSize: 11,
              isItalic: true,
              isStrike: true,
            },
          ],
          [
            {
              fontColor: '#000000',
              fontFamily: 'Calibri',
              fontSize: 11,
            },
            {
              fontColor: '#000000',
              fontFamily: 'Monaco',
              fontSize: 24,
            },
          ],
        ],
      });
    });
  });
});
