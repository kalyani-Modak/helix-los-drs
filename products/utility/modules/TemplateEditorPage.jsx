import React, { useEffect, useMemo, useState } from 'react'
import { useSearchParams, useParams, Navigate, Link as RouterLink } from 'react-router-dom'
import { CircularProgress, Stack, useTheme } from '@mui/material'
import { useIntl } from 'react-intl'
import { utilityAPI } from './apiEndpoints'
import DocxEditor from './DocxEditor'
import TextEditor from './TextEditor'
import { idmFontFamily, idmLayoutColors } from './userScreenTokens'
import { HBox, HButton, HLabel, HAxiosService } from '@helix/component-library'

/**
 * Single entry URL: `/homelayout/editor?id=<templateUuid>`.
 * Resolves text vs DOCX from the server and mounts {@link TextEditor} or {@link DocxEditor}.
 */
export default function TemplateEditorPage() {
  const intl = useIntl()
  const theme = useTheme()
  const [searchParams] = useSearchParams()
  const id = useMemo(() => searchParams.get('id')?.trim() ?? '', [searchParams])
  const embedded = useMemo(() => searchParams.get('embedded') === '1', [searchParams])
  const [mode, setMode] = useState('loading')

  useEffect(() => {
    if (!id) {
      setMode('error')
      return
    }
    let cancelled = false
    ;(async () => {
      setMode('loading')
      try {
        const res = await HAxiosService.GET(
          utilityAPI.templateEditorState(id)
        )
        const ok = (res.data?.status || '').toLowerCase() === 'success'
        const data = res.data?.data
        if (cancelled) return
        if (ok && data && typeof data.textChannelMode === 'boolean') {
          setMode(data.textChannelMode ? 'text' : 'doc')
        } else {
          setMode('error')
        }
      } catch {
        if (!cancelled) setMode('error')
      }
    })()
    return () => {
      cancelled = true
    }
  }, [id])

  if (!id) {
    return <Navigate to="/homelayout/templatelist" replace />
  }

  if (mode === 'loading') {
    return (
      <HBox
        sx={{
          minHeight: 'calc(100vh - 64px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Stack alignItems="center" spacing={2}>
          <CircularProgress sx={{ color: idmLayoutColors.primary }} />
          <HLabel
            value={intl.formatMessage({ id: 'utility.templateEditorPage.opening', defaultMessage: 'Opening template…' })}
            translate={false}
            colon={false}
            sx={{ fontFamily: idmFontFamily, fontSize: 14, color: theme.palette.text.secondary }}
          />
        </Stack>
      </HBox>
    )
  }

  if (mode === 'error') {
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
        <Stack alignItems="center" spacing={2}>
          <HLabel
            value={intl.formatMessage({ id: 'utility.templateEditorPage.errorMsg', defaultMessage: 'Could not open this template. It may have been removed or the link is invalid.' })}
            translate={false}
            colon={false}
            sx={{ fontFamily: idmFontFamily, color: theme.palette.text.primary }}
          />
          <HButton
            component={RouterLink}
            to="/homelayout/templatelist"
            variant="contained"
            label="utility.templateEditorPage.backToTemplates"
          />
        </Stack>
      </HBox>
    )
  }

  if (mode === 'text') {
    return <TextEditor templateId={id} />
  }

  return <DocxEditor templateId={id} embedded={embedded} />
}

/** Old routes `editor/:name` and `rich-editor/:name` → unified `/homelayout/editor?id=`. */
export function LegacyTemplateEditorRedirect() {
  const { name } = useParams()
  return <Navigate to={`/homelayout/editor?id=${encodeURIComponent(name || '')}`} replace />
}
