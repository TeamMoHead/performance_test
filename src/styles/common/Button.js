import styled from 'styled-components';

const Button = styled.button`
  padding: 10px 20px;
  margin-bottom: 5px;
  border-radius: ${({ theme }) => theme.radius.small};

  color: black;

  cursor: pointer;
`;

export default Button;
