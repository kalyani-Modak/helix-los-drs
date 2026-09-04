import { HAxiosService } from "@helix/component-library";
import { UserManagementAPI } from "./apiEndpoints";

/**
 * Downloads a sample file from the user-management samples API.
 * Uses blob response handling to avoid corrupted downloads from double-wrapping.
 */
export async function downloadSampleFile(fileName, toast) {
  try {
    const response = await HAxiosService.GET(
      UserManagementAPI.download_sample(fileName),
      { responseType: "blob" },
    );

    if (!response || !response.data || response.data.size === 0) {
      toast?.error?.("File not found");
      return;
    }

    if (response.status >= 400) {
      toast?.error?.("Download failed");
      return;
    }

    const blob =
      response.data instanceof Blob ? response.data : new Blob([response.data]);

    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    link.remove();

    setTimeout(() => {
      window.URL.revokeObjectURL(url);
    }, 1000);

    toast?.success?.("Downloaded successfully");
  } catch {
    toast?.error?.("Download failed");
  }
}
