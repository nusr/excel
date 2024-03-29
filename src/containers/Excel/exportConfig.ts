export const CONFIG = {
  '_rels/.rels': `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
    <Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">
      <Relationship Id="rId3" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/extended-properties" Target="docProps/app.xml"/>
      <Relationship Id="rId2" Type="http://schemas.openxmlformats.org/package/2006/relationships/metadata/core-properties" Target="docProps/core.xml"/>
      <Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="xl/workbook.xml"/>
    </Relationships>`,
  'docProps/app.xml': `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
    <Properties xmlns="http://schemas.openxmlformats.org/officeDocument/2006/extended-properties"
      xmlns:vt="http://schemas.openxmlformats.org/officeDocument/2006/docPropsVTypes">
      <Application>Microsoft Excel</Application>
      <DocSecurity>0</DocSecurity>
      <ScaleCrop>false</ScaleCrop>
      <HeadingPairs>
        <vt:vector size="2" baseType="variant">
          <vt:variant>
            <vt:lpstr>工作表</vt:lpstr>
          </vt:variant>
          <vt:variant>
            <vt:i4>{size}</vt:i4>
          </vt:variant>
        </vt:vector>
      </HeadingPairs>
      <TitlesOfParts>
        <vt:vector size="{size}" baseType="lpstr">
          {children}
        </vt:vector>
      </TitlesOfParts>
      <Company></Company>
      <LinksUpToDate>false</LinksUpToDate>
      <SharedDoc>false</SharedDoc>
      <HyperlinksChanged>false</HyperlinksChanged>
      <AppVersion>16.0300</AppVersion>
    </Properties>`,
  'docProps/core.xml': `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
    <cp:coreProperties xmlns:cp="http://schemas.openxmlformats.org/package/2006/metadata/core-properties"
      xmlns:dc="http://purl.org/dc/elements/1.1/"
      xmlns:dcterms="http://purl.org/dc/terms/"
      xmlns:dcmitype="http://purl.org/dc/dcmitype/"
      xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">
      <dc:creator>Xu Steve</dc:creator>
      <cp:lastModifiedBy>Xu Steve</cp:lastModifiedBy>
      <dcterms:created xsi:type="dcterms:W3CDTF">{children}</dcterms:created>
      <dcterms:modified xsi:type="dcterms:W3CDTF">{children}</dcterms:modified>
    </cp:coreProperties>`,
  'xl/_rels/workbook.xml.rels': `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
    <Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">
      {children}
      {size}
    </Relationships>`,
  'xl/charts/_rels/chart1.xml.rels': `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
    <Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">
      <Relationship Id="rId2" Type="http://schemas.microsoft.com/office/2011/relationships/chartColorStyle" Target="colors1.xml"/>
      <Relationship Id="rId1" Type="http://schemas.microsoft.com/office/2011/relationships/chartStyle" Target="style1.xml"/>
    </Relationships>`,
  'xl/charts/chart1.xml': `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
    <c:chartSpace xmlns:c="http://schemas.openxmlformats.org/drawingml/2006/chart"
      xmlns:a="http://schemas.openxmlformats.org/drawingml/2006/main"
      xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships"
      xmlns:c16r2="http://schemas.microsoft.com/office/drawing/2015/06/chart">
      <c:date1904 val="0"/>
      <c:lang val="zh-CN"/>
      <c:roundedCorners val="0"/>
      <mc:AlternateContent xmlns:mc="http://schemas.openxmlformats.org/markup-compatibility/2006">
        <mc:Choice Requires="c14"
          xmlns:c14="http://schemas.microsoft.com/office/drawing/2007/8/2/chart">
          <c14:style val="102"/>
        </mc:Choice>
        <mc:Fallback>
          <c:style val="2"/>
        </mc:Fallback>
      </mc:AlternateContent>
      <c:chart>
        <c:title>
          <c:tx>
            <c:rich>
              <a:bodyPr rot="0" spcFirstLastPara="1" vertOverflow="ellipsis" vert="horz" wrap="square" anchor="ctr" anchorCtr="1"/>
              <a:lstStyle/>
              <a:p>
                <a:pPr>
                  <a:defRPr sz="1400" b="0" i="0" u="none" strike="noStrike" kern="1200" spc="0" baseline="0">
                    <a:solidFill>
                      <a:schemeClr val="tx1">
                        <a:lumMod val="65000"/>
                        <a:lumOff val="35000"/>
                      </a:schemeClr>
                    </a:solidFill>
                    <a:latin typeface="+mn-lt"/>
                    <a:ea typeface="+mn-ea"/>
                    <a:cs typeface="+mn-cs"/>
                  </a:defRPr>
                </a:pPr>
                <a:r>
                  <a:rPr lang="en-US" altLang="zh-CN"/>
                  <a:t>test</a:t>
                </a:r>
              </a:p>
              <a:p>
                <a:pPr>
                  <a:defRPr/>
                </a:pPr>
                <a:endParaRPr lang="zh-CN" altLang="en-US"/>
              </a:p>
            </c:rich>
          </c:tx>
          <c:overlay val="0"/>
          <c:spPr>
            <a:noFill/>
            <a:ln>
              <a:noFill/>
            </a:ln>
            <a:effectLst/>
          </c:spPr>
          <c:txPr>
            <a:bodyPr rot="0" spcFirstLastPara="1" vertOverflow="ellipsis" vert="horz" wrap="square" anchor="ctr" anchorCtr="1"/>
            <a:lstStyle/>
            <a:p>
              <a:pPr>
                <a:defRPr sz="1400" b="0" i="0" u="none" strike="noStrike" kern="1200" spc="0" baseline="0">
                  <a:solidFill>
                    <a:schemeClr val="tx1">
                      <a:lumMod val="65000"/>
                      <a:lumOff val="35000"/>
                    </a:schemeClr>
                  </a:solidFill>
                  <a:latin typeface="+mn-lt"/>
                  <a:ea typeface="+mn-ea"/>
                  <a:cs typeface="+mn-cs"/>
                </a:defRPr>
              </a:pPr>
              <a:endParaRPr lang="zh-CN"/>
            </a:p>
          </c:txPr>
        </c:title>
        <c:autoTitleDeleted val="0"/>
        <c:plotArea>
          <c:layout/>
          <c:barChart>
            <c:barDir val="col"/>
            <c:grouping val="clustered"/>
            <c:varyColors val="0"/>
            <c:ser>
              <c:idx val="0"/>
              <c:order val="0"/>
              <c:spPr>
                <a:solidFill>
                  <a:schemeClr val="accent1"/>
                </a:solidFill>
                <a:ln>
                  <a:noFill/>
                </a:ln>
                <a:effectLst/>
              </c:spPr>
              <c:invertIfNegative val="0"/>
              <c:val>
                <c:numRef>
                  <c:f>Sheet4!$E$4:$E$7</c:f>
                  <c:numCache>
                    <c:formatCode>General</c:formatCode>
                    <c:ptCount val="4"/>
                    <c:pt idx="0">
                      <c:v>22</c:v>
                    </c:pt>
                    <c:pt idx="3">
                      <c:v>33</c:v>
                    </c:pt>
                  </c:numCache>
                </c:numRef>
              </c:val>
              <c:extLst>
                <c:ext uri="{C3380CC4-5D6E-409C-BE32-E72D297353CC}"
                  xmlns:c16="http://schemas.microsoft.com/office/drawing/2014/chart">
                  <c16:uniqueId val="{00000000-F341-4959-B5F2-8AFDC73AE116}"/>
                </c:ext>
              </c:extLst>
            </c:ser>
            <c:ser>
              <c:idx val="1"/>
              <c:order val="1"/>
              <c:spPr>
                <a:solidFill>
                  <a:schemeClr val="accent2"/>
                </a:solidFill>
                <a:ln>
                  <a:noFill/>
                </a:ln>
                <a:effectLst/>
              </c:spPr>
              <c:invertIfNegative val="0"/>
              <c:val>
                <c:numRef>
                  <c:f>Sheet4!$F$4:$F$7</c:f>
                  <c:numCache>
                    <c:formatCode>General</c:formatCode>
                    <c:ptCount val="4"/>
                  </c:numCache>
                </c:numRef>
              </c:val>
              <c:extLst>
                <c:ext uri="{C3380CC4-5D6E-409C-BE32-E72D297353CC}"
                  xmlns:c16="http://schemas.microsoft.com/office/drawing/2014/chart">
                  <c16:uniqueId val="{00000001-F341-4959-B5F2-8AFDC73AE116}"/>
                </c:ext>
              </c:extLst>
            </c:ser>
            <c:dLbls>
              <c:showLegendKey val="0"/>
              <c:showVal val="0"/>
              <c:showCatName val="0"/>
              <c:showSerName val="0"/>
              <c:showPercent val="0"/>
              <c:showBubbleSize val="0"/>
            </c:dLbls>
            <c:gapWidth val="219"/>
            <c:overlap val="-27"/>
            <c:axId val="152326191"/>
            <c:axId val="152327631"/>
          </c:barChart>
          <c:catAx>
            <c:axId val="152326191"/>
            <c:scaling>
              <c:orientation val="minMax"/>
            </c:scaling>
            <c:delete val="0"/>
            <c:axPos val="b"/>
            <c:majorTickMark val="none"/>
            <c:minorTickMark val="none"/>
            <c:tickLblPos val="nextTo"/>
            <c:spPr>
              <a:noFill/>
              <a:ln w="9525" cap="flat" cmpd="sng" algn="ctr">
                <a:solidFill>
                  <a:schemeClr val="tx1">
                    <a:lumMod val="15000"/>
                    <a:lumOff val="85000"/>
                  </a:schemeClr>
                </a:solidFill>
                <a:round/>
              </a:ln>
              <a:effectLst/>
            </c:spPr>
            <c:txPr>
              <a:bodyPr rot="-60000000" spcFirstLastPara="1" vertOverflow="ellipsis" vert="horz" wrap="square" anchor="ctr" anchorCtr="1"/>
              <a:lstStyle/>
              <a:p>
                <a:pPr>
                  <a:defRPr sz="900" b="0" i="0" u="none" strike="noStrike" kern="1200" baseline="0">
                    <a:solidFill>
                      <a:schemeClr val="tx1">
                        <a:lumMod val="65000"/>
                        <a:lumOff val="35000"/>
                      </a:schemeClr>
                    </a:solidFill>
                    <a:latin typeface="+mn-lt"/>
                    <a:ea typeface="+mn-ea"/>
                    <a:cs typeface="+mn-cs"/>
                  </a:defRPr>
                </a:pPr>
                <a:endParaRPr lang="zh-CN"/>
              </a:p>
            </c:txPr>
            <c:crossAx val="152327631"/>
            <c:crosses val="autoZero"/>
            <c:auto val="1"/>
            <c:lblAlgn val="ctr"/>
            <c:lblOffset val="100"/>
            <c:noMultiLvlLbl val="0"/>
          </c:catAx>
          <c:valAx>
            <c:axId val="152327631"/>
            <c:scaling>
              <c:orientation val="minMax"/>
            </c:scaling>
            <c:delete val="0"/>
            <c:axPos val="l"/>
            <c:majorGridlines>
              <c:spPr>
                <a:ln w="9525" cap="flat" cmpd="sng" algn="ctr">
                  <a:solidFill>
                    <a:schemeClr val="tx1">
                      <a:lumMod val="15000"/>
                      <a:lumOff val="85000"/>
                    </a:schemeClr>
                  </a:solidFill>
                  <a:round/>
                </a:ln>
                <a:effectLst/>
              </c:spPr>
            </c:majorGridlines>
            <c:numFmt formatCode="General" sourceLinked="1"/>
            <c:majorTickMark val="none"/>
            <c:minorTickMark val="none"/>
            <c:tickLblPos val="nextTo"/>
            <c:spPr>
              <a:noFill/>
              <a:ln>
                <a:noFill/>
              </a:ln>
              <a:effectLst/>
            </c:spPr>
            <c:txPr>
              <a:bodyPr rot="-60000000" spcFirstLastPara="1" vertOverflow="ellipsis" vert="horz" wrap="square" anchor="ctr" anchorCtr="1"/>
              <a:lstStyle/>
              <a:p>
                <a:pPr>
                  <a:defRPr sz="900" b="0" i="0" u="none" strike="noStrike" kern="1200" baseline="0">
                    <a:solidFill>
                      <a:schemeClr val="tx1">
                        <a:lumMod val="65000"/>
                        <a:lumOff val="35000"/>
                      </a:schemeClr>
                    </a:solidFill>
                    <a:latin typeface="+mn-lt"/>
                    <a:ea typeface="+mn-ea"/>
                    <a:cs typeface="+mn-cs"/>
                  </a:defRPr>
                </a:pPr>
                <a:endParaRPr lang="zh-CN"/>
              </a:p>
            </c:txPr>
            <c:crossAx val="152326191"/>
            <c:crosses val="autoZero"/>
            <c:crossBetween val="between"/>
          </c:valAx>
          <c:spPr>
            <a:noFill/>
            <a:ln>
              <a:noFill/>
            </a:ln>
            <a:effectLst/>
          </c:spPr>
        </c:plotArea>
        <c:legend>
          <c:legendPos val="b"/>
          <c:overlay val="0"/>
          <c:spPr>
            <a:noFill/>
            <a:ln>
              <a:noFill/>
            </a:ln>
            <a:effectLst/>
          </c:spPr>
          <c:txPr>
            <a:bodyPr rot="0" spcFirstLastPara="1" vertOverflow="ellipsis" vert="horz" wrap="square" anchor="ctr" anchorCtr="1"/>
            <a:lstStyle/>
            <a:p>
              <a:pPr>
                <a:defRPr sz="900" b="0" i="0" u="none" strike="noStrike" kern="1200" baseline="0">
                  <a:solidFill>
                    <a:schemeClr val="tx1">
                      <a:lumMod val="65000"/>
                      <a:lumOff val="35000"/>
                    </a:schemeClr>
                  </a:solidFill>
                  <a:latin typeface="+mn-lt"/>
                  <a:ea typeface="+mn-ea"/>
                  <a:cs typeface="+mn-cs"/>
                </a:defRPr>
              </a:pPr>
              <a:endParaRPr lang="zh-CN"/>
            </a:p>
          </c:txPr>
        </c:legend>
        <c:plotVisOnly val="1"/>
        <c:dispBlanksAs val="gap"/>
        <c:extLst>
          <c:ext uri="{56B9EC1D-385E-4148-901F-78D8002777C0}"
            xmlns:c16r3="http://schemas.microsoft.com/office/drawing/2017/03/chart">
            <c16r3:dataDisplayOptions16>
              <c16r3:dispNaAsBlank val="1"/>
            </c16r3:dataDisplayOptions16>
          </c:ext>
        </c:extLst>
        <c:showDLblsOverMax val="0"/>
      </c:chart>
      <c:spPr>
        <a:solidFill>
          <a:schemeClr val="bg1"/>
        </a:solidFill>
        <a:ln w="9525" cap="flat" cmpd="sng" algn="ctr">
          <a:solidFill>
            <a:schemeClr val="tx1">
              <a:lumMod val="15000"/>
              <a:lumOff val="85000"/>
            </a:schemeClr>
          </a:solidFill>
          <a:round/>
        </a:ln>
        <a:effectLst/>
      </c:spPr>
      <c:txPr>
        <a:bodyPr/>
        <a:lstStyle/>
        <a:p>
          <a:pPr>
            <a:defRPr/>
          </a:pPr>
          <a:endParaRPr lang="zh-CN"/>
        </a:p>
      </c:txPr>
      <c:printSettings>
        <c:headerFooter/>
        <c:pageMargins b="0.75" l="0.7" r="0.7" t="0.75" header="0.3" footer="0.3"/>
        <c:pageSetup/>
      </c:printSettings>
    </c:chartSpace>`,
  'xl/charts/colors1.xml': `<cs:colorStyle xmlns:cs="http://schemas.microsoft.com/office/drawing/2012/chartStyle"
xmlns:a="http://schemas.openxmlformats.org/drawingml/2006/main" meth="cycle" id="10">
<a:schemeClr val="accent1"/>
<a:schemeClr val="accent2"/>
<a:schemeClr val="accent3"/>
<a:schemeClr val="accent4"/>
<a:schemeClr val="accent5"/>
<a:schemeClr val="accent6"/>
<cs:variation/>
<cs:variation>
  <a:lumMod val="60000"/>
</cs:variation>
<cs:variation>
  <a:lumMod val="80000"/>
  <a:lumOff val="20000"/>
</cs:variation>
<cs:variation>
  <a:lumMod val="80000"/>
</cs:variation>
<cs:variation>
  <a:lumMod val="60000"/>
  <a:lumOff val="40000"/>
</cs:variation>
<cs:variation>
  <a:lumMod val="50000"/>
</cs:variation>
<cs:variation>
  <a:lumMod val="70000"/>
  <a:lumOff val="30000"/>
</cs:variation>
<cs:variation>
  <a:lumMod val="70000"/>
</cs:variation>
<cs:variation>
  <a:lumMod val="50000"/>
  <a:lumOff val="50000"/>
</cs:variation>
</cs:colorStyle>`,
  'xl/charts/style1.xml': `<cs:chartStyle xmlns:cs="http://schemas.microsoft.com/office/drawing/2012/chartStyle"
    xmlns:a="http://schemas.openxmlformats.org/drawingml/2006/main" id="201">
    <cs:axisTitle>
      <cs:lnRef idx="0"/>
      <cs:fillRef idx="0"/>
      <cs:effectRef idx="0"/>
      <cs:fontRef idx="minor">
        <a:schemeClr val="tx1">
          <a:lumMod val="65000"/>
          <a:lumOff val="35000"/>
        </a:schemeClr>
      </cs:fontRef>
      <cs:defRPr sz="1000" kern="1200"/>
    </cs:axisTitle>
    <cs:categoryAxis>
      <cs:lnRef idx="0"/>
      <cs:fillRef idx="0"/>
      <cs:effectRef idx="0"/>
      <cs:fontRef idx="minor">
        <a:schemeClr val="tx1">
          <a:lumMod val="65000"/>
          <a:lumOff val="35000"/>
        </a:schemeClr>
      </cs:fontRef>
      <cs:spPr>
        <a:ln w="9525" cap="flat" cmpd="sng" algn="ctr">
          <a:solidFill>
            <a:schemeClr val="tx1">
              <a:lumMod val="15000"/>
              <a:lumOff val="85000"/>
            </a:schemeClr>
          </a:solidFill>
          <a:round/>
        </a:ln>
      </cs:spPr>
      <cs:defRPr sz="900" kern="1200"/>
    </cs:categoryAxis>
    <cs:chartArea mods="allowNoFillOverride allowNoLineOverride">
      <cs:lnRef idx="0"/>
      <cs:fillRef idx="0"/>
      <cs:effectRef idx="0"/>
      <cs:fontRef idx="minor">
        <a:schemeClr val="tx1"/>
      </cs:fontRef>
      <cs:spPr>
        <a:solidFill>
          <a:schemeClr val="bg1"/>
        </a:solidFill>
        <a:ln w="9525" cap="flat" cmpd="sng" algn="ctr">
          <a:solidFill>
            <a:schemeClr val="tx1">
              <a:lumMod val="15000"/>
              <a:lumOff val="85000"/>
            </a:schemeClr>
          </a:solidFill>
          <a:round/>
        </a:ln>
      </cs:spPr>
      <cs:defRPr sz="1000" kern="1200"/>
    </cs:chartArea>
    <cs:dataLabel>
      <cs:lnRef idx="0"/>
      <cs:fillRef idx="0"/>
      <cs:effectRef idx="0"/>
      <cs:fontRef idx="minor">
        <a:schemeClr val="tx1">
          <a:lumMod val="75000"/>
          <a:lumOff val="25000"/>
        </a:schemeClr>
      </cs:fontRef>
      <cs:defRPr sz="900" kern="1200"/>
    </cs:dataLabel>
    <cs:dataLabelCallout>
      <cs:lnRef idx="0"/>
      <cs:fillRef idx="0"/>
      <cs:effectRef idx="0"/>
      <cs:fontRef idx="minor">
        <a:schemeClr val="dk1">
          <a:lumMod val="65000"/>
          <a:lumOff val="35000"/>
        </a:schemeClr>
      </cs:fontRef>
      <cs:spPr>
        <a:solidFill>
          <a:schemeClr val="lt1"/>
        </a:solidFill>
        <a:ln>
          <a:solidFill>
            <a:schemeClr val="dk1">
              <a:lumMod val="25000"/>
              <a:lumOff val="75000"/>
            </a:schemeClr>
          </a:solidFill>
        </a:ln>
      </cs:spPr>
      <cs:defRPr sz="900" kern="1200"/>
      <cs:bodyPr rot="0" spcFirstLastPara="1" vertOverflow="clip" horzOverflow="clip" vert="horz" wrap="square" lIns="36576" tIns="18288" rIns="36576" bIns="18288" anchor="ctr" anchorCtr="1">
        <a:spAutoFit/>
      </cs:bodyPr>
    </cs:dataLabelCallout>
    <cs:dataPoint>
      <cs:lnRef idx="0"/>
      <cs:fillRef idx="1">
        <cs:styleClr val="auto"/>
      </cs:fillRef>
      <cs:effectRef idx="0"/>
      <cs:fontRef idx="minor">
        <a:schemeClr val="tx1"/>
      </cs:fontRef>
    </cs:dataPoint>
    <cs:dataPoint3D>
      <cs:lnRef idx="0"/>
      <cs:fillRef idx="1">
        <cs:styleClr val="auto"/>
      </cs:fillRef>
      <cs:effectRef idx="0"/>
      <cs:fontRef idx="minor">
        <a:schemeClr val="tx1"/>
      </cs:fontRef>
    </cs:dataPoint3D>
    <cs:dataPointLine>
      <cs:lnRef idx="0">
        <cs:styleClr val="auto"/>
      </cs:lnRef>
      <cs:fillRef idx="1"/>
      <cs:effectRef idx="0"/>
      <cs:fontRef idx="minor">
        <a:schemeClr val="tx1"/>
      </cs:fontRef>
      <cs:spPr>
        <a:ln w="28575" cap="rnd">
          <a:solidFill>
            <a:schemeClr val="phClr"/>
          </a:solidFill>
          <a:round/>
        </a:ln>
      </cs:spPr>
    </cs:dataPointLine>
    <cs:dataPointMarker>
      <cs:lnRef idx="0">
        <cs:styleClr val="auto"/>
      </cs:lnRef>
      <cs:fillRef idx="1">
        <cs:styleClr val="auto"/>
      </cs:fillRef>
      <cs:effectRef idx="0"/>
      <cs:fontRef idx="minor">
        <a:schemeClr val="tx1"/>
      </cs:fontRef>
      <cs:spPr>
        <a:ln w="9525">
          <a:solidFill>
            <a:schemeClr val="phClr"/>
          </a:solidFill>
        </a:ln>
      </cs:spPr>
    </cs:dataPointMarker>
    <cs:dataPointMarkerLayout symbol="circle" size="5"/>
    <cs:dataPointWireframe>
      <cs:lnRef idx="0">
        <cs:styleClr val="auto"/>
      </cs:lnRef>
      <cs:fillRef idx="1"/>
      <cs:effectRef idx="0"/>
      <cs:fontRef idx="minor">
        <a:schemeClr val="tx1"/>
      </cs:fontRef>
      <cs:spPr>
        <a:ln w="9525" cap="rnd">
          <a:solidFill>
            <a:schemeClr val="phClr"/>
          </a:solidFill>
          <a:round/>
        </a:ln>
      </cs:spPr>
    </cs:dataPointWireframe>
    <cs:dataTable>
      <cs:lnRef idx="0"/>
      <cs:fillRef idx="0"/>
      <cs:effectRef idx="0"/>
      <cs:fontRef idx="minor">
        <a:schemeClr val="tx1">
          <a:lumMod val="65000"/>
          <a:lumOff val="35000"/>
        </a:schemeClr>
      </cs:fontRef>
      <cs:spPr>
        <a:noFill/>
        <a:ln w="9525" cap="flat" cmpd="sng" algn="ctr">
          <a:solidFill>
            <a:schemeClr val="tx1">
              <a:lumMod val="15000"/>
              <a:lumOff val="85000"/>
            </a:schemeClr>
          </a:solidFill>
          <a:round/>
        </a:ln>
      </cs:spPr>
      <cs:defRPr sz="900" kern="1200"/>
    </cs:dataTable>
    <cs:downBar>
      <cs:lnRef idx="0"/>
      <cs:fillRef idx="0"/>
      <cs:effectRef idx="0"/>
      <cs:fontRef idx="minor">
        <a:schemeClr val="dk1"/>
      </cs:fontRef>
      <cs:spPr>
        <a:solidFill>
          <a:schemeClr val="dk1">
            <a:lumMod val="65000"/>
            <a:lumOff val="35000"/>
          </a:schemeClr>
        </a:solidFill>
        <a:ln w="9525">
          <a:solidFill>
            <a:schemeClr val="tx1">
              <a:lumMod val="65000"/>
              <a:lumOff val="35000"/>
            </a:schemeClr>
          </a:solidFill>
        </a:ln>
      </cs:spPr>
    </cs:downBar>
    <cs:dropLine>
      <cs:lnRef idx="0"/>
      <cs:fillRef idx="0"/>
      <cs:effectRef idx="0"/>
      <cs:fontRef idx="minor">
        <a:schemeClr val="tx1"/>
      </cs:fontRef>
      <cs:spPr>
        <a:ln w="9525" cap="flat" cmpd="sng" algn="ctr">
          <a:solidFill>
            <a:schemeClr val="tx1">
              <a:lumMod val="35000"/>
              <a:lumOff val="65000"/>
            </a:schemeClr>
          </a:solidFill>
          <a:round/>
        </a:ln>
      </cs:spPr>
    </cs:dropLine>
    <cs:errorBar>
      <cs:lnRef idx="0"/>
      <cs:fillRef idx="0"/>
      <cs:effectRef idx="0"/>
      <cs:fontRef idx="minor">
        <a:schemeClr val="tx1"/>
      </cs:fontRef>
      <cs:spPr>
        <a:ln w="9525" cap="flat" cmpd="sng" algn="ctr">
          <a:solidFill>
            <a:schemeClr val="tx1">
              <a:lumMod val="65000"/>
              <a:lumOff val="35000"/>
            </a:schemeClr>
          </a:solidFill>
          <a:round/>
        </a:ln>
      </cs:spPr>
    </cs:errorBar>
    <cs:floor>
      <cs:lnRef idx="0"/>
      <cs:fillRef idx="0"/>
      <cs:effectRef idx="0"/>
      <cs:fontRef idx="minor">
        <a:schemeClr val="tx1"/>
      </cs:fontRef>
      <cs:spPr>
        <a:noFill/>
        <a:ln>
          <a:noFill/>
        </a:ln>
      </cs:spPr>
    </cs:floor>
    <cs:gridlineMajor>
      <cs:lnRef idx="0"/>
      <cs:fillRef idx="0"/>
      <cs:effectRef idx="0"/>
      <cs:fontRef idx="minor">
        <a:schemeClr val="tx1"/>
      </cs:fontRef>
      <cs:spPr>
        <a:ln w="9525" cap="flat" cmpd="sng" algn="ctr">
          <a:solidFill>
            <a:schemeClr val="tx1">
              <a:lumMod val="15000"/>
              <a:lumOff val="85000"/>
            </a:schemeClr>
          </a:solidFill>
          <a:round/>
        </a:ln>
      </cs:spPr>
    </cs:gridlineMajor>
    <cs:gridlineMinor>
      <cs:lnRef idx="0"/>
      <cs:fillRef idx="0"/>
      <cs:effectRef idx="0"/>
      <cs:fontRef idx="minor">
        <a:schemeClr val="tx1"/>
      </cs:fontRef>
      <cs:spPr>
        <a:ln w="9525" cap="flat" cmpd="sng" algn="ctr">
          <a:solidFill>
            <a:schemeClr val="tx1">
              <a:lumMod val="5000"/>
              <a:lumOff val="95000"/>
            </a:schemeClr>
          </a:solidFill>
          <a:round/>
        </a:ln>
      </cs:spPr>
    </cs:gridlineMinor>
    <cs:hiLoLine>
      <cs:lnRef idx="0"/>
      <cs:fillRef idx="0"/>
      <cs:effectRef idx="0"/>
      <cs:fontRef idx="minor">
        <a:schemeClr val="tx1"/>
      </cs:fontRef>
      <cs:spPr>
        <a:ln w="9525" cap="flat" cmpd="sng" algn="ctr">
          <a:solidFill>
            <a:schemeClr val="tx1">
              <a:lumMod val="75000"/>
              <a:lumOff val="25000"/>
            </a:schemeClr>
          </a:solidFill>
          <a:round/>
        </a:ln>
      </cs:spPr>
    </cs:hiLoLine>
    <cs:leaderLine>
      <cs:lnRef idx="0"/>
      <cs:fillRef idx="0"/>
      <cs:effectRef idx="0"/>
      <cs:fontRef idx="minor">
        <a:schemeClr val="tx1"/>
      </cs:fontRef>
      <cs:spPr>
        <a:ln w="9525" cap="flat" cmpd="sng" algn="ctr">
          <a:solidFill>
            <a:schemeClr val="tx1">
              <a:lumMod val="35000"/>
              <a:lumOff val="65000"/>
            </a:schemeClr>
          </a:solidFill>
          <a:round/>
        </a:ln>
      </cs:spPr>
    </cs:leaderLine>
    <cs:legend>
      <cs:lnRef idx="0"/>
      <cs:fillRef idx="0"/>
      <cs:effectRef idx="0"/>
      <cs:fontRef idx="minor">
        <a:schemeClr val="tx1">
          <a:lumMod val="65000"/>
          <a:lumOff val="35000"/>
        </a:schemeClr>
      </cs:fontRef>
      <cs:defRPr sz="900" kern="1200"/>
    </cs:legend>
    <cs:plotArea mods="allowNoFillOverride allowNoLineOverride">
      <cs:lnRef idx="0"/>
      <cs:fillRef idx="0"/>
      <cs:effectRef idx="0"/>
      <cs:fontRef idx="minor">
        <a:schemeClr val="tx1"/>
      </cs:fontRef>
    </cs:plotArea>
    <cs:plotArea3D mods="allowNoFillOverride allowNoLineOverride">
      <cs:lnRef idx="0"/>
      <cs:fillRef idx="0"/>
      <cs:effectRef idx="0"/>
      <cs:fontRef idx="minor">
        <a:schemeClr val="tx1"/>
      </cs:fontRef>
    </cs:plotArea3D>
    <cs:seriesAxis>
      <cs:lnRef idx="0"/>
      <cs:fillRef idx="0"/>
      <cs:effectRef idx="0"/>
      <cs:fontRef idx="minor">
        <a:schemeClr val="tx1">
          <a:lumMod val="65000"/>
          <a:lumOff val="35000"/>
        </a:schemeClr>
      </cs:fontRef>
      <cs:defRPr sz="900" kern="1200"/>
    </cs:seriesAxis>
    <cs:seriesLine>
      <cs:lnRef idx="0"/>
      <cs:fillRef idx="0"/>
      <cs:effectRef idx="0"/>
      <cs:fontRef idx="minor">
        <a:schemeClr val="tx1"/>
      </cs:fontRef>
      <cs:spPr>
        <a:ln w="9525" cap="flat" cmpd="sng" algn="ctr">
          <a:solidFill>
            <a:schemeClr val="tx1">
              <a:lumMod val="35000"/>
              <a:lumOff val="65000"/>
            </a:schemeClr>
          </a:solidFill>
          <a:round/>
        </a:ln>
      </cs:spPr>
    </cs:seriesLine>
    <cs:title>
      <cs:lnRef idx="0"/>
      <cs:fillRef idx="0"/>
      <cs:effectRef idx="0"/>
      <cs:fontRef idx="minor">
        <a:schemeClr val="tx1">
          <a:lumMod val="65000"/>
          <a:lumOff val="35000"/>
        </a:schemeClr>
      </cs:fontRef>
      <cs:defRPr sz="1400" b="0" kern="1200" spc="0" baseline="0"/>
    </cs:title>
    <cs:trendline>
      <cs:lnRef idx="0">
        <cs:styleClr val="auto"/>
      </cs:lnRef>
      <cs:fillRef idx="0"/>
      <cs:effectRef idx="0"/>
      <cs:fontRef idx="minor">
        <a:schemeClr val="tx1"/>
      </cs:fontRef>
      <cs:spPr>
        <a:ln w="19050" cap="rnd">
          <a:solidFill>
            <a:schemeClr val="phClr"/>
          </a:solidFill>
          <a:prstDash val="sysDot"/>
        </a:ln>
      </cs:spPr>
    </cs:trendline>
    <cs:trendlineLabel>
      <cs:lnRef idx="0"/>
      <cs:fillRef idx="0"/>
      <cs:effectRef idx="0"/>
      <cs:fontRef idx="minor">
        <a:schemeClr val="tx1">
          <a:lumMod val="65000"/>
          <a:lumOff val="35000"/>
        </a:schemeClr>
      </cs:fontRef>
      <cs:defRPr sz="900" kern="1200"/>
    </cs:trendlineLabel>
    <cs:upBar>
      <cs:lnRef idx="0"/>
      <cs:fillRef idx="0"/>
      <cs:effectRef idx="0"/>
      <cs:fontRef idx="minor">
        <a:schemeClr val="dk1"/>
      </cs:fontRef>
      <cs:spPr>
        <a:solidFill>
          <a:schemeClr val="lt1"/>
        </a:solidFill>
        <a:ln w="9525">
          <a:solidFill>
            <a:schemeClr val="tx1">
              <a:lumMod val="15000"/>
              <a:lumOff val="85000"/>
            </a:schemeClr>
          </a:solidFill>
        </a:ln>
      </cs:spPr>
    </cs:upBar>
    <cs:valueAxis>
      <cs:lnRef idx="0"/>
      <cs:fillRef idx="0"/>
      <cs:effectRef idx="0"/>
      <cs:fontRef idx="minor">
        <a:schemeClr val="tx1">
          <a:lumMod val="65000"/>
          <a:lumOff val="35000"/>
        </a:schemeClr>
      </cs:fontRef>
      <cs:defRPr sz="900" kern="1200"/>
    </cs:valueAxis>
    <cs:wall>
      <cs:lnRef idx="0"/>
      <cs:fillRef idx="0"/>
      <cs:effectRef idx="0"/>
      <cs:fontRef idx="minor">
        <a:schemeClr val="tx1"/>
      </cs:fontRef>
      <cs:spPr>
        <a:noFill/>
        <a:ln>
          <a:noFill/>
        </a:ln>
      </cs:spPr>
    </cs:wall>
  </cs:chartStyle>`,
  'xl/drawings/_rels/drawing1.xml.rels': `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
    <Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">
      <Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/image" Target="../media/image1.jpeg"/>
    </Relationships>`,

  'xl/drawings/drawing1.xml': `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
    <xdr:wsDr xmlns:xdr="http://schemas.openxmlformats.org/drawingml/2006/spreadsheetDrawing"
      xmlns:a="http://schemas.openxmlformats.org/drawingml/2006/main">
      <xdr:twoCellAnchor editAs="oneCell">
        <xdr:from>
          <xdr:col>2</xdr:col>
          <xdr:colOff>276225</xdr:colOff>
          <xdr:row>2</xdr:row>
          <xdr:rowOff>152399</xdr:rowOff>
        </xdr:from>
        <xdr:to>
          <xdr:col>5</xdr:col>
          <xdr:colOff>447675</xdr:colOff>
          <xdr:row>22</xdr:row>
          <xdr:rowOff>130174</xdr:rowOff>
        </xdr:to>
        <xdr:pic>
          <xdr:nvPicPr>
            <xdr:cNvPr id="3" name="图片 2">
              <a:extLst>
                <a:ext uri="{FF2B5EF4-FFF2-40B4-BE49-F238E27FC236}">
                  <a16:creationId xmlns:a16="http://schemas.microsoft.com/office/drawing/2014/main" id="{25C6107E-7B40-77BB-5A2D-7E3AC9E08275}"/>
                </a:ext>
              </a:extLst>
            </xdr:cNvPr>
            <xdr:cNvPicPr>
              <a:picLocks noChangeAspect="1"/>
            </xdr:cNvPicPr>
          </xdr:nvPicPr>
          <xdr:blipFill>
            <a:blip xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships" r:embed="rId1">
              <a:extLst>
                <a:ext uri="{28A0092B-C50C-407E-A947-70E740481C1C}">
                  <a14:useLocalDpi xmlns:a14="http://schemas.microsoft.com/office/drawing/2010/main" val="0"/>
                </a:ext>
              </a:extLst>
            </a:blip>
            <a:stretch>
              <a:fillRect/>
            </a:stretch>
          </xdr:blipFill>
          <xdr:spPr>
            <a:xfrm rot="561265">
              <a:off x="1571625" y="504824"/>
              <a:ext cx="2114550" cy="3502025"/>
            </a:xfrm>
            <a:prstGeom prst="rect">
              <a:avLst/>
            </a:prstGeom>
          </xdr:spPr>
        </xdr:pic>
        <xdr:clientData/>
      </xdr:twoCellAnchor>
    </xdr:wsDr>`,
  'xl/media/image1.jpeg': '',
  'xl/theme/theme1.xml': `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
    <a:theme xmlns:a="http://schemas.openxmlformats.org/drawingml/2006/main" name="Office 主题​​">
      <a:themeElements>
        <a:clrScheme name="Office">
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
            <a:srgbClr val="4472C4"/>
          </a:accent1>
          <a:accent2>
            <a:srgbClr val="ED7D31"/>
          </a:accent2>
          <a:accent3>
            <a:srgbClr val="A5A5A5"/>
          </a:accent3>
          <a:accent4>
            <a:srgbClr val="FFC000"/>
          </a:accent4>
          <a:accent5>
            <a:srgbClr val="5B9BD5"/>
          </a:accent5>
          <a:accent6>
            <a:srgbClr val="70AD47"/>
          </a:accent6>
          <a:hlink>
            <a:srgbClr val="0563C1"/>
          </a:hlink>
          <a:folHlink>
            <a:srgbClr val="954F72"/>
          </a:folHlink>
        </a:clrScheme>
        <a:fontScheme name="Office">
          <a:majorFont>
            <a:latin typeface="Calibri Light" panose="020F0302020204030204"/>
            <a:ea typeface=""/>
            <a:cs typeface=""/>
            <a:font script="Jpan" typeface="游ゴシック Light"/>
            <a:font script="Hang" typeface="맑은 고딕"/>
            <a:font script="Hans" typeface="等线 Light"/>
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
            <a:font script="Armn" typeface="Arial"/>
            <a:font script="Bugi" typeface="Leelawadee UI"/>
            <a:font script="Bopo" typeface="Microsoft JhengHei"/>
            <a:font script="Java" typeface="Javanese Text"/>
            <a:font script="Lisu" typeface="Segoe UI"/>
            <a:font script="Mymr" typeface="Myanmar Text"/>
            <a:font script="Nkoo" typeface="Ebrima"/>
            <a:font script="Olck" typeface="Nirmala UI"/>
            <a:font script="Osma" typeface="Ebrima"/>
            <a:font script="Phag" typeface="Phagspa"/>
            <a:font script="Syrn" typeface="Estrangelo Edessa"/>
            <a:font script="Syrj" typeface="Estrangelo Edessa"/>
            <a:font script="Syre" typeface="Estrangelo Edessa"/>
            <a:font script="Sora" typeface="Nirmala UI"/>
            <a:font script="Tale" typeface="Microsoft Tai Le"/>
            <a:font script="Talu" typeface="Microsoft New Tai Lue"/>
            <a:font script="Tfng" typeface="Ebrima"/>
          </a:majorFont>
          <a:minorFont>
            <a:latin typeface="Calibri" panose="020F0502020204030204"/>
            <a:ea typeface=""/>
            <a:cs typeface=""/>
            <a:font script="Jpan" typeface="游ゴシック"/>
            <a:font script="Hang" typeface="맑은 고딕"/>
            <a:font script="Hans" typeface="等线"/>
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
            <a:font script="Armn" typeface="Arial"/>
            <a:font script="Bugi" typeface="Leelawadee UI"/>
            <a:font script="Bopo" typeface="Microsoft JhengHei"/>
            <a:font script="Java" typeface="Javanese Text"/>
            <a:font script="Lisu" typeface="Segoe UI"/>
            <a:font script="Mymr" typeface="Myanmar Text"/>
            <a:font script="Nkoo" typeface="Ebrima"/>
            <a:font script="Olck" typeface="Nirmala UI"/>
            <a:font script="Osma" typeface="Ebrima"/>
            <a:font script="Phag" typeface="Phagspa"/>
            <a:font script="Syrn" typeface="Estrangelo Edessa"/>
            <a:font script="Syrj" typeface="Estrangelo Edessa"/>
            <a:font script="Syre" typeface="Estrangelo Edessa"/>
            <a:font script="Sora" typeface="Nirmala UI"/>
            <a:font script="Tale" typeface="Microsoft Tai Le"/>
            <a:font script="Talu" typeface="Microsoft New Tai Lue"/>
            <a:font script="Tfng" typeface="Ebrima"/>
          </a:minorFont>
        </a:fontScheme>
        <a:fmtScheme name="Office">
          <a:fillStyleLst>
            <a:solidFill>
              <a:schemeClr val="phClr"/>
            </a:solidFill>
            <a:gradFill rotWithShape="1">
              <a:gsLst>
                <a:gs pos="0">
                  <a:schemeClr val="phClr">
                    <a:lumMod val="110000"/>
                    <a:satMod val="105000"/>
                    <a:tint val="67000"/>
                  </a:schemeClr>
                </a:gs>
                <a:gs pos="50000">
                  <a:schemeClr val="phClr">
                    <a:lumMod val="105000"/>
                    <a:satMod val="103000"/>
                    <a:tint val="73000"/>
                  </a:schemeClr>
                </a:gs>
                <a:gs pos="100000">
                  <a:schemeClr val="phClr">
                    <a:lumMod val="105000"/>
                    <a:satMod val="109000"/>
                    <a:tint val="81000"/>
                  </a:schemeClr>
                </a:gs>
              </a:gsLst>
              <a:lin ang="5400000" scaled="0"/>
            </a:gradFill>
            <a:gradFill rotWithShape="1">
              <a:gsLst>
                <a:gs pos="0">
                  <a:schemeClr val="phClr">
                    <a:satMod val="103000"/>
                    <a:lumMod val="102000"/>
                    <a:tint val="94000"/>
                  </a:schemeClr>
                </a:gs>
                <a:gs pos="50000">
                  <a:schemeClr val="phClr">
                    <a:satMod val="110000"/>
                    <a:lumMod val="100000"/>
                    <a:shade val="100000"/>
                  </a:schemeClr>
                </a:gs>
                <a:gs pos="100000">
                  <a:schemeClr val="phClr">
                    <a:lumMod val="99000"/>
                    <a:satMod val="120000"/>
                    <a:shade val="78000"/>
                  </a:schemeClr>
                </a:gs>
              </a:gsLst>
              <a:lin ang="5400000" scaled="0"/>
            </a:gradFill>
          </a:fillStyleLst>
          <a:lnStyleLst>
            <a:ln w="6350" cap="flat" cmpd="sng" algn="ctr">
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
            <a:ln w="19050" cap="flat" cmpd="sng" algn="ctr">
              <a:solidFill>
                <a:schemeClr val="phClr"/>
              </a:solidFill>
              <a:prstDash val="solid"/>
              <a:miter lim="800000"/>
            </a:ln>
          </a:lnStyleLst>
          <a:effectStyleLst>
            <a:effectStyle>
              <a:effectLst/>
            </a:effectStyle>
            <a:effectStyle>
              <a:effectLst/>
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
      <a:extraClrSchemeLst/>
      <a:extLst>
        <a:ext uri="{05A4C25C-085E-4340-85A3-A5531E510DB2}">
          <thm15:themeFamily xmlns:thm15="http://schemas.microsoft.com/office/thememl/2012/main" name="Office Theme" id="{62F939B6-93AF-4DB8-9C6B-D6C7DFDC589F}" vid="{4A3C46E8-61CC-4603-A589-7422A47A8E4A}"/>
        </a:ext>
      </a:extLst>
    </a:theme>`,

  'xl/worksheets/_rels/sheet1.xml.rels': `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
    <Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">
      <Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/drawing" Target="../drawings/drawing1.xml"/>
    </Relationships>`,
  'xl/worksheets/sheet1.xml': `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
    <worksheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main"
      xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships"
      xmlns:mc="http://schemas.openxmlformats.org/markup-compatibility/2006" mc:Ignorable="x14ac xr xr2 xr3"
      xmlns:x14ac="http://schemas.microsoft.com/office/spreadsheetml/2009/9/ac"
      xmlns:xr="http://schemas.microsoft.com/office/spreadsheetml/2014/revision"
      xmlns:xr2="http://schemas.microsoft.com/office/spreadsheetml/2015/revision2"
      xmlns:xr3="http://schemas.microsoft.com/office/spreadsheetml/2016/revision3" xr:uid="{9B2CBB7B-9BFB-4EF9-A18C-0B0DED5460D3}">
      <dimension ref="A1:D5"/>
      <sheetViews>
        {large}
      </sheetViews>
      <sheetFormatPr defaultRowHeight="13.9" x14ac:dyDescent="0.4"/>
      {size}
      {children}
      <phoneticPr fontId="0" type="noConversion"/>
      <pageMargins left="0.7" right="0.7" top="0.75" bottom="0.75" header="0.3" footer="0.3"/>
    </worksheet>`,

  'xl/sharedStrings.xml': `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
    <sst xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main" count="4" uniqueCount="3">
      <si>
        <t>large text</t>
      </si>
      <si>
        <t>1a</t>
      </si>
    </sst>`,
  'xl/styles.xml': `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
    <styleSheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main"
      xmlns:mc="http://schemas.openxmlformats.org/markup-compatibility/2006" mc:Ignorable="x14ac x16r2 xr"
      xmlns:x14ac="http://schemas.microsoft.com/office/spreadsheetml/2009/9/ac"
      xmlns:x16r2="http://schemas.microsoft.com/office/spreadsheetml/2015/02/main"
      xmlns:xr="http://schemas.microsoft.com/office/spreadsheetml/2014/revision">
      {children}
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
    </styleSheet>`,
  'xl/workbook.xml': `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
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
      <workbookView xWindow="-98" yWindow="-98" windowWidth="19396" windowHeight="11475" {size} xr2:uid="{11AE31A3-10C3-4738-A21D-56F9E9832A43}"/>
      </bookViews>
      <sheets>
        {children}
      </sheets>
      {large}
      <calcPr calcId="191029"/>
      <extLst>
        <ext uri="{140A7094-0E35-4892-8432-C4D2E57EDEB5}"
          xmlns:x15="http://schemas.microsoft.com/office/spreadsheetml/2010/11/main">
          <x15:workbookPr chartTrackingRefBase="1"/>
        </ext>
      </extLst>
    </workbook>`,

  '[Content_Types].xml': `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
    <Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types">
      <Default Extension="jpeg" ContentType="image/jpeg"/>
      <Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/>
      <Default Extension="xml" ContentType="application/xml"/>
      <Override PartName="/xl/workbook.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet.main+xml"/>
      {children}
      <Override PartName="/xl/theme/theme1.xml" ContentType="application/vnd.openxmlformats-officedocument.theme+xml"/>
      <Override PartName="/xl/styles.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.styles+xml"/>
      <Override PartName="/xl/sharedStrings.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.sharedStrings+xml"/>
      <Override PartName="/docProps/core.xml" ContentType="application/vnd.openxmlformats-package.core-properties+xml"/>
      <Override PartName="/docProps/app.xml" ContentType="application/vnd.openxmlformats-officedocument.extended-properties+xml"/>
    </Types>`,
} as const;
