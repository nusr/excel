import styled, { withTheme } from "styled-components";
export const BaseEditor = styled.input`
  height: 100%;
  width: 100%;
  padding: 0 4px;
  margin: 0;
  border: none;
  border-radius: unset;
  outline: none;
  font: inherit;
  overflow: hidden;
`;

export const CellEditorContent = withTheme(styled(BaseEditor)`
  /* display: none; */
  position: absolute;
  left: 0;
  top: 0;
  border: 1px solid ${({ theme }) => theme.primaryColor};
  border-radius: 2px;
  background-color: #fff;
  box-sizing: border-box;
`);
