import styled from 'styled-components';

const PageWrapper = styled.div`
  ${({ theme }) => theme.flex.center}
  flex-direction: column;
  gap: 20px;

  width: calc(100vw-'48px');

  margin: 50px 24px;
`;

export default PageWrapper;
