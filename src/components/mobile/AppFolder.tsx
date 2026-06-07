import styled, { keyframes } from 'styled-components';
import { X } from 'lucide-react';
import type { Category } from '../../types/config';
import { theme } from '../../styles/theme';
import AppIcon from './AppIcon';

interface Props {
  category: Category;
  onClose: () => void;
}

export default function AppFolder({ category, onClose }: Props) {
  return (
    <Overlay onClick={onClose}>
      <Sheet onClick={(e) => e.stopPropagation()}>
        <SheetHeader>
          <FolderTitle>{category.name}</FolderTitle>
          <CloseBtn onClick={onClose}>
            <X size={18} />
          </CloseBtn>
        </SheetHeader>
        <IconGrid>
          {category.links.map((link) => (
            <AppIcon
              key={link.id}
              link={link}
              size="large"
              onClick={() => {
                window.open(link.url, '_blank');
                onClose();
              }}
            />
          ))}
        </IconGrid>
      </Sheet>
    </Overlay>
  );
}

const fadeIn = keyframes`
  from { opacity: 0; }
  to { opacity: 1; }
`;

const slideUp = keyframes`
  from { transform: translateY(40px); opacity: 0; }
  to { transform: translateY(0); opacity: 1; }
`;

const Overlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.6);
  backdrop-filter: blur(8px);
  z-index: 500;
  display: flex;
  align-items: flex-end;
  animation: ${fadeIn} 0.2s ease;
`;

const Sheet = styled.div`
  width: 100%;
  background: rgba(30, 34, 51, 0.95);
  border-radius: ${theme.radius.xl} ${theme.radius.xl} 0 0;
  padding: 20px 20px 40px;
  animation: ${slideUp} 0.25s ease;
`;

const SheetHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 20px;
`;

const FolderTitle = styled.h2`
  font-size: 18px;
  font-weight: 600;
  color: ${theme.colors.text};
`;

const CloseBtn = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: ${theme.colors.surfaceHover};
  color: ${theme.colors.textMuted};
`;

const IconGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 16px 8px;
  justify-items: center;
`;
