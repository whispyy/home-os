import styled from 'styled-components';
import type { Link } from '../../types/config';
import { theme } from '../../styles/theme';

interface Props {
  link: Link;
  onClick: () => void;
  size?: 'normal' | 'large';
}

export default function AppIcon({ link, onClick, size = 'normal' }: Props) {
  return (
    <Wrapper onClick={onClick} size={size}>
      <IconBox size={size}>{link.icon ?? '🔗'}</IconBox>
      <Label>{link.label}</Label>
    </Wrapper>
  );
}

const Wrapper = styled.div<{ size: 'normal' | 'large' }>`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 5px;
  cursor: pointer;
  width: ${(p) => (p.size === 'large' ? '72px' : '60px')};

  &:active > div {
    opacity: 0.7;
    transform: scale(0.92);
  }
`;

const IconBox = styled.div<{ size: 'normal' | 'large' }>`
  width: ${(p) => (p.size === 'large' ? '60px' : '52px')};
  height: ${(p) => (p.size === 'large' ? '60px' : '52px')};
  border-radius: ${(p) => (p.size === 'large' ? '16px' : '14px')};
  background: linear-gradient(135deg, #2a3a5e, #1a2a4a);
  border: 1px solid ${theme.colors.border};
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: ${(p) => (p.size === 'large' ? '28px' : '24px')};
  box-shadow: ${theme.shadow.icon};
  transition: opacity 0.1s, transform 0.1s;
`;

const Label = styled.span`
  font-size: 10px;
  color: ${theme.colors.text};
  text-align: center;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.6);
  max-width: 60px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;
