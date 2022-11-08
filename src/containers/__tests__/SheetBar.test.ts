// import { SheetBarContainer } from '..';
// import { render } from '@/react';

// describe('SheetBarContainer.test.ts', () => {
//   test('normal', () => {
//     const dom = render(
//       document.body,
//       SheetBarContainer({
//         currentSheetId: '',
//         sheetList: [],
//         addSheet() {},
//         setCurrentSheetId() {},
//       }),
//     );
//     expect(dom.childNodes).toHaveLength(2);
//     expect(dom.querySelector('.sheet-bar-list')!.childNodes).toHaveLength(0);
//   });
//   test('add sheet', () => {
//     const dom = render(
//       document.body,
//       SheetBarContainer({
//         currentSheetId: 'test',
//         sheetList: [{
//           sheetId: 'test',
//           name: 'test',
//           rowCount: 20,
//           colCount: 20,
//         }],
//         addSheet() {},
//         setCurrentSheetId() {},
//       }),
//     );

//     expect(dom.querySelector('.sheet-bar-list')!.childNodes).toHaveLength(1);
//   });
// });
