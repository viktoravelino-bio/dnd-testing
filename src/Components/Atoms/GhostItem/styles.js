import styled from 'styled-components';

export const Container = styled.button.attrs({})`
  background-color: #f5f5f5;
  color: #2a2a2a;
  border-radius: 4px;
  padding: 10px;
  box-shadow: 0 0 3px 0px rgba(0, 0, 0, 0.2);
  cursor: pointer;
  text-align: left;
  opacity: 0.7;
  border: 1px dashed #2a2a2a;
  /* position: relative; */
  /* z-index: 2; */
  width: 100%;
  height: 3.5rem;

  &:hover {
    opacity: 1;
  }
;`;