import { useEffect, useMemo, useRef, useState, useCallback } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useIntl } from 'react-intl'
import { Alert, Chip, CircularProgress, Container, IconButton, Stack, Tooltip, useTheme } from '@mui/material'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import EditDocumentIcon from '@mui/icons-material/EditNote'
import PublishIcon from '@mui/icons-material/Publish'
import UndoIcon from '@mui/icons-material/Undo'
import { utilityAPI } from './apiEndpoints'
import { idmLayoutColors, idmFontFamily } from './userScreenTokens'
import { HBox, HButton, HLabel, HPaper, HAxiosService, useToast } from "@helix/component-library";

function DocxEditor({ templateId: templateIdFromProps, embedded = false }) {
  const navigate = useNavigate()
  const toast = useToast()
  const theme = useTheme()
  const intl = useIntl()
  const { templateId: routeTemplateId, name: legacyRouteName } = useParams()
  const templateId = (templateIdFromProps ?? routeTemplateId ?? legacyRouteName ?? '').trim()
  const shellHeight = embedded ? '100%' : 'calc(100vh - 64px)'
  const editorHeight = embedded ? '100%' : 'calc(100vh - 200px)'

  const containerId = 'onlyoffice-editor'
  const editorInstance = useRef(null)
  const connectorRef = useRef(null)

  const [docServer, setDocServer] = useState()
  const [config, setConfig] = useState()
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [retryKey, setRetryKey] = useState(0)
  const [editorState, setEditorState] = useState(null)
  const [stateLoading, setStateLoading] = useState(false)
  const [draftSyncing, setDraftSyncing] = useState(false)
  const [lifecycleBusy, setLifecycleBusy] = useState(null)
  const loadEditorStateRef = useRef(async () => {})

  const loadEditorState = useCallback(async (opts) => {
    if (!templateId) return
    if (!opts?.silent) setStateLoading(true)
    try {
      const res = await HAxiosService.GET(utilityAPI.templateEditorState(templateId))
      const ok = (res.data.status || '').toLowerCase() === 'success'
      if (ok && res.data.data) setEditorState(res.data.data)
    } catch {
      /* non-fatal */
    } finally {
      if (!opts?.silent) setStateLoading(false)
    }
  }, [templateId])

  useEffect(() => {
    loadEditorStateRef.current = loadEditorState
  }, [loadEditorState])

  const pollUntilDraftReady = useCallback(async () => {
    if (!templateId) return
    setDraftSyncing(true)
    try {
      for (let i = 0; i < 50; i++) {
        await new Promise((r) => setTimeout(r, 350))
        const res = await HAxiosService.GET(utilityAPI.templateEditorState(templateId))
        const ok = (res.data.status || '').toLowerCase() === 'success'
        if (ok && res.data.data?.hasDraft) {
          setEditorState(res.data.data)
          toast.success(intl.formatMessage({ id: "utility.docxEditor.toast.draftStored", defaultMessage: "Draft stored on server — you can publish" }))
          return
        }
      }
      await loadEditorState({ silent: true })
      toast.warning(intl.formatMessage({ id: "utility.docxEditor.toast.draftNotVisible", defaultMessage: "Draft not visible yet. Wait a few seconds or use Save draft again after the document server finishes." }))
    } finally {
      setDraftSyncing(false)
    }
  }, [templateId, toast, loadEditorState, intl])

  const fetchConfig = useCallback(async () => {
    try {
      setError(null)
      setLoading(true)
      const [{ data: ds }, { data: cfg }] = await Promise.all([
        HAxiosService.GET(utilityAPI.settingDocServer()),
        HAxiosService.GET(utilityAPI.onlyofficeConfig(), {}, { templateId }),
      ])
      setDocServer(ds.documentServerUrl)
      setConfig(cfg.config)
      await loadEditorState()
    } catch (e) {
      console.error('Failed to fetch config or document server URL:', e)
      setError(intl.formatMessage({ id: "utility.docxEditor.error.initFailed", defaultMessage: "Failed to initialize document editor. Check server connections." }))
    } finally {
      setLoading(false)
    }
  }, [templateId, loadEditorState, intl])

  const scriptUrl = useMemo(() => (docServer ? `${docServer}/web-apps/apps/api/documents/api.js` : undefined), [docServer])

  const handleEditorError = useCallback(() => {
    console.warn('Editor save error detected. Refreshing configuration...')
    fetchConfig().then(() => setRetryKey((prev) => prev + 1))
  }, [fetchConfig])

  const patchEditorSave = useCallback(() => {
    if (!editorInstance.current) return

    const events = editorInstance.current.config.events || {}
    events.onError = handleEditorError
    events.onRequestError = handleEditorError
  }, [handleEditorError])

  const bindConnector = useCallback(() => {
    try {
      const ed = editorInstance.current
      if (ed && typeof ed.createConnector === 'function') {
        connectorRef.current = ed.createConnector()
      }
    } catch {
      connectorRef.current = null
    }
  }, [])

  useEffect(() => {
    if (!scriptUrl || !config || loading || error) return

    const container = document.getElementById(containerId)
    if (container) container.innerHTML = ''

    const script = document.createElement('script')
    script.src = scriptUrl
    script.async = true

    script.onload = () => {
      if (!window.DocsAPI || !config) return

      const baseEvents = config.events || {}
      const innerOnReady = baseEvents.onReady
      const innerDocReady = baseEvents.onDocumentReady
      const innerDocState = baseEvents.onDocumentStateChange
      let docStateDebounce = null

      const cfg = {
        ...config,
        width: '100%',
        height: '100%',
        events: {
          ...baseEvents,
          onReady: () => {
            patchEditorSave()
            bindConnector()
            if (typeof innerOnReady === 'function') innerOnReady()
          },
          onDocumentReady: () => {
            patchEditorSave()
            bindConnector()
            if (typeof innerDocReady === 'function') innerDocReady()
          },
          onDocumentStateChange: (ev) => {
            if (typeof innerDocState === 'function') innerDocState(ev)
            if (docStateDebounce) window.clearTimeout(docStateDebounce)
            docStateDebounce = window.setTimeout(() => {
              void loadEditorStateRef.current({ silent: true })
            }, 6000)
          },
          onError: handleEditorError,
          onRequestError: handleEditorError,
        },
      }

      editorInstance.current = new window.DocsAPI.DocEditor(containerId, cfg)
    }

    document.body.appendChild(script)

    return () => {
      document.body.removeChild(script)
      if (container) container.innerHTML = ''
      editorInstance.current = null
      connectorRef.current = null
    }
  }, [scriptUrl, config, loading, error, retryKey, patchEditorSave, handleEditorError, bindConnector])

  useEffect(() => {
    fetchConfig()
  }, [fetchConfig])

  /** Pick up OnlyOffice callback persisting the draft (async vs browser). */
  useEffect(() => {
    if (!templateId || loading || error || !scriptUrl || !config) return
    const tick = window.setInterval(() => {
      void loadEditorState({ silent: true })
    }, 8000)
    return () => window.clearInterval(tick)
  }, [templateId, loading, error, scriptUrl, config, loadEditorState])

  const runPublish = useCallback(async () => {
    if (!templateId) return
    setLifecycleBusy('publish')
    try {
      const res = await HAxiosService.POST(`${utilityAPI.templates()}/publish/${encodeURIComponent(templateId)}`)
      const ok = (res.data.status || '').toLowerCase() === 'success'
      if (ok) {
        toast.success(res.data.message || intl.formatMessage({ id: "utility.docxEditor.toast.publishSuccess", defaultMessage: "Template published" }))
        navigate('/homelayout/templatelist')
      } else {
        toast.error(res.data.message || intl.formatMessage({ id: "utility.docxEditor.toast.publishFailed", defaultMessage: "Publish failed" }))
      }
    } catch (e) {
      const msg = e?.response?.data?.message
      toast.error(msg || intl.formatMessage({ id: "utility.docxEditor.toast.publishFailed", defaultMessage: "Publish failed" }))
    } finally {
      setLifecycleBusy(null)
    }
  }, [templateId, toast, navigate, intl])

  const runDiscard = useCallback(async () => {
    if (!templateId) return
    setLifecycleBusy('discard')
    try {
      const res = await HAxiosService.POST(utilityAPI.discardDraft(templateId))
      const ok = (res.data.status || '').toLowerCase() === 'success'
      if (ok) {
        toast.success(res.data.message || intl.formatMessage({ id: "utility.docxEditor.toast.discardSuccess", defaultMessage: "Draft discarded" }))
        navigate('/homelayout/templatelist')
      } else {
        toast.error(res.data.message || intl.formatMessage({ id: "utility.docxEditor.toast.discardFailed", defaultMessage: "Discard failed" }))
      }
    } catch (e) {
      const msg = e?.response?.data?.message
      toast.error(msg || intl.formatMessage({ id: "utility.docxEditor.toast.discardFailed", defaultMessage: "Discard failed" }))
    } finally {
      setLifecycleBusy(null)
    }
  }, [templateId, toast, navigate, intl])

  if (loading) {
    return (
      <HBox
        sx={{
          minHeight: shellHeight,
          height: shellHeight,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Stack alignItems="center" spacing={2}>
          <CircularProgress sx={{ color: theme.palette.text.primary }} />
          <HLabel
            value={intl.formatMessage({ id: "utility.docxEditor.loadingConfig", defaultMessage: "Loading document editor configuration…" })}
            translate={false}
            colon={false}
            sx={{ fontFamily: idmFontFamily, fontSize: 14, color: theme.palette.text.secondary }}
          />
        </Stack>
      </HBox>
    )
  }

  if (error) {
    return (
      <HBox
        sx={{
          minHeight: 'calc(100vh - 64px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          px: 2,
        }}
      >
        <HPaper
          elevation={2}
          sx={{
            maxWidth: 480,
            p: 3,
            borderRadius: '16px',
            border: `1px solid ${idmLayoutColors.border}`,
            boxShadow: `0 12px 30px -10px ${idmLayoutColors.primary}40`,
          }}
        >
          <HLabel
            value={error}
            translate={false}
            colon={false}
            sx={{ fontFamily: idmFontFamily, fontWeight: 700, fontSize: 16, color: idmLayoutColors.accent, mb: 1 }}
          />
          <HLabel
            value={intl.formatMessage({ id: "utility.docxEditor.error.refreshMsg", defaultMessage: "Try refreshing the page or check server connections." })}
            translate={false}
            colon={false}
            sx={{ fontFamily: idmFontFamily, fontSize: 14, color: theme.palette.text.secondary, mb: 2 }}
          />
          <HButton
            variant="contained"
            onClick={() => fetchConfig()}
            label="utility.docxEditor.btn.retry"
          />
        </HPaper>
      </HBox>
    )
  }

  const verLabel = editorState?.version != null && editorState.version !== '' ? `${editorState.version}` : null

  return (
    <HBox
      sx={{
        height: shellHeight,
        minHeight: shellHeight,
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
              }}
            >
              <EditDocumentIcon sx={{ fontSize: 18 }} />
            </HBox>
            <HBox sx={{ minWidth: 0, flexDirection: 'column', background: 'transparent' }}>
              <HLabel
                value={intl.formatMessage({ id: "utility.docxEditor.title", defaultMessage: "Document editor" })}
                translate={false}
                colon={false}
                sx={{
                  fontWeight: 700,
                  fontFamily: idmFontFamily,
                  fontSize: 16,
                  textTransform: 'uppercase',
                  letterSpacing: 1,
                  color: theme.palette.text.primary
                }}
              />
              {editorState ? (
                <Stack direction="row" flexWrap="wrap" gap={1} sx={{ mt: 1 }}>
                  <Chip
                    label={editorState.templateName}
                    size="small"
                    sx={{
                      fontFamily: idmFontFamily,
                      fontWeight: 600,
                      fontSize: 11,
                      maxWidth: { xs: 220, sm: 280 },
                      '& .MuiChip-label': { overflow: 'hidden', textOverflow: 'ellipsis' },
                    }}
                    title={editorState.templateName}
                  />
                  <Chip
                    label={editorState.channel}
                    size="small"
                    sx={{
                      fontFamily: idmFontFamily,
                      fontSize: 11,
                    }}
                  />
                  <Chip
                    label={editorState.templateType}
                    size="small"
                    sx={{
                      fontFamily: idmFontFamily,
                      fontSize: 11,
                    }}
                  />
                </Stack>
              ) : null}
            </HBox>
          </Stack>

          <Stack direction="row" alignItems="center" spacing={1} flexWrap="wrap" justifyContent="flex-end" sx={{ ml: { xs: 0, md: 'auto' } }}>
            {stateLoading ? <CircularProgress size={20} /> : null}
            {verLabel ? (
              <Chip
                label={verLabel}
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
                label={editorState.isPublish === 'Y' ? intl.formatMessage({ id: "utility.docxEditor.chip.published", defaultMessage: "Published" }) : intl.formatMessage({ id: "utility.docxEditor.chip.unpublished", defaultMessage: "Unpublished" })}
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
              <Chip label={intl.formatMessage({ id: "utility.docxEditor.chip.draft", defaultMessage: "Draft" })} size="small" sx={{ background: 'rgba(59,130,246,0.35)', color: '#fff', fontSize: 11, fontWeight: 600 }} />
            ) : null}
            {draftSyncing ? (
              <Chip
                label={intl.formatMessage({ id: "utility.docxEditor.chip.syncingDraft", defaultMessage: "Syncing draft…" })}
                size="small"
                sx={{ fontSize: 11, fontWeight: 600 }}
              />
            ) : null}
            {templateId ? (
              <Chip
                label={intl.formatMessage({ id: "utility.docxEditor.chip.id", defaultMessage: "ID: {id}" }, { id: templateId })}
                size="small"
                sx={{
                  fontFamily: idmFontFamily,
                  fontWeight: 600,
                  fontSize: 11,
                  maxWidth: 200,
                }}
              />
            ) : null} 
            <Tooltip title={intl.formatMessage({ id: "utility.docxEditor.tooltip.discard", defaultMessage: "Drop unpublished changes and restore the last published revision" })}>
              <span>
                <HButton
                  variant="outlined"
                  size="small"
                  onClick={runDiscard}
                  label="utility.docxEditor.btn.discard"
                  disabled={!!lifecycleBusy || draftSyncing || !editorState?.hasDraft}
                  startIcon={lifecycleBusy === 'discard' ? <CircularProgress size={14} /> : <UndoIcon sx={{ fontSize: '16px !important' }} />}
                />
              </span>
            </Tooltip>
            <Tooltip title={intl.formatMessage({ id: "utility.docxEditor.tooltip.publish", defaultMessage: "Publish the current draft as a new version" })}>
              <span>
                <HButton
                  variant="contained"
                  size="small"
                  onClick={runPublish}
                  label="utility.docxEditor.btn.publish"
                  disabled={!!lifecycleBusy || draftSyncing || !editorState?.hasDraft}
                  startIcon={lifecycleBusy === 'publish' ? <CircularProgress size={14} color="inherit" /> : <PublishIcon sx={{ fontSize: '16px !important' }} />}
                />
              </span>
            </Tooltip>
          </Stack>
        </HBox>

        {editorState?.legacyStorageReconciled ? (
          <Alert severity="info" sx={{ mx: 2, mt: 1.5, borderRadius: '10px' }}>
            {intl.formatMessage({ id: "utility.docxEditor.alert.legacyReconciled", defaultMessage: "Content was loaded from a previous storage format for this channel. Save draft and publish to align stored data with the current configuration." })}
          </Alert>
        ) : null}

        <HBox
          sx={{
            flex: 1,
            minHeight: 0,
            px: 2,
            py: 1.5,
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          <HPaper
            elevation={0}
            sx={{
              flex: 1,
              minHeight: 0,
              display: 'flex',
              flexDirection: 'column',
              borderRadius: '12px',
              overflow: 'hidden',
              boxShadow: 'none',
            }}
          >
            <HBox
              id={containerId}
              sx={{
                width: '100%',
                height: editorHeight,
                minHeight: embedded ? 0 : { xs: 400, sm: 480 },
                maxHeight: embedded ? '100%' : 'min(85vh, 900px)',
                boxSizing: 'border-box',
                visibility: scriptUrl && config ? 'visible' : 'hidden',
              }}
            />
          </HPaper>
        </HBox>
      </HPaper>
    </HBox>
  )
}

export default DocxEditor
