import React, { useRef, useState } from 'react';
import styled from 'styled-components';
import { X, Download, Upload, RotateCcw, Plus, Trash2 } from 'lucide-react';
import { useOS } from '../../context/OSContext';
import { exportConfig, importConfig } from '../../utils/config';
import { DEMO_CONFIG } from '../../types/config';
import { theme } from '../../styles/theme';

interface Props {
  onClose: () => void;
}

type Tab = 'appearance' | 'links' | 'config';

export default function SettingsPanel({ onClose }: Props) {
  const { config, dispatch } = useOS();
  const [tab, setTab] = useState<Tab>('links');
  const [newCatName, setNewCatName] = useState('');
  const [newLink, setNewLink] = useState({ categoryId: '', label: '', url: '', icon: '' });
  const [importError, setImportError] = useState('');
  const fileRef = useRef<HTMLInputElement>(null);

  function handleImport(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    importConfig(file)
      .then((cfg) => {
        dispatch({ type: 'IMPORT_CONFIG', config: cfg });
        setImportError('');
      })
      .catch((err) => setImportError(err.message));
  }

  function addCategory() {
    if (!newCatName.trim()) return;
    dispatch({ type: 'ADD_CATEGORY', name: newCatName.trim() });
    setNewCatName('');
  }

  function addLink() {
    if (!newLink.categoryId || !newLink.label.trim() || !newLink.url.trim()) return;
    dispatch({
      type: 'ADD_LINK',
      categoryId: newLink.categoryId,
      link: { label: newLink.label.trim(), url: newLink.url.trim(), icon: newLink.icon || undefined },
    });
    setNewLink({ ...newLink, label: '', url: '', icon: '' });
  }

  return (
    <Overlay onClick={onClose}>
      <Panel onClick={(e) => e.stopPropagation()}>
        <PanelHeader>
          <PanelTitle>Settings</PanelTitle>
          <CloseBtn onClick={onClose}><X size={16} /></CloseBtn>
        </PanelHeader>

        <Tabs>
          {(['links', 'appearance', 'config'] as Tab[]).map((t) => (
            <TabBtn key={t} active={tab === t} onClick={() => setTab(t)}>
              {t.charAt(0).toUpperCase() + t.slice(1)}
            </TabBtn>
          ))}
        </Tabs>

        <PanelContent>
          {tab === 'appearance' && (
            <Section>
              <Label>Wallpaper color</Label>
              <Row>
                <ColorInput
                  type="color"
                  value={config.wallpaper.startsWith('#') ? config.wallpaper : '#1a1a2e'}
                  onChange={(e) => dispatch({ type: 'SET_WALLPAPER', wallpaper: e.target.value })}
                />
                <TextInput
                  value={config.wallpaper}
                  onChange={(e) => dispatch({ type: 'SET_WALLPAPER', wallpaper: e.target.value })}
                  placeholder="#1a1a2e or image URL"
                />
              </Row>
              <Label>Taskbar color</Label>
              <Row>
                <ColorInput
                  type="color"
                  value={config.taskbarColor.startsWith('#') ? config.taskbarColor : '#0f0f23'}
                  onChange={(e) => dispatch({ type: 'SET_TASKBAR_COLOR', color: e.target.value })}
                />
                <TextInput
                  value={config.taskbarColor}
                  onChange={(e) => dispatch({ type: 'SET_TASKBAR_COLOR', color: e.target.value })}
                  placeholder="#0f0f23"
                />
              </Row>
            </Section>
          )}

          {tab === 'links' && (
            <Section>
              <Label>Add category</Label>
              <Row>
                <TextInput
                  placeholder="Category name"
                  value={newCatName}
                  onChange={(e) => setNewCatName(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && addCategory()}
                />
                <ActionBtn onClick={addCategory}><Plus size={14} /> Add</ActionBtn>
              </Row>

              <Label style={{ marginTop: 16 }}>Add link</Label>
              <Select
                value={newLink.categoryId}
                onChange={(e) => setNewLink({ ...newLink, categoryId: e.target.value })}
              >
                <option value="">Select category...</option>
                {config.categories.map((c) => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </Select>
              <TextInput
                placeholder="Label"
                value={newLink.label}
                onChange={(e) => setNewLink({ ...newLink, label: e.target.value })}
                style={{ marginTop: 6 }}
              />
              <TextInput
                placeholder="URL (https://...)"
                value={newLink.url}
                onChange={(e) => setNewLink({ ...newLink, url: e.target.value })}
                style={{ marginTop: 6 }}
              />
              <TextInput
                placeholder="Icon (emoji, e.g. 🔧)"
                value={newLink.icon}
                onChange={(e) => setNewLink({ ...newLink, icon: e.target.value })}
                style={{ marginTop: 6 }}
              />
              <ActionBtn onClick={addLink} style={{ marginTop: 8 }}><Plus size={14} /> Add link</ActionBtn>

              <CategoryList>
                {config.categories.map((cat) => (
                  <CategoryItem key={cat.id}>
                    <CatHeader>
                      <CatName>{cat.name}</CatName>
                      <DangerBtn onClick={() => dispatch({ type: 'REMOVE_CATEGORY', categoryId: cat.id })}>
                        <Trash2 size={13} />
                      </DangerBtn>
                    </CatHeader>
                    {cat.links.map((link) => (
                      <LinkRow key={link.id}>
                        <span>{link.icon ?? '🔗'}</span>
                        <LinkText>
                          <strong>{link.label}</strong>
                          <small>{link.url}</small>
                        </LinkText>
                        <DangerBtn onClick={() => dispatch({ type: 'ADD_SHORTCUT', linkId: link.id, position: { x: 80, y: 80 } })}>
                          📌
                        </DangerBtn>
                        <DangerBtn onClick={() => dispatch({ type: 'REMOVE_LINK', categoryId: cat.id, linkId: link.id })}>
                          <Trash2 size={13} />
                        </DangerBtn>
                      </LinkRow>
                    ))}
                  </CategoryItem>
                ))}
              </CategoryList>
            </Section>
          )}

          {tab === 'config' && (
            <Section>
              <ActionBtn onClick={() => exportConfig(config)}>
                <Download size={14} /> Export config
              </ActionBtn>
              <input ref={fileRef} type="file" accept=".json" style={{ display: 'none' }} onChange={handleImport} />
              <ActionBtn onClick={() => fileRef.current?.click()} style={{ marginTop: 8 }}>
                <Upload size={14} /> Import config
              </ActionBtn>
              {importError && <ErrorText>{importError}</ErrorText>}
              <Divider />
              <DangerBtn
                style={{ padding: '8px 12px', borderRadius: theme.radius.md, width: '100%' }}
                onClick={() => { if (confirm('Reset to demo config?')) dispatch({ type: 'IMPORT_CONFIG', config: DEMO_CONFIG }); }}
              >
                <RotateCcw size={14} /> Reset to defaults
              </DangerBtn>
            </Section>
          )}
        </PanelContent>
      </Panel>
    </Overlay>
  );
}

const Overlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,0.4);
  z-index: 1500;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const Panel = styled.div`
  width: 480px;
  max-height: 80vh;
  background: ${theme.colors.surface};
  border: 1px solid ${theme.colors.border};
  border-radius: ${theme.radius.lg};
  box-shadow: ${theme.shadow.window};
  display: flex;
  flex-direction: column;
  overflow: hidden;
`;

const PanelHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 20px;
  border-bottom: 1px solid ${theme.colors.border};
  flex-shrink: 0;
`;

const PanelTitle = styled.h2`
  font-size: ${theme.font.size.lg};
  font-weight: 600;
`;

const CloseBtn = styled.button`
  display: flex;
  align-items: center;
  padding: 4px;
  border-radius: ${theme.radius.sm};
  color: ${theme.colors.textMuted};
  &:hover { background: ${theme.colors.surfaceHover}; color: ${theme.colors.text}; }
`;

const Tabs = styled.div`
  display: flex;
  padding: 8px 12px;
  gap: 4px;
  border-bottom: 1px solid ${theme.colors.border};
  flex-shrink: 0;
`;

const TabBtn = styled.button<{ active: boolean }>`
  padding: 6px 14px;
  border-radius: ${theme.radius.md};
  font-size: ${theme.font.size.sm};
  background: ${(p) => (p.active ? theme.colors.accent : 'transparent')};
  color: ${(p) => (p.active ? '#fff' : theme.colors.textMuted)};
  transition: background 0.15s, color 0.15s;
  &:hover { background: ${(p) => (p.active ? theme.colors.accentHover : theme.colors.surfaceHover)}; color: ${theme.colors.text}; }
`;

const PanelContent = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: 16px 20px;
`;

const Section = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

const Label = styled.label`
  font-size: ${theme.font.size.sm};
  color: ${theme.colors.textMuted};
  margin-bottom: 4px;
`;

const Row = styled.div`
  display: flex;
  gap: 8px;
  align-items: center;
`;

const TextInput = styled.input`
  flex: 1;
  width: 100%;
  background: ${theme.colors.bg};
  border: 1px solid ${theme.colors.border};
  border-radius: ${theme.radius.md};
  padding: 7px 10px;
  font-size: ${theme.font.size.sm};
  color: ${theme.colors.text};
  outline: none;
  &:focus { border-color: ${theme.colors.accent}; }
`;

const ColorInput = styled.input`
  width: 36px;
  height: 34px;
  border: 1px solid ${theme.colors.border};
  border-radius: ${theme.radius.sm};
  background: none;
  cursor: pointer;
  padding: 2px;
`;

const Select = styled.select`
  width: 100%;
  background: ${theme.colors.bg};
  border: 1px solid ${theme.colors.border};
  border-radius: ${theme.radius.md};
  padding: 7px 10px;
  font-size: ${theme.font.size.sm};
  color: ${theme.colors.text};
  outline: none;
`;

const ActionBtn = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 7px 14px;
  background: ${theme.colors.accent};
  color: #fff;
  border-radius: ${theme.radius.md};
  font-size: ${theme.font.size.sm};
  transition: background 0.15s;
  &:hover { background: ${theme.colors.accentHover}; }
`;

const DangerBtn = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  color: ${theme.colors.danger};
  padding: 4px;
  border-radius: ${theme.radius.sm};
  font-size: ${theme.font.size.sm};
  &:hover { background: rgba(224,92,92,0.1); }
`;

const CategoryList = styled.div`
  margin-top: 16px;
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const CategoryItem = styled.div`
  background: ${theme.colors.bg};
  border: 1px solid ${theme.colors.border};
  border-radius: ${theme.radius.md};
  overflow: hidden;
`;

const CatHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 8px 12px;
  background: ${theme.colors.surfaceHover};
`;

const CatName = styled.span`
  font-size: ${theme.font.size.sm};
  font-weight: 600;
`;

const LinkRow = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 7px 12px;
  border-top: 1px solid ${theme.colors.border};
`;

const LinkText = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  min-width: 0;
  strong { font-size: ${theme.font.size.sm}; }
  small { font-size: ${theme.font.size.xs}; color: ${theme.colors.textMuted}; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
`;

const Divider = styled.div`
  height: 1px;
  background: ${theme.colors.border};
  margin: 12px 0;
`;

const ErrorText = styled.p`
  color: ${theme.colors.danger};
  font-size: ${theme.font.size.sm};
`;
