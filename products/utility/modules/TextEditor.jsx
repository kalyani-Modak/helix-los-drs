import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useIntl } from 'react-intl'
import { Accordion, AccordionDetails, AccordionSummary, Alert, alpha, Box, Button, Chip, CircularProgress,
  Container, Fade, IconButton, InputAdornment, List, ListItemButton, ListItemText, Paper,
  Stack, TextField, Tooltip, Typography, useTheme, Zoom } from '@mui/material'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import SearchIcon from '@mui/icons-material/Search'
import ClearIcon from '@mui/icons-material/Clear'
import SmsOutlinedIcon from '@mui/icons-material/SmsOutlined'
import ContentCopyIcon from '@mui/icons-material/ContentCopy'
import SaveOutlinedIcon from '@mui/icons-material/SaveOutlined'
import RefreshIcon from '@mui/icons-material/Refresh'
import PublishIcon from '@mui/icons-material/Publish'
import UndoIcon from '@mui/icons-material/Undo'
import { utilityAPI } from './apiEndpoints'
import { idmLayoutColors, idmFontFamily } from './userScreenTokens'
import { HBox, HPaper, HButton, HLabel, HTextField, HAxiosService, useToast } from '@helix/component-library'

function formatEntityPlaceholder(entityCode, attrCode) {
  return '${' + entityCode + '.' + attrCode + '}'
}

function normalizeEntities(payload) {
  if (!Array.isArray(payload)) return []
  const out = []
  for (const block of payload) {
    const ec = String(block?.entityCode ?? '').trim()
    if (!ec) continue
    const ed = String(block?.entityDescription ?? '').trim()
    const rawAttrs = block?.attributes
    const mapped = []
    if (Array.isArray(rawAttrs)) {
      for (const a of rawAttrs) {
        const code = String(a?.code ?? '').trim()
        if (!code) continue
        const desc = String(a?.desc ?? '').trim() || code
        mapped.push({ code, desc })
      }
    }
    out.push({
      entityCode: ec,
      entityDescription: ed || ec,
      attributes: mapped,
    })
  }
  return out
}

function filterEntities(list, query) {
  const s = query.trim().toLowerCase()
  if (!s) return list
  const out = []
  for (const entity of list) {
    const entityMatch =
      entity.entityDescription.toLowerCase().includes(s) || entity.entityCode.toLowerCase().includes(s)
    const attrs = entity.attributes.filter(
      (a) => a.desc.toLowerCase().includes(s) || a.code.toLowerCase().includes(s)
    )
    if (entityMatch) {
      out.push(entity)
    } else if (attrs.length) {
      out.push({ ...entity, attributes: attrs })
    }
  }
  return out
}

const FALLBACK_ENTITIES = [
  {
    entityCode: 'EXAMPLE',
    entityDescription: 'Example',
    attributes: [{ code: 'FIELD', desc: 'Sample field' }],
  },
]

function TextEditor({ templateId: templateIdFromProps }) {
  const theme = useTheme()
  const navigate = useNavigate()
  const toast = useToast()
  const intl = useIntl()
  const { templateId: routeTemplateId, name: legacyRouteName } = useParams()
  const templateId = (templateIdFromProps ?? routeTemplateId ?? legacyRouteName ?? '').trim()

  const textareaRef = useRef(null)
  const [text, setText] = useState('')
  const [template, setTemplate] = useState(null)
  const [entities, setEntities] = useState([])
  const [placeholderSearch, setPlaceholderSearch] = useState('')
  const [expandedManual, setExpandedManual] = useState(() => new Set())

  const [pageLoading, setPageLoading] = useState(true)
  const [textLoading, setTextLoading] = useState(false)
  const [fieldsLoading, setFieldsLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [editorState, setEditorState] = useState(null)
  const [lifecycleBusy, setLifecycleBusy] = useState(null)

  const searchActive = placeholderSearch.trim().length > 0
  const filteredEntities = useMemo(
    () => filterEntities(entities, placeholderSearch),
    [entities, placeholderSearch]
  )

  const loadFields = useCallback(
    async (moduleId, silent) => {
      setFieldsLoading(true)
      try {
        const res = await HAxiosService.GET(utilityAPI.onlyofficeFields(moduleId))
        const list = normalizeEntities(res.data)
        setEntities(list.length ? list : FALLBACK_ENTITIES)
        if (!silent && !list.length) {
          toast.warning(intl.formatMessage({ id: 'utility.textEditor.toast.noMergeFields', defaultMessage: 'No merge fields returned; showing sample list.' }))
        }
      } catch {
        setEntities(FALLBACK_ENTITIES)
        if (!silent) toast.warning(intl.formatMessage({ id: 'utility.textEditor.toast.loadPlaceholdersFailed', defaultMessage: 'Could not load placeholders; using sample list.' }))
      } finally {
        setFieldsLoading(false)
      }
    },
    [toast, intl]
  )

  const loadEditorState = useCallback(
    async (templateId) => {
      try {
        const res = await HAxiosService.GET(utilityAPI.templateEditorState(templateId))
        const ok = (res.data.status || '').toLowerCase() === 'success'
        if (ok && res.data.data) setEditorState(res.data.data)
      } catch {
        /* optional */
      }
    },
    []
  )

  const loadMessageText = useCallback(
    async (templateId) => {
      setTextLoading(true)
      try {
        const res = await HAxiosService.GET(
          utilityAPI.templateTextContent(templateId)
        )
        const ok = (res.data.status || '').toLowerCase() === 'success'
        const content = res.data.data?.content
        if (ok && typeof content === 'string') {
          setText(content)
        } else {
          setText('')
          if (!ok) toast.error(res.data.message || intl.formatMessage({ id: 'utility.textEditor.toast.loadMessageFailed', defaultMessage: 'Could not load message text' }))
        }
      } catch {
        setText('')
        toast.error(intl.formatMessage({ id: 'utility.textEditor.toast.loadMessageFailed', defaultMessage: 'Could not load message text' }))
      } finally {
        setTextLoading(false)
      }
    },
    [toast, intl]
  )

  useEffect(() => {
    if (!templateId) {
      setPageLoading(false)
      return
    }
    let cancelled = false
    ;(async () => {
      setPageLoading(true)
      try {
        const cfgRes = await HAxiosService.GET(utilityAPI.templateConfigById(templateId))
        const ok = (cfgRes.data.status || '').toLowerCase() === 'success'
        const cfg = cfgRes.data.data
        if (cancelled) return
        if (!ok || !cfg) {
          toast.error(cfgRes.data.message || intl.formatMessage({ id: 'utility.textEditor.toast.loadTemplateFailed', defaultMessage: 'Could not load template' }))
          return
        }
        setTemplate(cfg)
        loadEditorState(templateId)

        await Promise.all([
          (async () => {
            if (cancelled) return
            setTextLoading(true)
            try {
              const tr = await HAxiosService.GET(
                utilityAPI.templateTextContent(templateId)
              )
              const tok = (tr.data.status || '').toLowerCase() === 'success'
              const content = tr.data.data?.content
              if (!cancelled && tok && typeof content === 'string') setText(content)
              else if (!cancelled && tok) setText('')
            } catch {
              if (!cancelled) {
                setText('')
                toast.error(intl.formatMessage({ id: 'utility.textEditor.toast.loadMessageFailed', defaultMessage: 'Could not load message text' }))
              }
            } finally {
              if (!cancelled) setTextLoading(false)
            }
          })(),
          (async () => {
            if (cancelled || !cfg.moduleId) {
              setEntities(FALLBACK_ENTITIES)
              return
            }
            setFieldsLoading(true)
            try {
              const fr = await HAxiosService.GET(utilityAPI.onlyofficeFields(cfg.moduleId))
              const list = normalizeEntities(fr.data)
              if (!cancelled) setEntities(list.length ? list : FALLBACK_ENTITIES)
            } catch {
              if (!cancelled) {
                setEntities(FALLBACK_ENTITIES)
                toast.warning(intl.formatMessage({ id: 'utility.textEditor.toast.loadPlaceholdersFailed', defaultMessage: 'Could not load placeholders; using sample list.' }))
              }
            } finally {
              if (!cancelled) setFieldsLoading(false)
            }
          })(),
        ])
      } catch {
        if (!cancelled) toast.error(intl.formatMessage({ id: 'utility.textEditor.toast.loadTemplateFailed', defaultMessage: 'Could not load template' }))
      } finally {
        if (!cancelled) setPageLoading(false)
      }
    })()
    return () => {
      cancelled = true
    }
  }, [templateId, toast, loadEditorState, intl])

  useEffect(() => {
    if (!placeholderSearch.trim()) {
      setExpandedManual(new Set())
    }
  }, [placeholderSearch])

  const insertPlaceholder = useCallback((entityCode, attrCode) => {
    const token = formatEntityPlaceholder(entityCode, attrCode)
    const el = textareaRef.current
    if (!el) {
      setText((prev) => prev + token)
      return
    }
    const current = el.value
    const start = el.selectionStart ?? current.length
    const end = el.selectionEnd ?? current.length
    const next = current.slice(0, start) + token + current.slice(end)
    setText(next)
    const caret = start + token.length
    requestAnimationFrame(() => {
      el.focus()
      el.setSelectionRange(caret, caret)
    })
  }, [])

  const copyText = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(text)
      toast.success(intl.formatMessage({ id: 'utility.textEditor.toast.copySuccess', defaultMessage: 'Text copied to clipboard' }))
    } catch {
      toast.error(intl.formatMessage({ id: 'utility.textEditor.toast.copyFailed', defaultMessage: 'Could not copy text' }))
    }
  }, [text, toast, intl])

  const handleSave = useCallback(async () => {
    if (!templateId) return
    setSaving(true)
    try {
      const res = await HAxiosService.PUT(utilityAPI.templateTextContent(templateId), {
        content: text,
      })
      const ok = (res.data.status || '').toLowerCase() === 'success'
      if (ok) {
        toast.success(res.data.message || intl.formatMessage({ id: 'utility.textEditor.toast.saveSuccess', defaultMessage: 'Draft saved' }))
        await loadEditorState(templateId)
      } else toast.error(res.data.message || intl.formatMessage({ id: 'utility.textEditor.toast.saveFailed', defaultMessage: 'Save failed' }))
    } catch (e) {
      const msg = e?.response?.data?.message
      toast.error(msg || intl.formatMessage({ id: 'utility.textEditor.toast.saveFailed', defaultMessage: 'Save failed' }))
    } finally {
      setSaving(false)
    }
  }, [templateId, text, toast, loadEditorState, intl])

  const handlePublish = useCallback(async () => {
    if (!templateId) return
    setLifecycleBusy('publish')
    try {
      const res = await HAxiosService.POST(`${utilityAPI.templates()}/publish/${encodeURIComponent(templateId)}`)
      const ok = (res.data.status || '').toLowerCase() === 'success'
      if (ok) {
        toast.success(res.data.message || intl.formatMessage({ id: 'utility.textEditor.toast.publishSuccess', defaultMessage: 'Template published' }))
        navigate('/homelayout/templatelist')
      } else toast.error(res.data.message || intl.formatMessage({ id: 'utility.textEditor.toast.publishFailed', defaultMessage: 'Publish failed' }))
    } catch (e) {
      const msg = e?.response?.data?.message
      toast.error(msg || intl.formatMessage({ id: 'utility.textEditor.toast.publishFailed', defaultMessage: 'Publish failed' }))
    } finally {
      setLifecycleBusy(null)
    }
  }, [templateId, toast, navigate, intl])

  const handleDiscard = useCallback(async () => {
    if (!templateId) return
    setLifecycleBusy('discard')
    try {
      const res = await HAxiosService.POST(utilityAPI.discardDraft(templateId))
      const ok = (res.data.status || '').toLowerCase() === 'success'
      if (ok) {
        toast.success(res.data.message || intl.formatMessage({ id: 'utility.textEditor.toast.discardSuccess', defaultMessage: 'Draft discarded' }))
        navigate('/homelayout/templatelist')
      } else toast.error(res.data.message || intl.formatMessage({ id: 'utility.textEditor.toast.discardFailed', defaultMessage: 'Discard failed' }))
    } catch (e) {
      const msg = e?.response?.data?.message
      toast.error(msg || intl.formatMessage({ id: 'utility.textEditor.toast.discardFailed', defaultMessage: 'Discard failed' }))
    } finally {
      setLifecycleBusy(null)
    }
  }, [templateId, toast, navigate, intl])

  const handleRefreshMessage = useCallback(() => {
    if (!templateId) return
    loadMessageText(templateId)
  }, [templateId, loadMessageText])

  const handleRefreshPlaceholders = useCallback(() => {
    if (template?.moduleId) loadFields(template.moduleId, true)
    else toast.warning(intl.formatMessage({ id: 'utility.textEditor.toast.moduleUnavailable', defaultMessage: 'Template module is not available' }))
  }, [template?.moduleId, loadFields, toast, intl])

  if (pageLoading) {
    return (
      <HBox
        sx={{
          minHeight: 'calc(100vh - 64px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <CircularProgress sx={{ color: theme.palette.text.primary }} />
      </HBox>
    )
  }

  return (
    <HBox
      sx={{
        height: 'calc(100vh - 64px)',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        boxSizing: 'border-box',
      }}
    >
      <HPaper
        elevation={2}
        sx={{
          borderRadius: '16px',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
          flex: 1,
          minHeight: 0,
        }}
      >
        <HBox
          sx={{
            px: 3,
            py: 1.5,
            backgroundSize: '300% 300%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: 1.5,
            background: "var(--drs-button-outline-bg, transparent)",
          }}
        >
          <Stack direction="row" alignItems="center" spacing={1.5} flexWrap="wrap" sx={{ flex: 1, minWidth: 0 }}>
            <IconButton
              onClick={() => navigate('/homelayout/templatelist')}
              size="small"
            >
              <ArrowBackIcon fontSize="small" />
            </IconButton>
            <HBox
              sx={{
                width: 30,
                height: 30,
                borderRadius: '8px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: "transparent"
              }}
            >
              <SmsOutlinedIcon sx={{ fontSize: 18 }} />
            </HBox>
            <HBox sx={{ flex: 1, minWidth: 0, background: "transparent" }}>
              <HLabel
                value={intl.formatMessage({ id: 'utility.textEditor.title', defaultMessage: 'Message template editor' })}
                translate={false}
                colon={false}
                align="left"
                sx={{ fontWeight: 700, fontFamily: idmFontFamily, fontSize: 16, textTransform: 'uppercase', letterSpacing: 1, color: theme.palette.text.primary }}
              />
              {template && (
                <Stack direction="row" flexWrap="wrap" gap={1} sx={{ mt: 1 }}>
                  <Chip
                    label={template.templateName}
                    size="small"
                    sx={{
                      fontFamily: idmFontFamily,
                      fontWeight: 600,
                      fontSize: 11,
                    }}
                  />
                  <Chip
                    label={template.channel}
                    size="small"
                    sx={{
                      fontFamily: idmFontFamily,
                      fontSize: 11,
                    }}
                  />
                  <Chip
                    label={template.templateType}
                    size="small"
                    sx={{
                      fontFamily: idmFontFamily,
                      fontSize: 11,
                    }}
                  />
                </Stack>
              )}
            </HBox>
          </Stack>
          <Stack
            direction="row"
            alignItems="center"
            spacing={1}
            flexWrap="wrap"
            justifyContent="flex-end"
            sx={{ ml: { xs: 0, md: 'auto' } }}
          >
            {editorState?.version != null && editorState.version !== '' ? (
              <Chip
                label={`${editorState.version}`}
                size="small"
                sx={{
                  fontFamily: idmFontFamily,
                  fontWeight: 600,
                  fontSize: 11,
                }}
              />
            ) : null}
            {editorState ? (
              <Chip
                label={editorState.isPublish === 'Y' ? intl.formatMessage({ id: 'utility.textEditor.chip.published', defaultMessage: 'Published' }) : intl.formatMessage({ id: 'utility.textEditor.chip.unpublished', defaultMessage: 'Unpublished' })}
                size="small"
                sx={{
                  background: editorState.isPublish === 'Y' ? 'rgba(34,197,94,0.25)' : 'rgba(251,191,36,0.25)',
                  fontFamily: idmFontFamily,
                  fontWeight: 600,
                  fontSize: 11,
                }}
              />
            ) : null}
            {editorState?.hasDraft ? (
              <Chip label={intl.formatMessage({ id: 'utility.textEditor.chip.draft', defaultMessage: 'Draft' })} size="small" sx={{ background: 'rgba(59,130,246,0.35)', color: '#fff', fontSize: 11, fontWeight: 600 }} />
            ) : null}
            <Tooltip title={intl.formatMessage({ id: 'utility.textEditor.tooltip.copy', defaultMessage: 'Copy text' })}>
              <HButton
                variant="contained"
                size="small"
                onClick={copyText}
                label="utility.textEditor.btn.copy"
                startIcon={<ContentCopyIcon sx={{ fontSize: '16px !important' }} />}
              />
            </Tooltip>
            <Tooltip title={intl.formatMessage({ id: 'utility.textEditor.tooltip.saveDraft', defaultMessage: 'Persist text as an unpublished draft' })}>
              <span>
                <HButton
                  variant="contained"
                  size="small"
                  onClick={handleSave}
                  label={saving ? 'utility.textEditor.btn.saving' : 'utility.textEditor.btn.saveDraft'}
                  disabled={saving || textLoading || !templateId}
                  startIcon={saving ? <CircularProgress size={14} color="inherit" /> : <SaveOutlinedIcon sx={{ fontSize: '16px !important' }} />}
                />
              </span>
            </Tooltip>
            <Tooltip title={intl.formatMessage({ id: 'utility.textEditor.tooltip.discard', defaultMessage: 'Drop unpublished changes and restore the last published text' })}>
              <span>
                <HButton
                  variant="outlined"
                  size="small"
                  onClick={handleDiscard}
                  label="utility.textEditor.btn.discard"
                  disabled={!!lifecycleBusy || !editorState?.hasDraft}
                  startIcon={lifecycleBusy === 'discard' ? <CircularProgress size={14} /> : <UndoIcon sx={{ fontSize: '16px !important' }} />}
                />
              </span>
            </Tooltip>
            <Tooltip title={intl.formatMessage({ id: 'utility.textEditor.tooltip.publish', defaultMessage: 'Publish the current draft as a new version' })}>
              <span>
                <HButton
                  variant="contained"
                  size="small"
                  onClick={handlePublish}
                  label="utility.textEditor.btn.publish"
                  disabled={!!lifecycleBusy || !editorState?.hasDraft}
                  startIcon={lifecycleBusy === 'publish' ? <CircularProgress size={14} color="inherit" /> : <PublishIcon sx={{ fontSize: '16px !important' }} />}
                />
              </span>
            </Tooltip>
          </Stack>
        </HBox>

        {editorState?.legacyStorageReconciled ? (
          <Alert severity="info" sx={{ mx: 2, mt: 1.5, borderRadius: '10px' }}>
            {intl.formatMessage({ id: 'utility.textEditor.alert.legacyReconciled', defaultMessage: 'Text was extracted from a previous Word document for this channel. Save and publish to store plain text only under the current configuration.' })}
          </Alert>
        ) : null}

        <HBox
          sx={{
            flex: 1,
            minHeight: 0,
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden',
          }}
        >
          <Stack
            direction={{ xs: 'column', lg: 'row' }}
            spacing={0}
            sx={{
              alignItems: 'stretch',
              minHeight: 0,
              flex: 1,
              maxHeight: { lg: 'calc(100vh - 180px)' },
            }}
          >
            <HBox
              sx={{
                width: { xs: '100%', lg: 380 },
                flexShrink: 0,
                borderRight: { lg: `1px solid ${idmLayoutColors.border}` },
                borderBottom: { xs: `1px solid ${idmLayoutColors.border}`, lg: 0 },
                display: 'flex',
                flexDirection: 'column',
                minHeight: 0,
                maxHeight: { xs: 'min(42vh, 360px)', lg: 'calc(100vh - 180px)' },
              }}
            >
              <HBox sx={{ px: 1.5, py: 0.75, borderBottom: `1px solid ${idmLayoutColors.border}`, flexShrink: 0 }}>
                <HLabel
                  value={intl.formatMessage({ id: 'utility.textEditor.placeholders.title', defaultMessage: 'Placeholders' })}
                  translate={false}
                  colon={false}
                  align="left"
                  sx={{ display: 'block', mb: 0.25, lineHeight: 1.2, fontFamily: idmFontFamily, color: theme.palette.text.primary, fontWeight: 700 }}
                />
                <Stack direction="row" alignItems="center" spacing={0.75}>
                  <TextField
                    size="small"
                    fullWidth
                    placeholder={intl.formatMessage({ id: 'utility.textEditor.placeholders.searchPlaceholder', defaultMessage: 'Search…' })}
                    value={placeholderSearch}
                    onChange={(e) => setPlaceholderSearch(e.target.value)}
                    sx={{
                      flex: 1,
                      minWidth: 0,
                      m: 0,
                      '& .MuiInputBase-input': { py: 0.75 },
                    }}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start" sx={{ ml: 0.5 }}>
                          <SearchIcon sx={{ fontSize: 18 }} color="action" />
                        </InputAdornment>
                      ),
                      endAdornment: placeholderSearch ? (
                        <InputAdornment position="end">
                          <IconButton
                            size="small"
                            aria-label={intl.formatMessage({ id: 'utility.textEditor.placeholders.clearSearch', defaultMessage: 'Clear search' })}
                            onClick={() => {
                              setPlaceholderSearch('')
                              setExpandedManual(new Set())
                            }}
                            edge="end"
                            sx={{ p: 0.25 }}
                          >
                            <ClearIcon sx={{ fontSize: 18 }} />
                          </IconButton>
                        </InputAdornment>
                      ) : null,
                    }}
                  />
                  <Tooltip title={intl.formatMessage({ id: 'utility.textEditor.placeholders.reload', defaultMessage: 'Reload merge fields' })}>
                    <span>
                      <IconButton
                        size="small"
                        onClick={handleRefreshPlaceholders}
                        disabled={fieldsLoading || !template?.moduleId}
                        color="primary"
                        sx={{ flexShrink: 0, p: 0.75 }}
                      >
                        <RefreshIcon sx={{ fontSize: 20 }} />
                      </IconButton>
                    </span>
                  </Tooltip>
                </Stack>
                <HLabel
                  value={searchActive
                    ? intl.formatMessage({ id: 'utility.textEditor.placeholders.searchActiveHint', defaultMessage: 'Matches stay expanded; clear search to collapse.' })
                    : intl.formatMessage({ id: 'utility.textEditor.placeholders.defaultHint', defaultMessage: 'Expand a group, click a field to insert.' })}
                  translate={false}
                  colon={false}
                  align="left"
                  sx={{ display: 'block', mt: 0.35, lineHeight: 1.25, fontFamily: idmFontFamily, color: theme.palette.text.secondary, fontSize: 11 }}
                />
              </HBox>
              <HBox
                sx={{
                  flex: 1,
                  minHeight: 0,
                  overflowY: 'auto',
                  overflowX: 'hidden',
                  px: 1,
                  py: 0.5,
                  WebkitOverflowScrolling: 'touch',
                }}
              >
                {fieldsLoading ? (
                  <HBox sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
                    <CircularProgress size={32} />
                  </HBox>
                ) : (
                  <>
                    {filteredEntities.length === 0 && searchActive ? (
                      <Typography variant="body2" color="text.secondary" sx={{ px: 1, py: 2 }}>
                        {intl.formatMessage({ id: 'utility.textEditor.placeholders.noMatches', defaultMessage: 'No matches for "{query}".' }, { query: placeholderSearch.trim() })}
                      </Typography>
                    ) : null}
                    {filteredEntities.map((entity) => {
                      const expanded = searchActive ? true : expandedManual.has(entity.entityCode)
                      return (
                        <Accordion
                          key={entity.entityCode}
                          expanded={expanded}
                          onChange={(_, isExpanded) => {
                            if (searchActive) return
                            setExpandedManual((prev) => {
                              const next = new Set(prev)
                              if (isExpanded) next.add(entity.entityCode)
                              else next.delete(entity.entityCode)
                              return next
                            })
                          }}
                          disableGutters
                          elevation={0}
                          sx={{
                            borderRadius: '10px',
                            mb: 1,
                            overflow: 'hidden',
                            '&:before': { display: 'none' },
                          }}
                        >
                          <AccordionSummary
                            expandIcon={<ExpandMoreIcon />}
                            sx={{
                              minHeight: 48,
                              px: 1.5,
                              '& .MuiAccordionSummary-content': { my: 0.75 },
                            }}
                          >
                            <HLabel
                              value={entity.entityDescription}
                              translate={false}
                              colon={false}
                              align="left"
                              sx={{ fontFamily: idmFontFamily, color: theme.palette.text.primary, fontSize: 13, fontWeight: 700 }}
                            />
                          </AccordionSummary>
                          <AccordionDetails sx={{ pt: 0, px: 0, pb: 0.5 }}>
                            {entity.attributes.length === 0 ? (
                              <HLabel
                                value={intl.formatMessage({ id: 'utility.textEditor.placeholders.noAttributes', defaultMessage: 'No attributes' })}
                                translate={false}
                                colon={false}
                                align="left"
                                sx={{ display: 'block', mt: 0.35, lineHeight: 1.25, fontFamily: idmFontFamily, color: theme.palette.text.secondary, fontSize: 11 }}
                              />
                            ) : (
                              <List dense disablePadding>
                                {entity.attributes.map((a) => (
                                  <ListItemButton
                                    key={`${entity.entityCode}.${a.code}`}
                                    onClick={() => insertPlaceholder(entity.entityCode, a.code)}
                                    sx={{
                                      py: 0.5,
                                      px: 1.5,
                                      alignItems: 'flex-start',
                                      borderRadius: 0,
                                    }}
                                  >
                                    <ListItemText
                                      primary={a.desc}
                                      primaryTypographyProps={{ variant: 'body2' }}
                                    />
                                  </ListItemButton>
                                ))}
                              </List>
                            )}
                          </AccordionDetails>
                        </Accordion>
                      )
                    })}
                  </>
                )}
              </HBox>
            </HBox>

            <HBox
              sx={{
                flex: 1,
                display: 'flex',
                flexDirection: 'column',
                minWidth: 0,
                minHeight: 0,
                p: { xs: 1.5, md: 2 },
                alignSelf: { xs: 'stretch', lg: 'flex-start' },
                width: '100%',
              }}
            >
              <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 1 }} flexWrap="wrap" gap={1}>
                <HLabel
                  value={intl.formatMessage({ id: 'utility.textEditor.body.title', defaultMessage: 'Message body' })}
                  translate={false}
                  colon={false}
                  align="left"
                  sx={{ fontFamily: idmFontFamily, color: theme.palette.text.primary, fontSize: 15, fontWeight: 700 }}
                />
                <Tooltip title={intl.formatMessage({ id: 'utility.textEditor.body.reloadTooltip', defaultMessage: 'Reload saved text from server' })}>
                  <span>
                    <HButton
                      variant="outlined"
                      size="small"
                      onClick={handleRefreshMessage}
                      label="utility.textEditor.btn.refresh"
                      disabled={textLoading || !templateId}
                      startIcon={<RefreshIcon sx={{ fontSize: '16px !important' }} />}
                    />
                  </span>
                </Tooltip>
              </Stack>

              <HPaper
                variant="outlined"
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  borderRadius: '12px',
                  overflow: 'hidden',
                  flexShrink: 0,
                  height: 350,
                  position: 'relative',
                  border: `1px solid ${idmLayoutColors.border}`,
                  boxShadow: 'none',
                }}
              >
                {textLoading ? (
                  <HBox
                    sx={{
                      position: 'absolute',
                      inset: 0,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      bgcolor: alpha(theme.palette.background.paper, 0.85),
                      zIndex: 2,
                    }}
                  >
                    <CircularProgress />
                  </HBox>
                ) : null}
                <HTextField
                  inputRef={textareaRef}
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  placeholder={intl.formatMessage({ id: 'utility.textEditor.body.placeholder', defaultMessage: 'Type your message. Insert placeholders from the left.' })}
                  multiline
                  fullWidth
                  editable
                  spellCheck
                  disabled={textLoading}
                  sx={{
                    height: '100%',
                    '& .MuiOutlinedInput-notchedOutline': { border: 'none' },
                    '& .MuiInputBase-root': {
                      alignItems: 'stretch',
                      height: '100%',
                      overflow: 'hidden',
                      bgcolor: alpha(theme.palette.background.paper, 0.9),
                    },
                    '& textarea': {
                      fontFamily: idmFontFamily,
                      lineHeight: 1.5,
                      fontSize: '0.9375rem',
                      py: 1.25,
                      px: 1,
                      resize: 'none',
                      overflowY: 'auto',
                      boxSizing: 'border-box',
                      maxHeight: '100%',
                    },
                  }}
                />
              </HPaper>

              <Typography variant="caption" sx={{ fontFamily: idmFontFamily, color: idmLayoutColors.text.muted, mt: 1.25, display: 'block' }}>
                {intl.formatMessage({ id: 'utility.textEditor.body.stats', defaultMessage: '{count} {count, plural, one {character} other {characters}} · Encoding affects message segment count · Use Save draft in the header' }, { count: text.length })}
              </Typography>
            </HBox>
          </Stack>
        </HBox>
      </HPaper>
    </HBox>
  )
}

export default TextEditor
