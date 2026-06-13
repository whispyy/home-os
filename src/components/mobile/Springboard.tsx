import { useState } from 'react';
import styled from 'styled-components';
import { useOS } from '../../context/OSContext';
import type { Category } from '../../types/config';
import { theme } from '../../styles/theme';
import AppIcon from './AppIcon';
import AppFolder from './AppFolder';
import MobileWidgetStrip from './MobileWidgetStrip';
import SettingsPanel from '../shared/SettingsPanel';

export default function Springboard() {
  const { config } = useOS();
  const [openFolder, setOpenFolder] = useState<Category | null>(null);
  const [settingsOpen, setSettingsOpen] = useState(false);

  // Shortcuts as individual icons + categories as folders
  const shortcuts = config.shortcuts
    .map((s) => {
      for (const cat of config.categories) {
        const link = cat.links.find((l) => l.id === s.linkId);
        if (link) return link;
      }
      return null;
    })
    .filter(Boolean);

  return (
    <Screen style={{ background: config.wallpaper }}>
      <MobileWidgetStrip />
      <Grid>
        {shortcuts.map((link) =>
          link ? (
            <AppIcon
              key={link.id}
              link={link}
              onClick={() => window.open(link.url, '_blank')}
            />
          ) : null
        )}
        {config.categories.map((cat) => (
          <FolderIcon key={cat.id} onClick={() => setOpenFolder(cat)}>
            <FolderBox>
              <MiniGrid>
                {cat.links.slice(0, 4).map((l) => (
                  <MiniIcon key={l.id}>{l.icon ?? '🔗'}</MiniIcon>
                ))}
              </MiniGrid>
            </FolderBox>
            <FolderLabel>{cat.name}</FolderLabel>
          </FolderIcon>
        ))}
        <SettingsIcon onClick={() => setSettingsOpen(true)}>
          <SettingsIconBox>⚙️</SettingsIconBox>
          <SettingsLabel>Settings</SettingsLabel>
        </SettingsIcon>
      </Grid>

      {openFolder && (
        <AppFolder category={openFolder} onClose={() => setOpenFolder(null)} />
      )}

      {settingsOpen && (
        <SettingsPanel onClose={() => setSettingsOpen(false)} />
      )}
    </Screen>
  );
}

const Screen = styled.div`
  position: fixed;
  inset: 0;
  overflow-y: auto;
  padding: 60px 20px 40px;
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 20px 8px;
  justify-items: center;
`;

const FolderIcon = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 5px;
  cursor: pointer;
  width: 60px;

  &:active > div:first-child {
    opacity: 0.7;
    transform: scale(0.92);
  }
`;

const FolderBox = styled.div`
  width: 52px;
  height: 52px;
  border-radius: 14px;
  background: rgba(255, 255, 255, 0.15);
  backdrop-filter: blur(8px);
  border: 1px solid ${theme.colors.border};
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: ${theme.shadow.icon};
  transition: opacity 0.1s, transform 0.1s;
`;

const MiniGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 2px;
  padding: 6px;
`;

const MiniIcon = styled.span`
  font-size: 14px;
  line-height: 1;
`;

const SettingsIcon = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 5px;
  cursor: pointer;
  width: 60px;

  &:active > div:first-child {
    opacity: 0.7;
    transform: scale(0.92);
  }
`;

const SettingsIconBox = styled.div`
  width: 52px;
  height: 52px;
  border-radius: 14px;
  background: linear-gradient(135deg, #2a3a5e, #1a2a4a);
  border: 1px solid ${theme.colors.border};
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
  box-shadow: ${theme.shadow.icon};
  transition: opacity 0.1s, transform 0.1s;
`;

const SettingsLabel = styled.span`
  font-size: 10px;
  color: ${theme.colors.text};
  text-align: center;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.6);
  max-width: 60px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

const FolderLabel = styled.span`
  font-size: 10px;
  color: ${theme.colors.text};
  text-align: center;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.6);
  max-width: 60px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;
