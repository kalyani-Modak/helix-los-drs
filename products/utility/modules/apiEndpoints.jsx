import { getDmsApiPath, getUtilityApiPath } from "@shared/config/apiConstants";

const dmsV1Api = () => `${getDmsApiPath()}v1/api`;

/** Helix DMS (`helix-dms`) — paths align with `dms.api.base-path` default `/v1/api`. */
export const dmsAPI = {
  documentsInitiate: () => `${dmsV1Api()}/documents/upload:initiate`,
  documentUpload: (documentId, versionId) =>
    `${dmsV1Api()}/documents/${encodeURIComponent(documentId)}/upload?versionId=${encodeURIComponent(versionId)}`,
  versionsInitiate: (documentId) =>
    `${dmsV1Api()}/documents/${encodeURIComponent(documentId)}/versions:initiate`,
  documentsSearch: () => `${dmsV1Api()}/documents:search`,
  documentRetrieve: (documentId, version = "latest") =>
    `${dmsV1Api()}/documents/${encodeURIComponent(documentId)}?version=${encodeURIComponent(version)}`,
  documentVersions: (documentId) =>
    `${dmsV1Api()}/documents/${encodeURIComponent(documentId)}/versions`,
  retentionControls: (documentId) =>
    `${dmsV1Api()}/documents/${encodeURIComponent(documentId)}/retention-controls`,
  documentVersionDelete: (documentId, versionId, hardDelete = false) => {
    const q = new URLSearchParams();
    if (hardDelete) q.set("hardDelete", "true");
    const qs = q.toString();
    return `${dmsV1Api()}/documents/${encodeURIComponent(documentId)}/versions/${encodeURIComponent(versionId)}${qs ? `?${qs}` : ""}`;
  },
  auditVerify: () => `${dmsV1Api()}/audit/verify`,
  viewerSessions: (documentId) =>
    `${dmsV1Api()}/documents/${encodeURIComponent(documentId)}/viewer-sessions`,
  viewerManifest: (viewerSessionId, sessionToken) =>
    `${dmsV1Api()}/viewer-sessions/${encodeURIComponent(viewerSessionId)}/manifest?sessionToken=${encodeURIComponent(sessionToken)}`,
  viewerArtifactContent: (viewerSessionId, sessionToken) =>
    `${dmsV1Api()}/viewer-sessions/${encodeURIComponent(viewerSessionId)}/artifacts/content?sessionToken=${encodeURIComponent(sessionToken)}`,
  viewerArtifactAsset: (viewerSessionId, assetId, sessionToken) =>
    `${dmsV1Api()}/viewer-sessions/${encodeURIComponent(viewerSessionId)}/artifacts/${encodeURIComponent(assetId)}?sessionToken=${encodeURIComponent(sessionToken)}`,
};

export const utilityAPI = {
  templates: () => `${getUtilityApiPath()}v1/api/templates`,
  /**
   * Spring Data page: page (0-based), size, optional sort and filters (omit empty strings).
   * q = case-insensitive substring match on template name (backend).
   */
  templatesPage: ({ page, size, sort = "updatedAt,desc", moduleId = "", channel = "", templateType = "", q = "" }) => {
    const p = new URLSearchParams();
    p.set("page", String(page));
    p.set("size", String(size));
    p.set("sort", sort);
    if (moduleId) p.set("moduleId", moduleId);
    if (channel) p.set("channel", channel);
    if (templateType) p.set("templateType", templateType);
    if (q) p.set("q", q);
    return `${getUtilityApiPath()}v1/api/templates/page?${p.toString()}`;
  },
  getChannelsModulesAndTypes: () => `${getUtilityApiPath()}v1/api/config/channels_modules_types`,
  settingDocServer: () => `${getUtilityApiPath()}v1/api/onlyoffice/document-server`,
  onlyofficeConfig: () => `${getUtilityApiPath()}v1/api/onlyoffice/config`,
  /** OnlyOffice init for utility email preview (DOCX/HTML staging table). */
  onlyofficePreviewConfig: (templateId) =>
    `${getUtilityApiPath()}v1/api/onlyoffice/preview-config?templateId=${encodeURIComponent(templateId)}`,
  templateEmailPreview: (id) =>
    `${getUtilityApiPath()}v1/api/templates/${encodeURIComponent(id)}/email-preview`,
  templateEmailPreviewInit: (id) =>
    `${getUtilityApiPath()}v1/api/templates/${encodeURIComponent(id)}/email-preview/init`,
  templateEmailPreviewSend: (id) =>
    `${getUtilityApiPath()}v1/api/templates/${encodeURIComponent(id)}/email-preview/send`,
  /** POST: validate merge JSON (DB attributes) → { data: { redirectUrl } } */
  templateEmailPreviewPrepare: () =>
    `${getUtilityApiPath()}v1/api/templates/email-preview/prepare`,
  /** GET: staged preview DOCX → PDF (blob) */
  templateEmailPreviewPdf: (id) =>
    `${getUtilityApiPath()}v1/api/templates/${encodeURIComponent(id)}/email-preview/pdf`,
  /** Merge-field metadata for a business module (metamodel attributes). */
  onlyofficeFields: (moduleCode) =>
    `${getUtilityApiPath()}v1/api/onlyoffice/fields/${encodeURIComponent(moduleCode)}`,
  /** Full template row by id (includes moduleId for field list). */
  templateConfigById: (id) => `${getUtilityApiPath()}v1/api/templates/config/${encodeURIComponent(id)}`,
  /** Plain-text SMS/WhatsApp body for utility text editor (GET/PUT). */
  templateTextContent: (id) =>
    `${getUtilityApiPath()}v1/api/templates/${encodeURIComponent(id)}/text-content`,
  /** Toggle {@code is_text_media} (plain text vs DOCX / OnlyOffice). */
  templateTextMedia: (id) =>
    `${getUtilityApiPath()}v1/api/templates/${encodeURIComponent(id)}/text-media`,
  /** Draft / publish / version snapshot for editor toolbars (no binary). */
  templateEditorState: (id) =>
    `${getUtilityApiPath()}v1/api/templates/${encodeURIComponent(id)}/editor-state`,
  discardDraft: (id) =>
    `${getUtilityApiPath()}v1/api/templates/${encodeURIComponent(id)}/discard-draft`,
  getTemplateAttributes: (id) => `${getUtilityApiPath()}v1/api/fetch/attributes/${id}`,
  getTemplatesByModuleChannel: (module, channel) =>
    `${getUtilityApiPath()}v1/api/templates/templates-by-module-channel/${encodeURIComponent(module)}/${encodeURIComponent(channel)}`,
  testSendCommunication: (channel) =>
    `${getUtilityApiPath()}v1/api/notify/${encodeURIComponent(channel)}`,
};
