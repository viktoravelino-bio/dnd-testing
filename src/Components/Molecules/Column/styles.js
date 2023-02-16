import styled from 'styled-components';

export const Container = styled.div.attrs({})`
  background-color: #e0e0e0;
  height: 800px;
  width: 300px;
  border-radius: 8px;
  box-shadow: 1px 1px 5px 1px rgba(0, 0, 0, 0.3);
  overflow: hidden;
  flex-shrink: 0;
`;

const color_map = {
  Todo: '#2a2a2a',
  'In Progress': '#6a329f',
  Testing: '#3d85c6',
  Done: '#008000',
};

export const Header = styled.header.attrs({})`
  background-color: #f5f5f5;
  padding: 10px;
  font-size: 1.2rem;
  font-weight: bold;
  color: ${(props) => color_map[props.status]};
  display: flex;
  justify-content: space-between;
`;

export const List = styled.ul.attrs({})`
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: 20px;
  padding: 10px;
`;

export const AddButton = styled.button.attrs({})`
  border: none;
  background-color: transparent;
  font-size: 1.4rem;
  padding: 0.5rem;
  line-height: 0.7;
  /* height: ; */
  border-radius: 100%;
  cursor: pointer;

  transition: background-color 0.1s ease-in-out;

  &:hover {
    background-color: rgba(0, 0, 0, 0.1);
  }
`;
