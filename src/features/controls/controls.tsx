import React from "react";
import styled from "styled-components";

const Container = styled.div`
  display: flex;
  justify-content: stretch;
  align-items: center;
`;

const Button = styled.button`
  background-color: #f9a300;
  border: none;
  height: 40px;
  padding: 5px 15px;
  color: #ffffff;
  font-size: 16px;
  font-weight: 300;
  margin-top: 10px;
  margin-right: 10px;
`;

export const Controls = ({ timeline }: any) => {
  return (
    <Container>
      <Button onClick={() => timeline.play()}>Play</Button>
      <Button onClick={() => timeline.resume()}>Resume</Button>
      <Button onClick={() => timeline.pause()}>Pause</Button>
      <Button onClick={() => timeline.reverse()}>Reverse</Button>
    </Container>
  );
};
