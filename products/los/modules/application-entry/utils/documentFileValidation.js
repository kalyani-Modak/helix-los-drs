
export const MAX_DOCUMENT_FILE_SIZE = 10 * 1024 * 1024; // 10 MB

export const ALLOWED_DOCUMENT_FILES = {
  ".pdf": ["application/pdf"],
  ".jpg": ["image/jpeg"],
  ".jpeg": ["image/jpeg"],
  ".png": ["image/png"],
};

export const ACCEPTED_DOCUMENT_FILES = Object.entries(
  ALLOWED_DOCUMENT_FILES
)
  .flatMap(([extension, mimeTypes]) => [
    extension,
    ...mimeTypes,
  ])
  .join(",");
