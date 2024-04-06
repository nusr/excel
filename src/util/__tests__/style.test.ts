import { makeFont, convertToCssString, parseHTML } from '../style';
import { EUnderLine } from '@/types';

describe('style.test.ts', () => {
  describe('makeFont', () => {
    it('should get normal normal 12px sans-serif', () => {
      expect(makeFont()).toEqual('normal normal 12px sans-serif');
    });
    it('should get normal normal 12px simsun,sans-serif', () => {
      expect(makeFont('italic', 'bold', 14, 'simsun')).toEqual(
        'italic bold 14px simsun,sans-serif',
      );
    });
  });
  describe('convertToCssString', () => {
    it('normal', () => {
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
          numberFormat: 1,
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
            <td> 1 </td>
            <td class="xl1"> large text </td>
            <td class="xl2"> This is a very long text that needs to be wrapped </td>
          </tr>
        </table>
      </body>
    </html>`;
      const result = parseHTML(mockHTML);
      expect(result).toEqual({
        textList: [
          [
            1,
            'large text',
            'This is a very long text that needs to be wrapped',
          ],
        ],
        styleList: [
          [
            { fontColor: 'red' },
            {
              fillColor: '#FCE869',
              fontColor: '#738DF2',
              fontSize: 36,
              isItalic: true,
              isStrike: true,
              isWrapText: true,
              underline: EUnderLine.DOUBLE,
            },
            {
              fillColor: '#FCE869',
              fontColor: '#738DF2',
              isItalic: true,
              isStrike: true,
              isWrapText: true,
              underline: EUnderLine.DOUBLE,
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
      v\:* {behavior:url(#default#VML);}
      o\:* {behavior:url(#default#VML);}
      x\:* {behavior:url(#default#VML);}
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
        textList: [
          [1, 2],
          ['test', 4],
        ],
        styleList: [
          [
            {
              fontColor: '#000000',
              fontFamily: 'Calibri',
              fontSize: 11,
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
