import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useLocation, useNavigate, useParams, useSearchParams } from 'react-router-dom'
import {
  Alert,
  Backdrop,
  Box,
  CircularProgress,
  Container,
  Fade,
  IconButton,
  LinearProgress,
  Stack,
  Tooltip,
  useMediaQuery,
} from '@mui/material'
import { alpha, useTheme } from '@mui/material/styles'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import FullscreenIcon from '@mui/icons-material/Fullscreen'
import FullscreenExitIcon from '@mui/icons-material/FullscreenExit'
import MarkEmailReadOutlinedIcon from '@mui/icons-material/MarkEmailReadOutlined'
import PictureAsPdfOutlinedIcon from '@mui/icons-material/PictureAsPdfOutlined'
import SendOutlinedIcon from '@mui/icons-material/SendOutlined'
import { useIntl } from 'react-intl'
import { HBox, HButton, HLabel, HPaper, HTextField, HAxiosService, AxiosClient, useToast } from '@helix/component-library'
import { utilityAPI } from './apiEndpoints'
import { idmLayoutColors, idmFontFamily } from './userScreenTokens'

function parseFilenameFromContentDisposition(header, fallback) {
  if (!header) return fallback
  const utf8 = /filename\*=(?:UTF-8''|utf-8'')([^;\n]+)/i.exec(header)
  if (utf8?.[1]) {
    try {
      return decodeURIComponent(utf8[1].trim().replace(/^["']|["']$/g, ''))
    } catch {
      /* use ascii fallback */
    }
  }
  const ascii = /filename\s*=\s*("?)([^";\n]+)\1/i.exec(header)
  if (ascii?.[2]) return ascii[2].trim()
  return fallback
}

function sanitizePdfFilenamePart(s) {
  const t = (s ?? '').trim().replace(/[\\/:*?"<>|\s]+/g, '_')
  if (!t) return ''
  return t.length > 180 ? t.slice(0, 180) : t
}

function clientPdfFallbackName(templateId, primaryNameCandidates, nameCandidates) {
  const primaryPart = primaryNameCandidates.map(sanitizePdfFilenamePart).find((p) => p.length > 0) ?? ''
  const namePart = nameCandidates.map(sanitizePdfFilenamePart).find((p) => p.length > 0) ?? ''
  if (primaryPart && namePart) return `${primaryPart}_${namePart}.pdf`
  if (primaryPart) return `${primaryPart}.pdf`
  if (namePart) return `${namePart}.pdf`
  return `email-preview-${templateId}.pdf`
}

const CONTAINER_ID = 'onlyoffice-email-preview-editor'
const TEMPLATES_LIST_PATH = '/homelayout/templatelist'
const PREVIEW_SPLIT_STORAGE_KEY = 'utilityEmailPreviewEditorFrac'

function callOnlyOfficeResize(editorInstance) {
  const ed = editorInstance.current
  if (!ed) return
  try {
    if (typeof ed.resizeEditor === 'function') ed.resizeEditor()
    else if (typeof ed.resize === 'function') ed.resize()
  } catch {
    /* ignore */
  }
}

function clampEditorFrac(f) {
  return Math.min(0.78, Math.max(0.22, f))
}

function readStoredEditorFrac() {
  try {
    const raw = sessionStorage.getItem(PREVIEW_SPLIT_STORAGE_KEY)
    const n = raw ? parseFloat(raw) : NaN
    if (Number.isFinite(n)) return clampEditorFrac(n)
  } catch {
    /* ignore */
  }
  return 0.58
}

function safeReturnPathFromState(state) {
  const from = state?.from
  if (typeof from !== 'string' || !from.startsWith('/') || from.startsWith('//')) return null
  if (from.includes('://')) return null
  return from
}

function applyPreviewDto(d, setters) {
  setters.setHasPreview(!!d.hasPreview)
  setters.lastPollUpdatedAtRef.current = d.updatedAt ?? null
  const html = d.bodyHtml || ''
  setters.setBodyHtml(html)
  if (setters.lastAppliedBodyHtmlRef) setters.lastAppliedBodyHtmlRef.current = html
  if (setters.setEmailTo) setters.setEmailTo(d.mailTo ?? '')
  if (setters.setSubject) setters.setSubject(d.mailSubject ?? '')
}

export default function PreviewAndDocxEditor() {
  const theme = useTheme()
  const intl = useIntl()
  const isMdUp = useMediaQuery(theme.breakpoints.up('md'))

  const [editorReady, setEditorReady] = useState(false)
  const [previewHtmlLoading, setPreviewHtmlLoading] = useState(false)
  const navigate = useNavigate()
  const routerLocation = useLocation()
  const toast = useToast()
  const [searchParams] = useSearchParams()
  const { primary_Name: primaryNamePathParam } = useParams()

  const exitPreviewPath = useMemo(() => {
    const fromState = safeReturnPathFromState(routerLocation.state)
    if (fromState) return fromState
    const rp = searchParams.get('returnPath')
    if (rp && rp.startsWith('/') && !rp.startsWith('//') && !rp.includes('://')) return rp
    return TEMPLATES_LIST_PATH
  }, [routerLocation.state, searchParams])

  const exitPreview = useCallback(
    (opts) => {
      navigate(exitPreviewPath, { replace: opts?.replace === true })
    },
    [navigate, exitPreviewPath]
  )
  const templateId = useMemo(() => searchParams.get('id')?.trim() ?? '', [searchParams])

  const previewPrimaryNameFromUrl = useMemo(() => {
    const fromPath = (primaryNamePathParam ?? '').trim()
    const fromQuery = (searchParams.get('primary_Name') ?? '').trim()
    return fromPath || fromQuery
  }, [primaryNamePathParam, searchParams])

  const editorRef = useRef(null)
  const loadPreviewRef = useRef(async () => {})
  const previewPollDebounceRef = useRef(null)
  const pendingPersistPivotRef = useRef(null)
  const previewHadUnsavedChangesRef = useRef(false)

  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [docServer, setDocServer] = useState()
  const [ooConfig, setOoConfig] = useState()
  const [retryKey, setRetryKey] = useState(0)

  const [editorState, setEditorState] = useState(null)
  const [stateLoading, setStateLoading] = useState(false)

  const [hasPreview, setHasPreview] = useState(false)
  const [previewStagedPrimaryName, setPreviewStagedPrimaryName] = useState('')
  const [previewStagedTemplateName, setPreviewStagedTemplateName] = useState('')
  const [bodyHtml, setBodyHtml] = useState('')
  const displayBodyHtmlRef = useRef('')
  useEffect(() => {
    displayBodyHtmlRef.current = bodyHtml
  }, [bodyHtml])

  const [emailTo, setEmailTo] = useState('')
  const [subject, setSubject] = useState('')
  const [sendBusy, setSendBusy] = useState(false)
  const [pdfBusy, setPdfBusy] = useState(false)

  const [editorFrac, setEditorFrac] = useState(readStoredEditorFrac)
  const [expandedPane, setExpandedPane] = useState(null)
  const previewSplitRowRef = useRef(null)
  const splitDraggingRef = useRef(false)
  const splitResizeRafRef = useRef(null)
  const editorFracRef = useRef(editorFrac)
  editorFracRef.current = editorFrac

  useEffect(() => {
    const onMove = (e) => {
      if (!splitDraggingRef.current || !previewSplitRowRef.current) return
      const r = previewSplitRowRef.current.getBoundingClientRect()
      if (r.width <= 8) return
      const f = clampEditorFrac((e.clientX - r.left) / r.width)
      editorFracRef.current = f
      setEditorFrac(f)
      if (splitResizeRafRef.current == null) {
        splitResizeRafRef.current = window.requestAnimationFrame(() => {
          splitResizeRafRef.current = null
          callOnlyOfficeResize(editorRef)
        })
      }
    }
    const endDrag = () => {
      if (!splitDraggingRef.current) return
      splitDraggingRef.current = false
      if (splitResizeRafRef.current != null) {
        window.cancelAnimationFrame(splitResizeRafRef.current)
        splitResizeRafRef.current = null
      }
      try {
        sessionStorage.setItem(PREVIEW_SPLIT_STORAGE_KEY, String(editorFracRef.current))
      } catch {
        /* ignore */
      }
      document.body.style.removeProperty('cursor')
      document.body.style.removeProperty('user-select')
      window.requestAnimationFrame(() => callOnlyOfficeResize(editorRef))
    }
    window.addEventListener('pointermove', onMove)
    window.addEventListener('pointerup', endDrag)
    window.addEventListener('pointercancel', endDrag)
    return () => {
      window.removeEventListener('pointermove', onMove)
      window.removeEventListener('pointerup', endDrag)
      window.removeEventListener('pointercancel', endDrag)
      if (splitResizeRafRef.current != null) {
        window.cancelAnimationFrame(splitResizeRafRef.current)
        splitResizeRafRef.current = null
      }
    }
  }, [])

  useEffect(() => {
    if (expandedPane == null) return
    const onKey = (e) => {
      if (e.key === 'Escape') setExpandedPane(null)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [expandedPane])

  useEffect(() => {
    if (!editorReady || expandedPane === 'preview') return
    const t = window.setTimeout(() => callOnlyOfficeResize(editorRef), expandedPane === 'editor' ? 220 : 80)
    return () => window.clearTimeout(t)
  }, [expandedPane, editorReady, editorFrac])

  const lastPollUpdatedAtRef = useRef(null)
  const previewFetchGenRef = useRef(0)
  const lastAppliedBodyHtmlRef = useRef('')

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

  const loadPreviewState = useCallback(
    async (opts) => {
      if (!templateId) return
      const myGen = ++previewFetchGenRef.current
      if (!opts?.skipLoadingOverlay) setPreviewHtmlLoading(true)
      try {
        const res = await HAxiosService.GET(utilityAPI.templateEmailPreview(templateId))
        if (myGen !== previewFetchGenRef.current) return

        const ok = (res.data.status || '').toLowerCase() === 'success'
        const d = res.data.data
        if (!ok || !d) return

        setHasPreview(!!d.hasPreview)

        if (!d.hasPreview) {
          lastPollUpdatedAtRef.current = null
          lastAppliedBodyHtmlRef.current = ''
          setBodyHtml('')
          setEmailTo('')
          setSubject('')
          setPreviewStagedPrimaryName('')
          setPreviewStagedTemplateName('')
          return
        }

        setPreviewStagedPrimaryName((d.primary_Name ?? '').trim())
        setPreviewStagedTemplateName((d.templateName ?? '').trim())

        const u = d.updatedAt ?? null
        const updatedAtChanged = u !== lastPollUpdatedAtRef.current
        if (opts?.forceApplyBody || updatedAtChanged) {
          lastPollUpdatedAtRef.current = u
          const nextHtml = d.bodyHtml || ''
          lastAppliedBodyHtmlRef.current = nextHtml
          setBodyHtml(nextHtml)
          setEmailTo(d.mailTo ?? '')
          setSubject(d.mailSubject ?? '')
        }
      } finally {
        if (!opts?.skipLoadingOverlay) setPreviewHtmlLoading(false)
      }
    },
    [templateId]
  )

  useEffect(() => {
    if (!editorReady) return
    void loadPreviewState({ skipLoadingOverlay: true, forceApplyBody: true })
    const t1 = window.setTimeout(() => {
      void loadPreviewState({ skipLoadingOverlay: true, forceApplyBody: true })
    }, 900)
    const t2 = window.setTimeout(() => {
      void loadPreviewState({ skipLoadingOverlay: true, forceApplyBody: true })
    }, 2200)
    return () => {
      window.clearTimeout(t1)
      window.clearTimeout(t2)
    }
  }, [editorReady, loadPreviewState])

  useEffect(() => {
    loadPreviewRef.current = loadPreviewState
  }, [loadPreviewState])

  const bootstrap = useCallback(async () => {
    if (!templateId) {
      setError(intl.formatMessage({ id: 'utility.previewAndDocxEditor.missingIdAlert', defaultMessage: 'Missing template id.' }))
      setLoading(false)
      return
    }
    setError(null)
    setLoading(true)
    try {
      let res = await HAxiosService.GET(utilityAPI.templateEmailPreview(templateId))
      let ok = (res.data.status || '').toLowerCase() === 'success'
      let d = res.data.data
      if (!ok) {
        throw new Error(res.data.message || 'Failed to load preview')
      }
      if (!d?.hasPreview) {
        const initRes = await HAxiosService.POST(
          utilityAPI.templateEmailPreviewInit(templateId)
        )
        ok = (initRes.data.status || '').toLowerCase() === 'success'
        d = initRes.data.data
        if (!ok || !d) {
          throw new Error(initRes.data.message || 'Failed to initialize preview')
        }
      }

      if (!d) {
        throw new Error('Preview data missing')
      }
      applyPreviewDto(d, {
        setHasPreview,
        setBodyHtml,
        setEmailTo,
        setSubject,
        lastPollUpdatedAtRef,
        lastAppliedBodyHtmlRef,
      })
      if (d.hasPreview) {
        setPreviewStagedPrimaryName((d.primary_Name ?? '').trim())
        setPreviewStagedTemplateName((d.templateName ?? '').trim())
      } else {
        setPreviewStagedPrimaryName('')
        setPreviewStagedTemplateName('')
      }

      const [{ data: ds }, { data: cfgWrap }] = await Promise.all([
        HAxiosService.GET(utilityAPI.settingDocServer()),
        HAxiosService.GET(utilityAPI.onlyofficePreviewConfig(templateId)),
      ])
      setDocServer(ds.documentServerUrl)
      setOoConfig(cfgWrap.config)
      void loadEditorState()
    } catch (e) {
      const msg = e?.response?.data?.message
        || e?.message
        || 'Failed to open preview'
      setError(msg)
      toast.error(msg)
    } finally {
      setLoading(false)
    }
  }, [templateId, toast, loadEditorState, intl])

  useEffect(() => {
    void bootstrap()
  }, [bootstrap])

  const pollPreviewAfterPersisted = useCallback(
    async (pivotUpdatedAt, pivotBodyHtml, opts) => {
      const maxAttempts = opts?.maxAttempts ?? 24
      const delayMs = opts?.delayMs ?? 650
      const confirmDelayMs = opts?.confirmDelayMs ?? 450
      const initialDelayMs = opts?.initialDelayMs ?? 1400

      setPreviewHtmlLoading(true)
      try {
        await new Promise((r) => setTimeout(r, initialDelayMs))
        for (let i = 0; i < maxAttempts; i++) {
          await loadPreviewRef.current({ skipLoadingOverlay: true, forceApplyBody: true })
          const nowAt = lastPollUpdatedAtRef.current
          const nowBody = lastAppliedBodyHtmlRef.current
          const revisionAdvanced =
            (nowAt ?? '') !== (pivotUpdatedAt ?? '') || nowBody !== pivotBodyHtml
          if (revisionAdvanced) {
            await new Promise((r) => setTimeout(r, confirmDelayMs))
            await loadPreviewRef.current({ skipLoadingOverlay: true, forceApplyBody: true })
            return
          }
          if (i < maxAttempts - 1) await new Promise((r) => setTimeout(r, delayMs))
        }
      } finally {
        setPreviewHtmlLoading(false)
      }
    },
    []
  )

  const scriptUrl = useMemo(() => (docServer ? `${docServer}/web-apps/apps/api/documents/api.js` : undefined), [docServer])
  const waitingForEditor = useMemo(
    () => !!(scriptUrl && ooConfig && !editorReady),
    [scriptUrl, ooConfig, editorReady]
  )

  const handleEditorError = useCallback(() => {
    void bootstrap().then(() => setRetryKey((k) => k + 1))
  }, [bootstrap])

  useEffect(() => {
    if (!scriptUrl || !ooConfig || loading || error) return

    setEditorReady(false)
    previewHadUnsavedChangesRef.current = false

    const container = document.getElementById(CONTAINER_ID)
    if (container) container.innerHTML = ''

    const script = document.createElement('script')
    script.src = scriptUrl
    script.async = true
    script.onload = () => {
      if (!window.DocsAPI || !ooConfig) return
      const baseEvents = ooConfig.events || {}
      const innerReady = baseEvents.onReady
      const innerDocReady = baseEvents.onDocumentReady
      const innerDocState = baseEvents.onDocumentStateChange

      const editorConfig = ooConfig.editorConfig || {}
      const customization = editorConfig.customization || {}
      const cfg = {
        ...ooConfig,
        editorConfig: {
          ...editorConfig,
          customization: {
            ...customization,
            autosave: false,
            forcesave: true,
            showLogo: customization.showLogo ?? false,
          },
        },
        width: '100%',
        height: '100%',
        events: {
          ...baseEvents,
          onReady: () => {
            if (typeof innerReady === 'function') innerReady()
          },
          onDocumentReady: () => {
            if (typeof innerDocReady === 'function') innerDocReady()
            setEditorReady(true)
          },
          onDocumentStateChange: (ev) => {
            if (typeof innerDocState === 'function') innerDocState(ev)
            if (ev?.data) {
              previewHadUnsavedChangesRef.current = true
              return
            }
            if (!previewHadUnsavedChangesRef.current) return
            pendingPersistPivotRef.current = lastPollUpdatedAtRef.current
            if (previewPollDebounceRef.current) window.clearTimeout(previewPollDebounceRef.current)
            previewPollDebounceRef.current = window.setTimeout(() => {
              previewPollDebounceRef.current = null
              const pivot = pendingPersistPivotRef.current
              const pivotBody = displayBodyHtmlRef.current
              void pollPreviewAfterPersisted(pivot, pivotBody, {
                maxAttempts: 28,
                delayMs: 600,
                confirmDelayMs: 10,
                initialDelayMs: 100,
              })
            }, 400)
          },
          onError: handleEditorError,
          onRequestError: handleEditorError,
        },
      }
      editorRef.current = new window.DocsAPI.DocEditor(CONTAINER_ID, cfg)
    }
    document.body.appendChild(script)
    return () => {
      if (previewPollDebounceRef.current) {
        window.clearTimeout(previewPollDebounceRef.current)
        previewPollDebounceRef.current = null
      }
      setEditorReady(false)
      document.body.removeChild(script)
      if (container) container.innerHTML = ''
      editorRef.current = null
    }
  }, [scriptUrl, ooConfig, loading, error, retryKey, handleEditorError, pollPreviewAfterPersisted])

  const onDownloadPdf = async () => {
    if (!templateId || !hasPreview) return
    setPdfBusy(true)
    try {
      const res = await HAxiosService.GET(utilityAPI.templateEmailPreviewPdf(templateId), {
        responseType: 'blob',
      })
      if (!res || !res.data) {
        toast.error('Download failed')
        return
      }
      const cd = res.headers['content-disposition'] ?? res.headers['Content-Disposition']
      const fallbackName = clientPdfFallbackName(
        templateId,
        [previewPrimaryNameFromUrl, previewStagedPrimaryName],
        [editorState?.templateName ?? '', previewStagedTemplateName]
      )
      const downloadName = parseFilenameFromContentDisposition(cd, fallbackName)
      const blob = res.data instanceof Blob ? res.data : new Blob([res.data], { type: 'application/pdf' })
      const url = window.URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.setAttribute('download', downloadName)
      document.body.appendChild(link)
      link.click()
      link.remove()
      window.URL.revokeObjectURL(url)
      toast.success('PDF downloaded')
    } catch (e) {
      const msg = e?.response?.data?.message
      toast.error(msg || 'PDF download failed')
    } finally {
      setPdfBusy(false)
    }
  }

  const onSend = async () => {
    if (!templateId || !hasPreview) return
    if (!emailTo.trim()) {
      toast.warning('Enter recipient email')
      return
    }
    if (!subject.trim()) {
      toast.warning('Enter subject')
      return
    }
    setSendBusy(true)
    try {
      const res = await HAxiosService.POST(utilityAPI.templateEmailPreviewSend(templateId), {
        to: emailTo.trim(),
        subject: subject.trim(),
      })
      const ok = (res.data.status || '').toLowerCase() === 'success'
      if (ok) {
        toast.success(res.data.message || 'Email sent')
      } else {
        toast.error(res.data.message || 'Send failed')
      }
    } catch (e) {
      const msg = e?.response?.data?.message
      toast.error(msg || 'Send failed')
    } finally {
      setSendBusy(false)
    }
  }

  const verLabel = editorState?.version != null && editorState.version !== '' ? `${editorState.version}` : null
  const useDesktopSplitGrid = isMdUp && expandedPane === null
  const useStackedTwoRowGrid = !isMdUp && expandedPane === null

  if (!templateId) {
    return (
      <div>
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
              maxWidth: 520,
              p: 3,
              borderRadius: '16px',
              border: `1px solid ${idmLayoutColors.border}`,
            }}
          >
            <Stack direction="row" alignItems="center" spacing={1.5} sx={{ mb: 2 }}>
              <IconButton
                onClick={() => exitPreview()}
                size="small"
                sx={{
                  color: theme.palette.text.primary,
                }}
              >
                <ArrowBackIcon fontSize="small" />
              </IconButton>
              <HLabel
                value={intl.formatMessage({ id: 'utility.previewAndDocxEditor.title', defaultMessage: 'Email preview' })}
                translate={false}
                colon={false}
                sx={{ fontFamily: idmFontFamily, fontWeight: 700, fontSize: 16, color: theme.palette.text.primary }}
              />
            </Stack>
            <Alert severity="warning" sx={{ borderRadius: '10px', fontFamily: idmFontFamily }}>
              {intl.formatMessage({ id: 'utility.previewAndDocxEditor.missingIdAlert', defaultMessage: 'Missing template id. Open preview from the templates list.' })}
            </Alert>
          </HPaper>
        </HBox>
      </div>
    )
  }

  if (loading) {
    return (
      <div>
        <HBox
          sx={{
            minHeight: 'calc(100vh - 64px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Stack alignItems="center" spacing={2}>
            <CircularProgress sx={{ color: theme.palette.text.primary }} />
            <HLabel
              value={intl.formatMessage({ id: 'utility.previewAndDocxEditor.preparing', defaultMessage: 'Preparing preview…' })}
              translate={false}
              colon={false}
              sx={{ fontFamily: idmFontFamily, fontSize: 14, color: theme.palette.text.secondary }}
            />
          </Stack>
        </HBox>
      </div>
    )
  }

  if (error) {
    return (
      <div>
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
              boxShadow: `0 12px 30px -10px ${alpha(theme.palette.primary.main, 0.4)}`,
            }}
          >
            <HLabel
              value={error}
              translate={false}
              colon={false}
              sx={{ fontFamily: idmFontFamily, fontWeight: 700, fontSize: 16, color: idmLayoutColors.accent, mb: 1 }}
            />
            <HLabel
              value={intl.formatMessage({ id: 'utility.previewAndDocxEditor.errorSubtitle', defaultMessage: 'Try refreshing the page or check server connections.' })}
              translate={false}
              colon={false}
              sx={{ fontFamily: idmFontFamily, fontSize: 14, color: theme.palette.text.secondary, mb: 2 }}
            />
            <Stack direction="row" spacing={1.5} flexWrap="wrap">
              <IconButton
                onClick={() => exitPreview()}
                size="small"
                sx={{
                  color: theme.palette.text.primary,
                }}
              >
                <ArrowBackIcon fontSize="small" />
              </IconButton>
              <HButton
                variant="contained"
                onClick={() => void bootstrap()}
                label="utility.previewAndDocxEditor.retry"
              />
            </Stack>
          </HPaper>
        </HBox>
      </div>
    )
  }

  return (
      <HBox
        sx={{
          height: 'calc(100vh - 64px)',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
          py: 2,
          boxSizing: 'border-box',
        }}
      >
        <Container maxWidth="xl" sx={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden', height: '100%', px: { xs: 2, md: 3 } }}>
          <HBox sx={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden', minHeight: 0 }}>
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
                }}
              >
                <Stack direction="row" alignItems="center" spacing={1.5} flexWrap="wrap" sx={{ flex: 1, minWidth: 0 }}>
                  <IconButton
                    onClick={() => exitPreview()}
                    size="small"
                    sx={{ color: theme.palette.text.primary }}
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
                    <MarkEmailReadOutlinedIcon sx={{ fontSize: 18, color: theme.palette.text.primary }} />
                  </HBox>
                  <HBox sx={{ minWidth: 0, flexDirection: 'column', background: "transparent" }}>
                    <HLabel
                      value={intl.formatMessage({ id: 'utility.previewAndDocxEditor.title', defaultMessage: 'Email preview' })}
                      translate={false}
                      colon={false}
                      sx={{
                        fontWeight: 700,
                        fontFamily: idmFontFamily,
                        fontSize: 16,
                        color: theme.palette.text.primary,
                        textTransform: 'uppercase',
                        letterSpacing: 1,
                      }}
                    />
                    {editorState ? (
                      <Stack direction="row" flexWrap="wrap" gap={1} sx={{ mt: 1 }}>
                        <Chip
                          label={editorState.templateName}
                          size="small"
                          sx={{
                            color: theme.palette.text.primary,
                            fontFamily: idmFontFamily,
                            fontWeight: 600,
                            fontSize: 11,
                            border: '1px solid rgba(255,255,255,0.35)',
                            maxWidth: { xs: 220, sm: 280 },
                            '& .MuiChip-label': { overflow: 'hidden', textOverflow: 'ellipsis' },
                          }}
                          title={editorState.templateName}
                        />
                        <Chip
                          label={editorState.channel}
                          size="small"
                          sx={{
                            color: theme.palette.text.primary,
                            fontFamily: idmFontFamily,
                            fontSize: 11,
                            border: '1px solid rgba(255,255,255,0.25)',
                          }}
                        />
                        <Chip
                          label={editorState.templateType}
                          size="small"
                          sx={{
                            color: theme.palette.text.primary,
                            fontFamily: idmFontFamily,
                            fontSize: 11,
                            border: '1px solid rgba(255,255,255,0.25)',
                          }}
                        />
                      </Stack>
                    ) : null}
                  </HBox>
                </Stack>

                <Stack direction="row" alignItems="center" spacing={1} flexWrap="wrap" justifyContent="flex-end" sx={{ ml: { xs: 0, md: 'auto' } }}>
                  {stateLoading ? <CircularProgress size={20} sx={{ color: '#fff' }} /> : null}
                  {verLabel ? (
                    <Chip
                      label={verLabel}
                      size="small"
                      sx={{
                        color: theme.palette.text.primary,
                        fontFamily: idmFontFamily,
                        fontWeight: 600,
                        fontSize: 11,
                        border: '1px solid rgba(255,255,255,0.3)',
                      }}
                    />
                  ) : null}
                  {editorState ? (
                    <Chip
                      label={editorState.isPublish === 'Y' ? intl.formatMessage({ id: 'utility.previewAndDocxEditor.published', defaultMessage: 'Published' }) : intl.formatMessage({ id: 'utility.previewAndDocxEditor.unpublished', defaultMessage: 'Unpublished' })}
                      size="small"
                      sx={{
                        background: editorState.isPublish === 'Y' ? 'rgba(34,197,94,0.25)' : 'rgba(251,191,36,0.25)',
                        color: theme.palette.text.primary,
                        fontFamily: idmFontFamily,
                        fontWeight: 600,
                        fontSize: 11,
                        border: '1px solid rgba(255,255,255,0.35)',
                      }}
                    />
                  ) : null}
                  {hasPreview ? (
                    <Chip
                      label={intl.formatMessage({ id: 'utility.previewAndDocxEditor.previewReady', defaultMessage: 'Preview ready' })}
                      size="small"
                      sx={{
                        background: 'rgba(59,130,246,0.35)',
                        color: theme.palette.text.primary,
                        fontSize: 11,
                        fontWeight: 600,
                        fontFamily: idmFontFamily,
                      }}
                    />
                  ) : null}
                  {templateId ? (
                    <Chip
                      label={`ID: ${templateId}`}
                      size="small"
                      sx={{
                        color: theme.palette.text.primary,
                        fontFamily: idmFontFamily,
                        fontWeight: 600,
                        fontSize: 11,
                        border: '1px solid rgba(255,255,255,0.35)',
                        maxWidth: 200,
                      }}
                    />
                  ) : null}
                  {previewPrimaryNameFromUrl ? (
                    <Chip
                      label={`Req Id: ${previewPrimaryNameFromUrl}`}
                      size="small"
                      sx={{
                        color: theme.palette.text.primary,
                        fontFamily: idmFontFamily,
                        fontWeight: 600,
                        fontSize: 11,
                        border: '1px solid rgba(255,255,255,0.3)',
                        maxWidth: 220,
                        '& .MuiChip-label': { overflow: 'hidden', textOverflow: 'ellipsis' },
                      }}
                      title={previewPrimaryNameFromUrl}
                    />
                  ) : null}
                  <Tooltip title={intl.formatMessage({ id: 'utility.previewAndDocxEditor.downloadPdfTooltip', defaultMessage: 'Download staged DOCX as PDF' })}>
                    <span>
                      <HButton
                        variant="outlined"
                        size="small"
                        onClick={() => void onDownloadPdf()}
                        disabled={!hasPreview || pdfBusy}
                        startIcon={
                          pdfBusy ? (
                            <CircularProgress size={14} sx={{ color: '#fff' }} />
                          ) : (
                            <PictureAsPdfOutlinedIcon sx={{ fontSize: '16px !important' }} />
                          )
                        }
                        label={pdfBusy ? 'utility.previewAndDocxEditor.downloadingPdf' : 'utility.previewAndDocxEditor.downloadPdf'}
                      />
                    </span>
                  </Tooltip>
                  <Tooltip title={intl.formatMessage({ id: 'utility.previewAndDocxEditor.sendTooltip', defaultMessage: 'Send a test email using the current preview HTML' })}>
                    <span>
                      <HButton
                        variant="contained"
                        size="small"
                        onClick={() => void onSend()}
                        disabled={!hasPreview || sendBusy}
                        startIcon={
                          sendBusy ? (
                            <CircularProgress size={14} color="inherit" />
                          ) : (
                            <SendOutlinedIcon sx={{ fontSize: '16px !important' }} />
                          )
                        }
                        label={sendBusy ? 'utility.previewAndDocxEditor.sending' : 'utility.previewAndDocxEditor.send'}
                      />
                    </span>
                  </Tooltip>
                </Stack>
              </HBox>

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
                <Backdrop
                  open={expandedPane !== null}
                  sx={{
                    zIndex: (t) => t.zIndex.modal - 1,
                  }}
                  onClick={() => setExpandedPane(null)}
                />
                <HBox
                  ref={previewSplitRowRef}
                  sx={{
                    flex: 1,
                    minHeight: 0,
                    minWidth: 0,
                    display: useDesktopSplitGrid || useStackedTwoRowGrid ? 'grid' : 'block',
                    position: 'relative',
                    gridTemplateColumns: useDesktopSplitGrid
                      ? `minmax(0, ${editorFrac}fr) 8px minmax(0, ${1 - editorFrac}fr)`
                      : 'minmax(0, 1fr)',
                    gridTemplateRows: useDesktopSplitGrid
                      ? 'minmax(0, 1fr)'
                      : useStackedTwoRowGrid
                        ? 'minmax(240px, 1fr) minmax(240px, 1fr)'
                        : 'none',
                    gap: useDesktopSplitGrid ? 0 : useStackedTwoRowGrid ? 1.5 : 0,
                    alignContent: 'stretch',
                  }}
                >
                  <HPaper
                    sx={{
                      gridColumn: 1,
                      gridRow: 1,
                      minWidth: 0,
                      minHeight: { xs: 280, md: 0 },
                      display: 'flex',
                      flexDirection: 'column',
                      border: `1px solid ${idmLayoutColors.border}`,
                      borderRadius: expandedPane === 'editor' ? '14px' : '12px',
                      overflow: 'hidden',
                      boxShadow: expandedPane === 'editor' ? `0 24px 64px -12px rgba(15, 23, 42, 0.35)` : 'none',
                      ...(expandedPane === 'editor'
                        ? {
                            position: 'fixed',
                            top: { xs: 12, sm: 20 },
                            left: { xs: 12, sm: 20 },
                            right: { xs: 12, sm: 20 },
                            bottom: { xs: 12, sm: 20 },
                            zIndex: (t) => t.zIndex.modal,
                            maxHeight: 'none',
                          }
                        : {}),
                      ...(expandedPane === 'preview'
                        ? {
                            position: 'fixed',
                            left: -9999,
                            top: 0,
                            width: 640,
                            height: 480,
                            opacity: 0,
                            pointerEvents: 'none',
                            overflow: 'hidden',
                            zIndex: -1,
                            border: 'none',
                          }
                        : {}),
                    }}
                  >
                    <Stack
                      direction="row"
                      alignItems="center"
                      justifyContent="space-between"
                      sx={{
                        px: 1.25,
                        py: 0.75,
                        flexShrink: 0,
                        borderBottom: `1px solid ${idmLayoutColors.border}`,
                      }}
                    >
                      <HLabel
                        value={intl.formatMessage({ id: 'utility.previewAndDocxEditor.docEditor', defaultMessage: 'Document editor' })}
                        translate={false}
                        colon={false}
                        sx={{
                          fontFamily: idmFontFamily,
                          fontSize: 12,
                          fontWeight: 600,
                          color: theme.palette.text.secondary,
                          textTransform: 'uppercase',
                          letterSpacing: 0.4,
                        }}
                      />
                      <Tooltip title={expandedPane === 'editor' ? intl.formatMessage({ id: 'utility.previewAndDocxEditor.exitFullscreenTooltip', defaultMessage: 'Exit full screen (Esc)' }) : intl.formatMessage({ id: 'utility.previewAndDocxEditor.maximizeEditorTooltip', defaultMessage: 'Maximize editor' })}>
                        <span>
                          <IconButton
                            size="small"
                            onClick={() => setExpandedPane(expandedPane === 'editor' ? null : 'editor')}
                            disabled={!scriptUrl || !ooConfig}
                            sx={{ color: idmLayoutColors.text.secondary }}
                          >
                            {expandedPane === 'editor' ? (
                              <FullscreenExitIcon fontSize="small" />
                            ) : (
                              <FullscreenIcon fontSize="small" />
                            )}
                          </IconButton>
                        </span>
                      </Tooltip>
                    </Stack>
                    <Box
                      id={CONTAINER_ID}
                      sx={{
                        flex: 1,
                        minWidth: 0,
                        minHeight: { xs: 240, md: 200 },
                        width: '100%',
                        bgcolor: '#fff',
                        visibility: scriptUrl && ooConfig ? 'visible' : 'hidden',
                        overflow: 'hidden',
                      }}
                    />
                  </HPaper>

                  {useDesktopSplitGrid ? (
                    <HBox
                      role="separator"
                      aria-orientation="vertical"
                      aria-label="Resize editor and preview"
                      onPointerDown={(e) => {
                        e.preventDefault()
                        splitDraggingRef.current = true
                        document.body.style.cursor = 'col-resize'
                        document.body.style.userSelect = 'none'
                      }}
                      sx={{
                        gridColumn: 2,
                        gridRow: 1,
                        zIndex: 2,
                        display: 'flex',
                        alignItems: 'stretch',
                        justifyContent: 'center',
                        cursor: 'col-resize',
                        touchAction: 'none',
                        mx: -0.5,
                        px: 0.5,
                        '&:hover .preview-split-line': {
                          opacity: 1,
                        },
                      }}
                    >
                      <Box
                        className="preview-split-line"
                        sx={{
                          width: 3,
                          alignSelf: 'stretch',
                          borderRadius: 1,
                          bgcolor: idmLayoutColors.border,
                          opacity: 0.85,
                        }}
                      />
                    </HBox>
                  ) : null}

                  <HPaper
                    sx={{
                      gridColumn: isMdUp ? 3 : 1,
                      gridRow: isMdUp ? 1 : 2,
                      minWidth: 0,
                      display: expandedPane === 'editor' ? 'none' : 'flex',
                      flexDirection: 'column',
                      minHeight: { xs: 280, md: 0 },
                      borderRadius: '14px',
                      overflow: 'hidden',
                      position: 'relative',
                      boxShadow:
                        expandedPane === 'preview'
                          ? `0 24px 64px -12px rgba(15, 23, 42, 0.35)`
                          : `0 8px 28px -8px rgba(3, 120, 166, 0.18), 0 2px 8px -2px rgba(15, 23, 42, 0.06)`,
                      ...(expandedPane === 'preview'
                        ? {
                            position: 'fixed',
                            top: { xs: 12, sm: 20 },
                            left: { xs: 12, sm: 20 },
                            right: { xs: 12, sm: 20 },
                            bottom: { xs: 12, sm: 20 },
                            zIndex: (t) => t.zIndex.modal,
                            maxHeight: 'none',
                          }
                        : {}),
                    }}
                  >
                    <HBox sx={{ p: 1.5, borderBottom: `1px solid ${idmLayoutColors.border}` }}>
                      <Stack direction="row" alignItems="flex-start" justifyContent="space-between" spacing={1}>
                        <Stack spacing={1.25} sx={{ flex: 1, minWidth: 0 }}>
                          <HTextField
                            label={intl.formatMessage({ id: 'utility.previewAndDocxEditor.to', defaultMessage: 'To' })}
                            size="small"
                            value={emailTo}
                            editable
                            onChange={(e) => setEmailTo(e.target.value)}
                            placeholder="recipient@example.com"
                            fullWidth
                            sx={{
                              '& .MuiInputLabel-root': { fontSize: 12, fontFamily: idmFontFamily },
                              '& .MuiInputBase-input': { fontFamily: idmFontFamily, fontSize: 13 },
                            }}
                          />
                          <HTextField
                            label={intl.formatMessage({ id: 'utility.previewAndDocxEditor.subject', defaultMessage: 'Subject' })}
                            size="small"
                            value={subject}
                            editable
                            onChange={(e) => setSubject(e.target.value)}
                            fullWidth
                            sx={{
                              '& .MuiInputLabel-root': { fontSize: 12, fontFamily: idmFontFamily },
                              '& .MuiInputBase-input': { fontFamily: idmFontFamily, fontSize: 13 },
                            }}
                          />
                        </Stack>
                        <Tooltip title={expandedPane === 'preview' ? intl.formatMessage({ id: 'utility.previewAndDocxEditor.exitFullscreenTooltip', defaultMessage: 'Exit full screen (Esc)' }) : intl.formatMessage({ id: 'utility.previewAndDocxEditor.maximizePreviewTooltip', defaultMessage: 'Maximize preview' })}>
                          <IconButton
                            size="small"
                            onClick={() => setExpandedPane(expandedPane === 'preview' ? null : 'preview')}
                            sx={{ color: theme.palette.text.secondary, mt: 0.25, flexShrink: 0 }}
                          >
                            {expandedPane === 'preview' ? (
                              <FullscreenExitIcon fontSize="small" />
                            ) : (
                              <FullscreenIcon fontSize="small" />
                            )}
                          </IconButton>
                        </Tooltip>
                      </Stack>
                    </HBox>

                    {previewHtmlLoading && !waitingForEditor && (
                      <LinearProgress
                        sx={{
                          height: 3,
                          borderRadius: 1,
                          '& .MuiLinearProgress-bar': {
                            borderRadius: 1,
                          },
                        }}
                      />
                    )}

                    <HBox
                      sx={{
                        flex: 1,
                        p: 1.5,
                        overflow: 'auto',
                        position: 'relative',
                        minHeight: 160,
                      }}
                    >
                      {waitingForEditor ? (
                        <Stack alignItems="center" justifyContent="center" spacing={1.5} sx={{ py: 5 }}>
                          <CircularProgress size={28} sx={{ color: idmLayoutColors.primary }} />
                          <HLabel
                            value={intl.formatMessage({ id: 'utility.previewAndDocxEditor.openingEditor', defaultMessage: 'Opening editor…' })}
                            translate={false}
                            colon={false}
                            sx={{ fontFamily: idmFontFamily, fontSize: 13, color: theme.palette.text.secondary }}
                          />
                          <HLabel
                            value={intl.formatMessage({ id: 'utility.previewAndDocxEditor.openingEditorSubtitle', defaultMessage: 'Live HTML preview appears after the document is ready.' })}
                            translate={false}
                            colon={false}
                            sx={{
                              fontFamily: idmFontFamily,
                              fontSize: 12,
                              color: theme.palette.text.secondary,
                              textAlign: 'center',
                              maxWidth: 280,
                            }}
                          />
                        </Stack>
                      ) : !bodyHtml.trim() && previewHtmlLoading ? (
                        <Stack alignItems="center" justifyContent="center" spacing={1.5} sx={{ py: 5 }}>
                          <CircularProgress size={28} sx={{ color: idmLayoutColors.primary }} />
                          <HLabel
                            value={intl.formatMessage({ id: 'utility.previewAndDocxEditor.loadingHtml', defaultMessage: 'Loading preview HTML…' })}
                            translate={false}
                            colon={false}
                            sx={{ fontFamily: idmFontFamily, fontSize: 13, color: theme.palette.text.secondary }}
                          />
                        </Stack>
                      ) : (
                        <HBox
                          sx={{
                            maxWidth: '100%',
                            mx: 'auto',
                            borderRadius: '12px',
                            boxShadow: `0 12px 40px -16px rgba(15, 23, 42, 0.12), 0 0 0 1px rgba(3, 120, 166, 0.06)`,
                            overflow: 'hidden',
                            opacity: previewHtmlLoading ? 0.55 : 1,
                            flexDirection: 'column',
                          }}
                        >
                          <HBox
                            sx={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: 1.25,
                              px: 1.75,
                              py: 1,
                              borderBottom: `1px solid ${idmLayoutColors.border}`,
                            }}
                          >
                            <Stack direction="row" spacing={0.65} alignItems="center" sx={{ flexShrink: 0 }}>
                              {['#ef4444', '#eab308', '#22c55e'].map((c) => (
                                <Box
                                  key={c}
                                  sx={{ width: 9, height: 9, borderRadius: '50%', bgcolor: c, opacity: 0.92 }}
                                />
                              ))}
                            </Stack>
                            <HLabel
                              value={intl.formatMessage({ id: 'utility.previewAndDocxEditor.liveHtmlPreview', defaultMessage: 'Live HTML preview' })}
                              translate={false}
                              colon={false}
                              sx={{
                                fontFamily: idmFontFamily,
                                fontSize: 11,
                                fontWeight: 600,
                                color: theme.palette.text.secondary,
                                letterSpacing: 0.35,
                                textTransform: 'uppercase',
                              }}
                            />
                          </HBox>
                          <Box
                            sx={{
                              px: { xs: 2, sm: 2.75 },
                              py: { xs: 2.25, sm: 2.75 },
                              minHeight: 140,
                              fontSize: 14,
                              lineHeight: 1.65,
                              color: theme.palette.text.primary,
                              fontFamily: idmFontFamily,
                              wordBreak: 'break-word',
                              '& img': { maxWidth: '100%', height: 'auto', borderRadius: '6px' },
                              '& table': { maxWidth: '100%', borderCollapse: 'collapse' },
                              '& a': { color: idmLayoutColors.primary, textDecoration: 'underline' },
                              '& p': { marginTop: 0, marginBottom: '0.85em' },
                              '& p:last-child': { marginBottom: 0 },
                              '& ul, & ol': { paddingLeft: '1.25rem', marginTop: 0, marginBottom: '0.85em' },
                              '& blockquote': {
                                margin: '0.5em 0',
                                paddingLeft: '1rem',
                                borderLeft: `4px solid ${idmLayoutColors.primaryLight}`,
                                color: theme.palette.text.secondary,
                              },
                            }}
                            dangerouslySetInnerHTML={{ __html: bodyHtml || '' }}
                          />
                          {!bodyHtml.trim() && !previewHtmlLoading && editorReady ? (
                            <HBox
                              sx={{
                                px: 2.75,
                                py: 4,
                                textAlign: 'center',
                                borderTop: `1px dashed ${idmLayoutColors.border}`,
                                justifyContent: 'center',
                              }}
                            >
                              <HLabel
                                value={intl.formatMessage({ id: 'utility.previewAndDocxEditor.noHtmlMessage', defaultMessage: 'No HTML yet. Save the document in the editor to generate preview.' })}
                                translate={false}
                                colon={false}
                                sx={{ fontFamily: idmFontFamily, fontSize: 13, color: theme.palette.text.secondary }}
                              />
                            </HBox>
                          ) : null}
                        </HBox>
                      )}
                      <Backdrop
                        open={editorReady && previewHtmlLoading && !!bodyHtml.trim()}
                        sx={{
                          position: 'absolute',
                          inset: 0,
                          zIndex: 2,
                          borderRadius: 0,
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}
                      >
                        <HPaper
                          elevation={0}
                          sx={{
                            px: 2.5,
                            py: 2,
                            borderRadius: '12px',
                            border: `1px solid ${idmLayoutColors.border}`,
                            boxShadow: `0 12px 32px -12px rgba(3, 120, 166, 0.2)`,
                          }}
                        >
                          <Stack alignItems="center" spacing={1.25}>
                            <CircularProgress size={32} sx={{ color: idmLayoutColors.primary }} />
                            <HLabel
                              value={intl.formatMessage({ id: 'utility.previewAndDocxEditor.updating', defaultMessage: 'Updating preview…' })}
                              translate={false}
                              colon={false}
                              sx={{
                                fontFamily: idmFontFamily,
                                fontSize: 12,
                                fontWeight: 600,
                                color: theme.palette.text.secondary,
                              }}
                            />
                          </Stack>
                        </HPaper>
                      </Backdrop>
                    </HBox>

                    <HBox
                      sx={{
                        px: 1.5,
                        py: 1,
                        borderTop: `1px solid ${idmLayoutColors.border}`,
                        fontSize: 11,
                        fontFamily: idmFontFamily,
                        color: theme.palette.text.secondary,
                      }}
                    >
                      {intl.formatMessage({ id: 'utility.previewAndDocxEditor.instructionsFooter', defaultMessage: 'Use Save (Ctrl+S) or File → Save / Force save in the editor; the preview reloads from the server after the document is stored.' })}
                    </HBox>
                  </HPaper>
                </HBox>
              </HBox>
            </HPaper>
          </HBox>
        </Container>
      </HBox>
  )
}