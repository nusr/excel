export interface StyleData {
  cellXfs: string[];
  numFmts: string[];
  fonts: string[];
  fills: string[];
}

export function getCoreXML() {
  const createDate = new Date().toLocaleDateString('zh').replaceAll('/', '-');
  const createTime = new Date().toLocaleTimeString('zh');
  return `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>\r\n<cp:coreProperties xmlns:cp="http://schemas.openxmlformats.org/package/2006/metadata/core-properties"
  xmlns:dc="http://purl.org/dc/elements/1.1/"
  xmlns:dcterms="http://purl.org/dc/terms/"
  xmlns:dcmitype="http://purl.org/dc/dcmitype/"
  xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">
  <dc:creator>Steve Xu</dc:creator>
  <cp:lastModifiedBy>Steve Xu</cp:lastModifiedBy>
  <dcterms:created xsi:type="dcterms:W3CDTF">${createDate}T${createTime}Z</dcterms:created>
  <dcterms:modified xsi:type="dcterms:W3CDTF">${createDate}T${createTime}Z</dcterms:modified>
</cp:coreProperties>`;
}

export function generateStyleFile(styles: StyleData) {
  const result = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
  <styleSheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main"
    xmlns:xr9="http://schemas.microsoft.com/office/spreadsheetml/2016/revision9">
    <numFmts count="${styles.numFmts.length}">
    ${styles.numFmts.join('\n')}
    </numFmts>
    <fonts count="${styles.fonts.length}">
    ${styles.fonts.join('\n')}
    </fonts>
    <fills count="${styles.fills.length}">
    ${styles.fills.join('\n')}
    </fills>
    <borders count="9">
      <border>
        <left/>
        <right/>
        <top/>
        <bottom/>
        <diagonal/>
      </border>
      <border>
        <left style="thin">
          <color rgb="FFB2B2B2"/>
        </left>
        <right style="thin">
          <color rgb="FFB2B2B2"/>
        </right>
        <top style="thin">
          <color rgb="FFB2B2B2"/>
        </top>
        <bottom style="thin">
          <color rgb="FFB2B2B2"/>
        </bottom>
        <diagonal/>
      </border>
      <border>
        <left/>
        <right/>
        <top/>
        <bottom style="medium">
          <color theme="4"/>
        </bottom>
        <diagonal/>
      </border>
      <border>
        <left/>
        <right/>
        <top/>
        <bottom style="medium">
          <color theme="4" tint="0.499984740745262"/>
        </bottom>
        <diagonal/>
      </border>
      <border>
        <left style="thin">
          <color rgb="FF7F7F7F"/>
        </left>
        <right style="thin">
          <color rgb="FF7F7F7F"/>
        </right>
        <top style="thin">
          <color rgb="FF7F7F7F"/>
        </top>
        <bottom style="thin">
          <color rgb="FF7F7F7F"/>
        </bottom>
        <diagonal/>
      </border>
      <border>
        <left style="thin">
          <color rgb="FF3F3F3F"/>
        </left>
        <right style="thin">
          <color rgb="FF3F3F3F"/>
        </right>
        <top style="thin">
          <color rgb="FF3F3F3F"/>
        </top>
        <bottom style="thin">
          <color rgb="FF3F3F3F"/>
        </bottom>
        <diagonal/>
      </border>
      <border>
        <left style="double">
          <color rgb="FF3F3F3F"/>
        </left>
        <right style="double">
          <color rgb="FF3F3F3F"/>
        </right>
        <top style="double">
          <color rgb="FF3F3F3F"/>
        </top>
        <bottom style="double">
          <color rgb="FF3F3F3F"/>
        </bottom>
        <diagonal/>
      </border>
      <border>
        <left/>
        <right/>
        <top/>
        <bottom style="double">
          <color rgb="FFFF8001"/>
        </bottom>
        <diagonal/>
      </border>
      <border>
        <left/>
        <right/>
        <top style="thin">
          <color theme="4"/>
        </top>
        <bottom style="double">
          <color theme="4"/>
        </bottom>
        <diagonal/>
      </border>
    </borders>
    <cellStyleXfs count="49">
      <xf numFmtId="0" fontId="0" fillId="0" borderId="0">
        <alignment vertical="center"/>
      </xf>
      <xf numFmtId="43" fontId="0" fillId="0" borderId="0" applyFont="0" applyFill="0" applyBorder="0" applyAlignment="0" applyProtection="0">
        <alignment vertical="center"/>
      </xf>
      <xf numFmtId="44" fontId="0" fillId="0" borderId="0" applyFont="0" applyFill="0" applyBorder="0" applyAlignment="0" applyProtection="0">
        <alignment vertical="center"/>
      </xf>
      <xf numFmtId="9" fontId="0" fillId="0" borderId="0" applyFont="0" applyFill="0" applyBorder="0" applyAlignment="0" applyProtection="0">
        <alignment vertical="center"/>
      </xf>
      <xf numFmtId="41" fontId="0" fillId="0" borderId="0" applyFont="0" applyFill="0" applyBorder="0" applyAlignment="0" applyProtection="0">
        <alignment vertical="center"/>
      </xf>
      <xf numFmtId="42" fontId="0" fillId="0" borderId="0" applyFont="0" applyFill="0" applyBorder="0" applyAlignment="0" applyProtection="0">
        <alignment vertical="center"/>
      </xf>
      <xf numFmtId="0" fontId="1" fillId="0" borderId="0" applyNumberFormat="0" applyFill="0" applyBorder="0" applyAlignment="0" applyProtection="0">
        <alignment vertical="center"/>
      </xf>
      <xf numFmtId="0" fontId="2" fillId="0" borderId="0" applyNumberFormat="0" applyFill="0" applyBorder="0" applyAlignment="0" applyProtection="0">
        <alignment vertical="center"/>
      </xf>
      <xf numFmtId="0" fontId="0" fillId="2" borderId="1" applyNumberFormat="0" applyFont="0" applyAlignment="0" applyProtection="0">
        <alignment vertical="center"/>
      </xf>
      <xf numFmtId="0" fontId="3" fillId="0" borderId="0" applyNumberFormat="0" applyFill="0" applyBorder="0" applyAlignment="0" applyProtection="0">
        <alignment vertical="center"/>
      </xf>
      <xf numFmtId="0" fontId="4" fillId="0" borderId="0" applyNumberFormat="0" applyFill="0" applyBorder="0" applyAlignment="0" applyProtection="0">
        <alignment vertical="center"/>
      </xf>
      <xf numFmtId="0" fontId="5" fillId="0" borderId="0" applyNumberFormat="0" applyFill="0" applyBorder="0" applyAlignment="0" applyProtection="0">
        <alignment vertical="center"/>
      </xf>
      <xf numFmtId="0" fontId="6" fillId="0" borderId="2" applyNumberFormat="0" applyFill="0" applyAlignment="0" applyProtection="0">
        <alignment vertical="center"/>
      </xf>
      <xf numFmtId="0" fontId="7" fillId="0" borderId="2" applyNumberFormat="0" applyFill="0" applyAlignment="0" applyProtection="0">
        <alignment vertical="center"/>
      </xf>
      <xf numFmtId="0" fontId="8" fillId="0" borderId="3" applyNumberFormat="0" applyFill="0" applyAlignment="0" applyProtection="0">
        <alignment vertical="center"/>
      </xf>
      <xf numFmtId="0" fontId="8" fillId="0" borderId="0" applyNumberFormat="0" applyFill="0" applyBorder="0" applyAlignment="0" applyProtection="0">
        <alignment vertical="center"/>
      </xf>
      <xf numFmtId="0" fontId="9" fillId="3" borderId="4" applyNumberFormat="0" applyAlignment="0" applyProtection="0">
        <alignment vertical="center"/>
      </xf>
      <xf numFmtId="0" fontId="10" fillId="4" borderId="5" applyNumberFormat="0" applyAlignment="0" applyProtection="0">
        <alignment vertical="center"/>
      </xf>
      <xf numFmtId="0" fontId="11" fillId="4" borderId="4" applyNumberFormat="0" applyAlignment="0" applyProtection="0">
        <alignment vertical="center"/>
      </xf>
      <xf numFmtId="0" fontId="12" fillId="5" borderId="6" applyNumberFormat="0" applyAlignment="0" applyProtection="0">
        <alignment vertical="center"/>
      </xf>
      <xf numFmtId="0" fontId="13" fillId="0" borderId="7" applyNumberFormat="0" applyFill="0" applyAlignment="0" applyProtection="0">
        <alignment vertical="center"/>
      </xf>
      <xf numFmtId="0" fontId="14" fillId="0" borderId="8" applyNumberFormat="0" applyFill="0" applyAlignment="0" applyProtection="0">
        <alignment vertical="center"/>
      </xf>
      <xf numFmtId="0" fontId="15" fillId="6" borderId="0" applyNumberFormat="0" applyBorder="0" applyAlignment="0" applyProtection="0">
        <alignment vertical="center"/>
      </xf>
      <xf numFmtId="0" fontId="16" fillId="7" borderId="0" applyNumberFormat="0" applyBorder="0" applyAlignment="0" applyProtection="0">
        <alignment vertical="center"/>
      </xf>
      <xf numFmtId="0" fontId="17" fillId="8" borderId="0" applyNumberFormat="0" applyBorder="0" applyAlignment="0" applyProtection="0">
        <alignment vertical="center"/>
      </xf>
      <xf numFmtId="0" fontId="18" fillId="9" borderId="0" applyNumberFormat="0" applyBorder="0" applyAlignment="0" applyProtection="0">
        <alignment vertical="center"/>
      </xf>
      <xf numFmtId="0" fontId="19" fillId="10" borderId="0" applyNumberFormat="0" applyBorder="0" applyAlignment="0" applyProtection="0">
        <alignment vertical="center"/>
      </xf>
      <xf numFmtId="0" fontId="19" fillId="11" borderId="0" applyNumberFormat="0" applyBorder="0" applyAlignment="0" applyProtection="0">
        <alignment vertical="center"/>
      </xf>
      <xf numFmtId="0" fontId="18" fillId="12" borderId="0" applyNumberFormat="0" applyBorder="0" applyAlignment="0" applyProtection="0">
        <alignment vertical="center"/>
      </xf>
      <xf numFmtId="0" fontId="18" fillId="13" borderId="0" applyNumberFormat="0" applyBorder="0" applyAlignment="0" applyProtection="0">
        <alignment vertical="center"/>
      </xf>
      <xf numFmtId="0" fontId="19" fillId="14" borderId="0" applyNumberFormat="0" applyBorder="0" applyAlignment="0" applyProtection="0">
        <alignment vertical="center"/>
      </xf>
      <xf numFmtId="0" fontId="19" fillId="15" borderId="0" applyNumberFormat="0" applyBorder="0" applyAlignment="0" applyProtection="0">
        <alignment vertical="center"/>
      </xf>
      <xf numFmtId="0" fontId="18" fillId="16" borderId="0" applyNumberFormat="0" applyBorder="0" applyAlignment="0" applyProtection="0">
        <alignment vertical="center"/>
      </xf>
      <xf numFmtId="0" fontId="18" fillId="17" borderId="0" applyNumberFormat="0" applyBorder="0" applyAlignment="0" applyProtection="0">
        <alignment vertical="center"/>
      </xf>
      <xf numFmtId="0" fontId="19" fillId="18" borderId="0" applyNumberFormat="0" applyBorder="0" applyAlignment="0" applyProtection="0">
        <alignment vertical="center"/>
      </xf>
      <xf numFmtId="0" fontId="19" fillId="19" borderId="0" applyNumberFormat="0" applyBorder="0" applyAlignment="0" applyProtection="0">
        <alignment vertical="center"/>
      </xf>
      <xf numFmtId="0" fontId="18" fillId="20" borderId="0" applyNumberFormat="0" applyBorder="0" applyAlignment="0" applyProtection="0">
        <alignment vertical="center"/>
      </xf>
      <xf numFmtId="0" fontId="18" fillId="21" borderId="0" applyNumberFormat="0" applyBorder="0" applyAlignment="0" applyProtection="0">
        <alignment vertical="center"/>
      </xf>
      <xf numFmtId="0" fontId="19" fillId="22" borderId="0" applyNumberFormat="0" applyBorder="0" applyAlignment="0" applyProtection="0">
        <alignment vertical="center"/>
      </xf>
      <xf numFmtId="0" fontId="19" fillId="23" borderId="0" applyNumberFormat="0" applyBorder="0" applyAlignment="0" applyProtection="0">
        <alignment vertical="center"/>
      </xf>
      <xf numFmtId="0" fontId="18" fillId="24" borderId="0" applyNumberFormat="0" applyBorder="0" applyAlignment="0" applyProtection="0">
        <alignment vertical="center"/>
      </xf>
      <xf numFmtId="0" fontId="18" fillId="25" borderId="0" applyNumberFormat="0" applyBorder="0" applyAlignment="0" applyProtection="0">
        <alignment vertical="center"/>
      </xf>
      <xf numFmtId="0" fontId="19" fillId="26" borderId="0" applyNumberFormat="0" applyBorder="0" applyAlignment="0" applyProtection="0">
        <alignment vertical="center"/>
      </xf>
      <xf numFmtId="0" fontId="19" fillId="27" borderId="0" applyNumberFormat="0" applyBorder="0" applyAlignment="0" applyProtection="0">
        <alignment vertical="center"/>
      </xf>
      <xf numFmtId="0" fontId="18" fillId="28" borderId="0" applyNumberFormat="0" applyBorder="0" applyAlignment="0" applyProtection="0">
        <alignment vertical="center"/>
      </xf>
      <xf numFmtId="0" fontId="18" fillId="29" borderId="0" applyNumberFormat="0" applyBorder="0" applyAlignment="0" applyProtection="0">
        <alignment vertical="center"/>
      </xf>
      <xf numFmtId="0" fontId="19" fillId="30" borderId="0" applyNumberFormat="0" applyBorder="0" applyAlignment="0" applyProtection="0">
        <alignment vertical="center"/>
      </xf>
      <xf numFmtId="0" fontId="19" fillId="31" borderId="0" applyNumberFormat="0" applyBorder="0" applyAlignment="0" applyProtection="0">
        <alignment vertical="center"/>
      </xf>
      <xf numFmtId="0" fontId="18" fillId="32" borderId="0" applyNumberFormat="0" applyBorder="0" applyAlignment="0" applyProtection="0">
        <alignment vertical="center"/>
      </xf>
    </cellStyleXfs>
    <cellXfs count="${styles.cellXfs.length}">
    ${styles.cellXfs.join('\n')}
    </cellXfs>
    <cellStyles count="49">
      <cellStyle name="Normal" xfId="0" builtinId="0"/>
      <cellStyle name="Comma" xfId="1" builtinId="3"/>
      <cellStyle name="Currency" xfId="2" builtinId="4"/>
      <cellStyle name="Percent" xfId="3" builtinId="5"/>
      <cellStyle name="Comma [0]" xfId="4" builtinId="6"/>
      <cellStyle name="Currency [0]" xfId="5" builtinId="7"/>
      <cellStyle name="Hyperlink" xfId="6" builtinId="8"/>
      <cellStyle name="Followed Hyperlink" xfId="7" builtinId="9"/>
      <cellStyle name="Note" xfId="8" builtinId="10"/>
      <cellStyle name="Warning Text" xfId="9" builtinId="11"/>
      <cellStyle name="Title" xfId="10" builtinId="15"/>
      <cellStyle name="CExplanatory Text" xfId="11" builtinId="53"/>
      <cellStyle name="Heading 1" xfId="12" builtinId="16"/>
      <cellStyle name="Heading 2" xfId="13" builtinId="17"/>
      <cellStyle name="Heading 3" xfId="14" builtinId="18"/>
      <cellStyle name="Heading 4" xfId="15" builtinId="19"/>
      <cellStyle name="Input" xfId="16" builtinId="20"/>
      <cellStyle name="Output" xfId="17" builtinId="21"/>
      <cellStyle name="Calculation" xfId="18" builtinId="22"/>
      <cellStyle name="Check Cell" xfId="19" builtinId="23"/>
      <cellStyle name="Linked Cell" xfId="20" builtinId="24"/>
      <cellStyle name="Total" xfId="21" builtinId="25"/>
      <cellStyle name="Good" xfId="22" builtinId="26"/>
      <cellStyle name="Bad" xfId="23" builtinId="27"/>
      <cellStyle name="Neutral" xfId="24" builtinId="28"/>
      <cellStyle name="Accent1" xfId="25" builtinId="29"/>
      <cellStyle name="20% - Accent1" xfId="26" builtinId="30"/>
      <cellStyle name="40% - Accent1" xfId="27" builtinId="31"/>
      <cellStyle name="60% - Accent1" xfId="28" builtinId="32"/>
      <cellStyle name="Accent2" xfId="29" builtinId="33"/>
      <cellStyle name="20% - Accent2" xfId="30" builtinId="34"/>
      <cellStyle name="40% - Accent2" xfId="31" builtinId="35"/>
      <cellStyle name="60% - Accent2" xfId="32" builtinId="36"/>
      <cellStyle name="Accent3" xfId="33" builtinId="37"/>
      <cellStyle name="20% - Accent3" xfId="34" builtinId="38"/>
      <cellStyle name="40% - Accent3" xfId="35" builtinId="39"/>
      <cellStyle name="60% - Accent3" xfId="36" builtinId="40"/>
      <cellStyle name="Accent4" xfId="37" builtinId="41"/>
      <cellStyle name="20% - Accent4" xfId="38" builtinId="42"/>
      <cellStyle name="40% - Accent4" xfId="39" builtinId="43"/>
      <cellStyle name="60% - Accent4" xfId="40" builtinId="44"/>
      <cellStyle name="Accent5" xfId="41" builtinId="45"/>
      <cellStyle name="20% - Accent5" xfId="42" builtinId="46"/>
      <cellStyle name="40% - Accent5" xfId="43" builtinId="47"/>
      <cellStyle name="60% - Accent5" xfId="44" builtinId="48"/>
      <cellStyle name="Accent6" xfId="45" builtinId="49"/>
      <cellStyle name="20% - Accent6" xfId="46" builtinId="50"/>
      <cellStyle name="40% - Accent6" xfId="47" builtinId="51"/>
      <cellStyle name="60% - Accent6" xfId="48" builtinId="52"/>
    </cellStyles>
    <dxfs count="17">
      <dxf>
        <fill>
          <patternFill patternType="solid">
            <fgColor theme="4" tint="0.799981688894314"/>
            <bgColor theme="4" tint="0.799981688894314"/>
          </patternFill>
        </fill>
      </dxf>
      <dxf>
        <fill>
          <patternFill patternType="solid">
            <fgColor theme="4" tint="0.799981688894314"/>
            <bgColor theme="4" tint="0.799981688894314"/>
          </patternFill>
        </fill>
      </dxf>
      <dxf>
        <font>
          <b val="1"/>
          <color theme="1"/>
        </font>
      </dxf>
      <dxf>
        <font>
          <b val="1"/>
          <color theme="1"/>
        </font>
      </dxf>
      <dxf>
        <font>
          <b val="1"/>
          <color theme="1"/>
        </font>
        <border>
          <top style="double">
            <color theme="4"/>
          </top>
        </border>
      </dxf>
      <dxf>
        <font>
          <b val="1"/>
          <color theme="0"/>
        </font>
        <fill>
          <patternFill patternType="solid">
            <fgColor theme="4"/>
            <bgColor theme="4"/>
          </patternFill>
        </fill>
      </dxf>
      <dxf>
        <font>
          <color theme="1"/>
        </font>
        <border>
          <left style="thin">
            <color theme="4"/>
          </left>
          <right style="thin">
            <color theme="4"/>
          </right>
          <top style="thin">
            <color theme="4"/>
          </top>
          <bottom style="thin">
            <color theme="4"/>
          </bottom>
          <horizontal style="thin">
            <color theme="4" tint="0.399975585192419"/>
          </horizontal>
        </border>
      </dxf>
      <dxf>
        <fill>
          <patternFill patternType="solid">
            <fgColor theme="4" tint="0.799981688894314"/>
            <bgColor theme="4" tint="0.799981688894314"/>
          </patternFill>
        </fill>
        <border>
          <bottom style="thin">
            <color theme="4" tint="0.399975585192419"/>
          </bottom>
        </border>
      </dxf>
      <dxf>
        <font>
          <b val="1"/>
        </font>
        <fill>
          <patternFill patternType="solid">
            <fgColor theme="4" tint="0.799981688894314"/>
            <bgColor theme="4" tint="0.799981688894314"/>
          </patternFill>
        </fill>
        <border>
          <bottom style="thin">
            <color theme="4" tint="0.399975585192419"/>
          </bottom>
        </border>
      </dxf>
      <dxf>
        <font>
          <color theme="1"/>
        </font>
      </dxf>
      <dxf>
        <font>
          <color theme="1"/>
        </font>
        <border>
          <bottom style="thin">
            <color theme="4" tint="0.399975585192419"/>
          </bottom>
        </border>
      </dxf>
      <dxf>
        <font>
          <b val="1"/>
          <color theme="1"/>
        </font>
      </dxf>
      <dxf>
        <font>
          <b val="1"/>
          <color theme="1"/>
        </font>
        <border>
          <top style="thin">
            <color theme="4"/>
          </top>
          <bottom style="thin">
            <color theme="4"/>
          </bottom>
        </border>
      </dxf>
      <dxf>
        <fill>
          <patternFill patternType="solid">
            <fgColor theme="4" tint="0.799981688894314"/>
            <bgColor theme="4" tint="0.799981688894314"/>
          </patternFill>
        </fill>
      </dxf>
      <dxf>
        <fill>
          <patternFill patternType="solid">
            <fgColor theme="4" tint="0.799981688894314"/>
            <bgColor theme="4" tint="0.799981688894314"/>
          </patternFill>
        </fill>
      </dxf>
      <dxf>
        <font>
          <b val="1"/>
          <color theme="1"/>
        </font>
        <fill>
          <patternFill patternType="solid">
            <fgColor theme="4" tint="0.799981688894314"/>
            <bgColor theme="4" tint="0.799981688894314"/>
          </patternFill>
        </fill>
        <border>
          <top style="thin">
            <color theme="4" tint="0.399975585192419"/>
          </top>
          <bottom style="thin">
            <color theme="4" tint="0.399975585192419"/>
          </bottom>
        </border>
      </dxf>
      <dxf>
        <font>
          <b val="1"/>
          <color theme="1"/>
        </font>
        <fill>
          <patternFill patternType="solid">
            <fgColor theme="4" tint="0.799981688894314"/>
            <bgColor theme="4" tint="0.799981688894314"/>
          </patternFill>
        </fill>
        <border>
          <bottom style="thin">
            <color theme="4" tint="0.399975585192419"/>
          </bottom>
        </border>
      </dxf>
    </dxfs>
    <tableStyles count="2" defaultTableStyle="TableStylePreset3_Accent1" defaultPivotStyle="PivotStylePreset2_Accent1">
      <tableStyle name="TableStylePreset3_Accent1" pivot="0" count="7" xr9:uid="{59DB682C-5494-4EDE-A608-00C9E5F0F923}">
        <tableStyleElement type="wholeTable" dxfId="6"/>
        <tableStyleElement type="headerRow" dxfId="5"/>
        <tableStyleElement type="totalRow" dxfId="4"/>
        <tableStyleElement type="firstColumn" dxfId="3"/>
        <tableStyleElement type="lastColumn" dxfId="2"/>
        <tableStyleElement type="firstRowStripe" dxfId="1"/>
        <tableStyleElement type="firstColumnStripe" dxfId="0"/>
      </tableStyle>
      <tableStyle name="PivotStylePreset2_Accent1" table="0" count="10" xr9:uid="{267968C8-6FFD-4C36-ACC1-9EA1FD1885CA}">
        <tableStyleElement type="headerRow" dxfId="16"/>
        <tableStyleElement type="totalRow" dxfId="15"/>
        <tableStyleElement type="firstRowStripe" dxfId="14"/>
        <tableStyleElement type="firstColumnStripe" dxfId="13"/>
        <tableStyleElement type="firstSubtotalRow" dxfId="12"/>
        <tableStyleElement type="secondSubtotalRow" dxfId="11"/>
        <tableStyleElement type="firstRowSubheading" dxfId="10"/>
        <tableStyleElement type="secondRowSubheading" dxfId="9"/>
        <tableStyleElement type="pageFieldLabels" dxfId="8"/>
        <tableStyleElement type="pageFieldValues" dxfId="7"/>
      </tableStyle>
    </tableStyles>
    <extLst>
      <ext uri="{EB79DEF2-80B8-43e5-95BD-54CBDDF9020C}"
        xmlns:x14="http://schemas.microsoft.com/office/spreadsheetml/2009/9/main">
        <x14:slicerStyles defaultSlicerStyle="SlicerStyleLight1"/>
      </ext>
    </extLst>
  </styleSheet>`;
  return result;
}
export const getContentTypeXml = (extra: string) => {
  return `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>\r\n<Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types">
            <Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/>
            <Default Extension="xml" ContentType="application/xml"/>
            <Override PartName="/docProps/app.xml" ContentType="application/vnd.openxmlformats-officedocument.extended-properties+xml"/>
            <Override PartName="/docProps/core.xml" ContentType="application/vnd.openxmlformats-package.core-properties+xml"/>
            <Override PartName="/docProps/custom.xml" ContentType="application/vnd.openxmlformats-officedocument.custom-properties+xml"/>
            <Override PartName="/xl/styles.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.styles+xml"/>
            <Override PartName="/xl/theme/theme1.xml" ContentType="application/vnd.openxmlformats-officedocument.theme+xml"/>
            <Override PartName="/xl/workbook.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet.main+xml"/>
            ${extra}
          </Types>`;
};
export const REFS = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>\r\n<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">
<Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="xl/workbook.xml"/>
<Relationship Id="rId3" Type="http://schemas.openxmlformats.org/package/2006/relationships/metadata/core-properties" Target="docProps/core.xml"/>
<Relationship Id="rId2" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/extended-properties" Target="docProps/app.xml"/>
<Relationship Id="rId4" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/custom-properties" Target="docProps/custom.xml"/>
</Relationships>`;
export const THEME1_XML = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>\r\n<a:theme xmlns:a="http://schemas.openxmlformats.org/drawingml/2006/main" name="WPS">
  <a:themeElements>
    <a:clrScheme name="WPS">
      <a:dk1>
        <a:sysClr val="windowText" lastClr="000000"/>
      </a:dk1>
      <a:lt1>
        <a:sysClr val="window" lastClr="FFFFFF"/>
      </a:lt1>
      <a:dk2>
        <a:srgbClr val="44546A"/>
      </a:dk2>
      <a:lt2>
        <a:srgbClr val="E7E6E6"/>
      </a:lt2>
      <a:accent1>
        <a:srgbClr val="4874CB"/>
      </a:accent1>
      <a:accent2>
        <a:srgbClr val="EE822F"/>
      </a:accent2>
      <a:accent3>
        <a:srgbClr val="F2BA02"/>
      </a:accent3>
      <a:accent4>
        <a:srgbClr val="75BD42"/>
      </a:accent4>
      <a:accent5>
        <a:srgbClr val="30C0B4"/>
      </a:accent5>
      <a:accent6>
        <a:srgbClr val="E54C5E"/>
      </a:accent6>
      <a:hlink>
        <a:srgbClr val="0026E5"/>
      </a:hlink>
      <a:folHlink>
        <a:srgbClr val="7E1FAD"/>
      </a:folHlink>
    </a:clrScheme>
    <a:fontScheme name="WPS">
      <a:majorFont>
        <a:latin typeface="Calibri Light"/>
        <a:ea typeface=""/>
        <a:cs typeface=""/>
        <a:font script="Jpan" typeface="ＭＳ Ｐゴシック"/>
        <a:font script="Hang" typeface="맑은 고딕"/>
        <a:font script="Hans" typeface="宋体"/>
        <a:font script="Hant" typeface="新細明體"/>
        <a:font script="Arab" typeface="Times New Roman"/>
        <a:font script="Hebr" typeface="Times New Roman"/>
        <a:font script="Thai" typeface="Tahoma"/>
        <a:font script="Ethi" typeface="Nyala"/>
        <a:font script="Beng" typeface="Vrinda"/>
        <a:font script="Gujr" typeface="Shruti"/>
        <a:font script="Khmr" typeface="MoolBoran"/>
        <a:font script="Knda" typeface="Tunga"/>
        <a:font script="Guru" typeface="Raavi"/>
        <a:font script="Cans" typeface="Euphemia"/>
        <a:font script="Cher" typeface="Plantagenet Cherokee"/>
        <a:font script="Yiii" typeface="Microsoft Yi Baiti"/>
        <a:font script="Tibt" typeface="Microsoft Himalaya"/>
        <a:font script="Thaa" typeface="MV Boli"/>
        <a:font script="Deva" typeface="Mangal"/>
        <a:font script="Telu" typeface="Gautami"/>
        <a:font script="Taml" typeface="Latha"/>
        <a:font script="Syrc" typeface="Estrangelo Edessa"/>
        <a:font script="Orya" typeface="Kalinga"/>
        <a:font script="Mlym" typeface="Kartika"/>
        <a:font script="Laoo" typeface="DokChampa"/>
        <a:font script="Sinh" typeface="Iskoola Pota"/>
        <a:font script="Mong" typeface="Mongolian Baiti"/>
        <a:font script="Viet" typeface="Times New Roman"/>
        <a:font script="Uigh" typeface="Microsoft Uighur"/>
        <a:font script="Geor" typeface="Sylfaen"/>
      </a:majorFont>
      <a:minorFont>
        <a:latin typeface="Calibri"/>
        <a:ea typeface=""/>
        <a:cs typeface=""/>
        <a:font script="Jpan" typeface="ＭＳ Ｐゴシック"/>
        <a:font script="Hang" typeface="맑은 고딕"/>
        <a:font script="Hans" typeface="宋体"/>
        <a:font script="Hant" typeface="新細明體"/>
        <a:font script="Arab" typeface="Arial"/>
        <a:font script="Hebr" typeface="Arial"/>
        <a:font script="Thai" typeface="Tahoma"/>
        <a:font script="Ethi" typeface="Nyala"/>
        <a:font script="Beng" typeface="Vrinda"/>
        <a:font script="Gujr" typeface="Shruti"/>
        <a:font script="Khmr" typeface="DaunPenh"/>
        <a:font script="Knda" typeface="Tunga"/>
        <a:font script="Guru" typeface="Raavi"/>
        <a:font script="Cans" typeface="Euphemia"/>
        <a:font script="Cher" typeface="Plantagenet Cherokee"/>
        <a:font script="Yiii" typeface="Microsoft Yi Baiti"/>
        <a:font script="Tibt" typeface="Microsoft Himalaya"/>
        <a:font script="Thaa" typeface="MV Boli"/>
        <a:font script="Deva" typeface="Mangal"/>
        <a:font script="Telu" typeface="Gautami"/>
        <a:font script="Taml" typeface="Latha"/>
        <a:font script="Syrc" typeface="Estrangelo Edessa"/>
        <a:font script="Orya" typeface="Kalinga"/>
        <a:font script="Mlym" typeface="Kartika"/>
        <a:font script="Laoo" typeface="DokChampa"/>
        <a:font script="Sinh" typeface="Iskoola Pota"/>
        <a:font script="Mong" typeface="Mongolian Baiti"/>
        <a:font script="Viet" typeface="Arial"/>
        <a:font script="Uigh" typeface="Microsoft Uighur"/>
        <a:font script="Geor" typeface="Sylfaen"/>
      </a:minorFont>
    </a:fontScheme>
    <a:fmtScheme name="WPS">
      <a:fillStyleLst>
        <a:solidFill>
          <a:schemeClr val="phClr"/>
        </a:solidFill>
        <a:gradFill>
          <a:gsLst>
            <a:gs pos="0">
              <a:schemeClr val="phClr">
                <a:lumOff val="17500"/>
              </a:schemeClr>
            </a:gs>
            <a:gs pos="100000">
              <a:schemeClr val="phClr"/>
            </a:gs>
          </a:gsLst>
          <a:lin ang="2700000" scaled="0"/>
        </a:gradFill>
        <a:gradFill>
          <a:gsLst>
            <a:gs pos="0">
              <a:schemeClr val="phClr">
                <a:hueOff val="-2520000"/>
              </a:schemeClr>
            </a:gs>
            <a:gs pos="100000">
              <a:schemeClr val="phClr"/>
            </a:gs>
          </a:gsLst>
          <a:lin ang="2700000" scaled="0"/>
        </a:gradFill>
      </a:fillStyleLst>
      <a:lnStyleLst>
        <a:ln w="12700" cap="flat" cmpd="sng" algn="ctr">
          <a:solidFill>
            <a:schemeClr val="phClr"/>
          </a:solidFill>
          <a:prstDash val="solid"/>
          <a:miter lim="800000"/>
        </a:ln>
        <a:ln w="12700" cap="flat" cmpd="sng" algn="ctr">
          <a:solidFill>
            <a:schemeClr val="phClr"/>
          </a:solidFill>
          <a:prstDash val="solid"/>
          <a:miter lim="800000"/>
        </a:ln>
        <a:ln w="12700" cap="flat" cmpd="sng" algn="ctr">
          <a:gradFill>
            <a:gsLst>
              <a:gs pos="0">
                <a:schemeClr val="phClr">
                  <a:hueOff val="-4200000"/>
                </a:schemeClr>
              </a:gs>
              <a:gs pos="100000">
                <a:schemeClr val="phClr"/>
              </a:gs>
            </a:gsLst>
            <a:lin ang="2700000" scaled="1"/>
          </a:gradFill>
          <a:prstDash val="solid"/>
          <a:miter lim="800000"/>
        </a:ln>
      </a:lnStyleLst>
      <a:effectStyleLst>
        <a:effectStyle>
          <a:effectLst>
            <a:outerShdw blurRad="101600" dist="50800" dir="5400000" algn="ctr" rotWithShape="0">
              <a:schemeClr val="phClr">
                <a:alpha val="60000"/>
              </a:schemeClr>
            </a:outerShdw>
          </a:effectLst>
        </a:effectStyle>
        <a:effectStyle>
          <a:effectLst>
            <a:reflection stA="50000" endA="300" endPos="40000" dist="25400" dir="5400000" sy="-100000" algn="bl" rotWithShape="0"/>
          </a:effectLst>
        </a:effectStyle>
        <a:effectStyle>
          <a:effectLst>
            <a:outerShdw blurRad="57150" dist="19050" dir="5400000" algn="ctr" rotWithShape="0">
              <a:srgbClr val="000000">
                <a:alpha val="63000"/>
              </a:srgbClr>
            </a:outerShdw>
          </a:effectLst>
        </a:effectStyle>
      </a:effectStyleLst>
      <a:bgFillStyleLst>
        <a:solidFill>
          <a:schemeClr val="phClr"/>
        </a:solidFill>
        <a:solidFill>
          <a:schemeClr val="phClr">
            <a:tint val="95000"/>
            <a:satMod val="170000"/>
          </a:schemeClr>
        </a:solidFill>
        <a:gradFill rotWithShape="1">
          <a:gsLst>
            <a:gs pos="0">
              <a:schemeClr val="phClr">
                <a:tint val="93000"/>
                <a:satMod val="150000"/>
                <a:shade val="98000"/>
                <a:lumMod val="102000"/>
              </a:schemeClr>
            </a:gs>
            <a:gs pos="50000">
              <a:schemeClr val="phClr">
                <a:tint val="98000"/>
                <a:satMod val="130000"/>
                <a:shade val="90000"/>
                <a:lumMod val="103000"/>
              </a:schemeClr>
            </a:gs>
            <a:gs pos="100000">
              <a:schemeClr val="phClr">
                <a:shade val="63000"/>
                <a:satMod val="120000"/>
              </a:schemeClr>
            </a:gs>
          </a:gsLst>
          <a:lin ang="5400000" scaled="0"/>
        </a:gradFill>
      </a:bgFillStyleLst>
    </a:fmtScheme>
  </a:themeElements>
  <a:objectDefaults/>
</a:theme>`;

export const CUSTOM_XML = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>\r\n<Properties xmlns="http://schemas.openxmlformats.org/officeDocument/2006/custom-properties"
xmlns:vt="http://schemas.openxmlformats.org/officeDocument/2006/docPropsVTypes">
<property fmtid="{D5CDD505-2E9C-101B-9397-08002B2CF9AE}" pid="2" name="ICV">
  <vt:lpwstr>A43D6FDBA27248266CF32D6511460B89_41</vt:lpwstr>
</property>
<property fmtid="{D5CDD505-2E9C-101B-9397-08002B2CF9AE}" pid="3" name="KSOProductBuildVer">
  <vt:lpwstr>1033-6.2.1.8344</vt:lpwstr>
</property>
</Properties>`;
