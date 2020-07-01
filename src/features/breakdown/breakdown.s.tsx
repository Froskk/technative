import styled from "styled-components";

type Props = {
  height: number;
  width: number;
  ref: any;
};

export const Container = styled.section`
  position: relative;
`;

export const Table = styled.ul`
  width: 80vw;
  height: 450px;

  list-style: none;
  padding: 0;

  text-transform: uppercase;
  color: white;
  font-size: ${(p) => p.theme.font.medium};
  font-weight: bold;

  overflow-x: hidden;

  position: relative;
  z-index: 1;
`;

export const Row = styled.li`
  display: flex;
  flex-direction: row;
  flex-wrap: nowrap;

  background: ${(p) => p.theme.color.table.dark};

  /* gsap FOUC fix */
  visibility: hidden;

  &:first-child {
    background: ${(p) => p.theme.color.table.accent};
    font-size: ${(p) => p.theme.font.small};
    font-style: italic;
  }

  &:nth-child(even) {
    background: ${(p) => p.theme.color.table.light};
  }

  &::before {
    position: absolute;
    content: "";
    width: 60px;
    height: 50px;
    left: -59px;
  }

  &:nth-child(even)::before {
    background: linear-gradient(to left, hsla(0, 0%, 16%, 1), hsla(0, 0%, 16%, 0))};
  }

  &:nth-child(odd)::before {
    background: linear-gradient(to left, hsla(0, 0%, 0%, 1), hsla(0, 0%, 0%, 0))};
  }
  
  &:first-child::before {
    background: linear-gradient(to left, hsla(4, 77%, 48%, 1), hsla(4, 77%, 48%, 0))};
  }
`;

const RowItem = styled.div`
  padding: 1rem;
`;

export const Position = styled(RowItem)`
  width: 3rem;
  text-align: center;
`;

export const Driver = styled(RowItem)`
  flex: 1;
`;

export const Score = styled(RowItem)`
  width: 6rem;
  text-align: center;
`;

export const Canvas = styled.svg<Props>`
  position: absolute;
  top: 50px;
  left: 0;
  width: ${(p) => p.width};
  height: ${(p) => p.height};

  z-index: 0;
  visibility: hidden;
`;
