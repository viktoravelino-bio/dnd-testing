import styled from 'styled-components';

export const ListItem = styled.li.attrs({})`
  list-style: none;
  background-color: #f5f5f5;
  border-radius: 4px;
  padding: 10px;
  box-shadow: 0 0 3px 0px rgba(0, 0, 0, 0.2);
  cursor: pointer;

  &:hover {
    box-shadow: 0 0 3px 0px rgba(0, 0, 0, 0.5);
  }

  h3 {
    color: #2a2a2a;
    font-size: 1.2rem;
  }

  p {
    color: #7e7e7e;
    font-size: 0.8rem;
  }
`;