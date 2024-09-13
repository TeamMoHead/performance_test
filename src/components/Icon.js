import React from 'react';
import styled from 'styled-components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faMusic,
  faSpinner,
  faVolumeMute,
} from '@fortawesome/free-solid-svg-icons';

const iconList = {
  loading: faSpinner,
  musicOff: faVolumeMute,
  musicOn: faMusic,
};

const iconStyleSample = {
  size: 24,
  color: 'purple',
  hoverColor: 'white',
};

const Icon = ({ icon, iconStyle }) => {
  return (
    <IconWrapper $iconStyle={iconStyle}>
      {typeof iconList[icon] === 'string' ? (
        <img
          src={iconList[icon]}
          alt={icon}
          style={{ width: `${iconStyle.size}px`, fill: `${iconStyle.color}` }}
        />
      ) : (
        <FontAwesomeIcon icon={iconList[icon]} />
      )}
    </IconWrapper>
  );
};

export default Icon;

const IconWrapper = styled.div`
  z-index: 100;
  width: auto;
  padding: 5px;

  color: ${({ $iconStyle, theme }) =>
    !$iconStyle.color
      ? theme.colors.neutral.gray
      : $iconStyle.color === 'red'
        ? theme.colors.system.red
        : theme.colors.primary[$iconStyle.color]};
  opacity: 1;

  font-size: ${({ $iconStyle }) =>
    $iconStyle.size ? `${$iconStyle.size}px` : '16px'};

  &:hover {
    color: ${({ theme, $iconStyle }) =>
      $iconStyle.hoverColor
        ? theme.colors.primary[$iconStyle.hoverColor]
        : theme.colors.primary.emerald};
  }
`;
