import { useState, useRef, useEffect } from 'react';
import styled from 'styled-components';
import { Search } from 'lucide-react';
import { useOS } from '../../context/OSContext';
import { useWindows } from '../../context/WindowContext';
import type { Link } from '../../types/config';
import { theme } from '../../styles/theme';

interface Props {
  onClose: () => void;
}

export default function StartMenu({ onClose }: Props) {
  const { config } = useOS();
  const { openWindow } = useWindows();
  const [query, setQuery] = useState('');
  const searchRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    searchRef.current?.focus();
  }, []);

  const filtered = config.categories
    .map((cat) => ({
      ...cat,
      links: cat.links.filter(
        (l) =>
          !query ||
          l.label.toLowerCase().includes(query.toLowerCase()) ||
          l.url.toLowerCase().includes(query.toLowerCase())
      ),
    }))
    .filter((cat) => cat.links.length > 0);

  function handleLink(link: Link) {
    openWindow(link.id, link.label, link.url, link.icon);
    onClose();
  }

  return (
    <Overlay onClick={onClose}>
      <Menu onClick={(e) => e.stopPropagation()}>
        <SearchRow>
          <Search size={14} color={theme.colors.textMuted} />
          <SearchInput
            ref={searchRef}
            placeholder="Search apps..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </SearchRow>
        <LinkList>
          {filtered.length === 0 ? (
            <Empty>No results</Empty>
          ) : (
            filtered.map((cat) => (
              <CategorySection key={cat.id}>
                <CategoryLabel>{cat.name}</CategoryLabel>
                {cat.links.map((link) => (
                  <LinkItem key={link.id} onClick={() => handleLink(link)}>
                    <LinkIcon>{link.icon ?? '🔗'}</LinkIcon>
                    <LinkLabel>{link.label}</LinkLabel>
                    <LinkUrl>{link.url}</LinkUrl>
                  </LinkItem>
                ))}
              </CategorySection>
            ))
          )}
        </LinkList>
      </Menu>
    </Overlay>
  );
}

const Overlay = styled.div`
  position: fixed;
  inset: 0;
  bottom: ${theme.taskbarHeight};
  z-index: 1000;
`;

const Menu = styled.div`
  position: absolute;
  bottom: 0;
  left: 8px;
  width: 340px;
  max-height: 520px;
  background: ${theme.colors.surface};
  border: 1px solid ${theme.colors.border};
  border-radius: ${theme.radius.lg};
  box-shadow: ${theme.shadow.menu};
  display: flex;
  flex-direction: column;
  overflow: hidden;
`;

const SearchRow = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 16px;
  border-bottom: 1px solid ${theme.colors.border};
  flex-shrink: 0;
`;

const SearchInput = styled.input`
  flex: 1;
  background: none;
  border: none;
  outline: none;
  font-size: ${theme.font.size.md};
  color: ${theme.colors.text};

  &::placeholder {
    color: ${theme.colors.textMuted};
  }
`;

const LinkList = styled.div`
  overflow-y: auto;
  flex: 1;
  padding: 8px 0;
`;

const CategorySection = styled.div`
  margin-bottom: 4px;
`;

const CategoryLabel = styled.div`
  padding: 6px 16px;
  font-size: ${theme.font.size.xs};
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: ${theme.colors.textMuted};
`;

const LinkItem = styled.button`
  width: 100%;
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 8px 16px;
  transition: background 0.1s;
  text-align: left;

  &:hover {
    background: ${theme.colors.surfaceHover};
  }
`;

const LinkIcon = styled.span`
  font-size: 16px;
  width: 24px;
  text-align: center;
  flex-shrink: 0;
`;

const LinkLabel = styled.span`
  font-size: ${theme.font.size.md};
  color: ${theme.colors.text};
  flex-shrink: 0;
`;

const LinkUrl = styled.span`
  font-size: ${theme.font.size.xs};
  color: ${theme.colors.textMuted};
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

const Empty = styled.div`
  padding: 24px;
  text-align: center;
  color: ${theme.colors.textMuted};
  font-size: ${theme.font.size.md};
`;
