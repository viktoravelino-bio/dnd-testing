import styled from 'styled-components';

export const Container = styled.div.attrs({})`
  background-color: #e0e0e0;
  height: 800px;
  width: 300px;
  border-radius: 8px;
  box-shadow: 1px 1px 5px 1px rgba(0, 0, 0, 0.3);
  flex-shrink: 0;
  overflow: hidden;
  /* border: 2px solid red; */
  /* cursor: grab; */
`;

export const Header = styled.header.attrs({})`
  background-color: #f5f5f5;
  padding: 10px;
  font-size: 1.2rem;
  font-weight: bold;

  color: ${props => props.status === "Todo" && "#2a2a2a"};
  color: ${props => props.status === "In Progress" && "#6a329f"};
  color: ${props => props.status === "Testing" && "#3d85c6"};
  color: ${props => props.status === "Done" && "#008000"};
`;

export const List = styled.ul.attrs({})`
  list-style: none!important;
  display: flex;
  flex-direction: column;
  gap: 20px;
  padding: 10px;
  position: relative;
  z-index: 1;
`;