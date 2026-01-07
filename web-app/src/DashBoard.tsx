import { useEffect, useState } from "react";
import ContentPreview from "./ContentPreview";
import Header from "./Header";
import ListView from "./ListView";
import { withAccessToken } from "./util/firebaseUtil";

const API = import.meta.env.VITE_WEB_APP_BASE_API_URL;
export default function DashBoard() {
  const [files, setFiles] = useState<FileMeta[]>([]);
  const [content, setContent] = useState("");

  async function loadFiles() {
    const res = await withAccessToken(({ headers }) => fetch(API, { headers }));
    const files = await res.json();
    setFiles(files);
  }

  async function uploadFile(files: FileList | null) {
    setContent("");

    if (!files) return;

    const form = new FormData();
    form.append("file", files.item(0) as File);

    const res = await withAccessToken(({ headers }) =>
      fetch(`${API}/upload`, {
        method: "POST",
        body: form,
        headers,
      })
    );

    const data = await res.json();
    if (!res.ok) return alert(data.error);

    loadFiles();
  }

  async function downloadFile(id: string) {
    //  window.open(`${API}/download/${id}`, "_blank");

    const response = await withAccessToken(({ headers }) =>
      fetch(`${API}/download/${id}`, {
        headers,
      })
    );

    const disposition = response.headers.get("Content-Disposition");
    let filename = "download";

    if (disposition) {
      const match = disposition.match(/filename=(?:(?:"([^"]+)")|([^;]+))/);
      filename = match?.[1] || match?.[2] || "download";
      filename = filename.trim();
    }

    if (!response.ok) {
      throw new Error("Download failed");
    }

    // ⬇️ Convert response to Blob

    const contentType =
      response.headers.get("Content-Type") || "application/octet-stream";
    const blob = await response.blob();
    const typedBlob = new Blob([blob], { type: contentType });

    // 📦 Create temporary download link
    const url = window.URL.createObjectURL(typedBlob);
    const a = document.createElement("a");

    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();

    // 🧹 Cleanup
    a.remove();
    window.URL.revokeObjectURL(url);
  }

  async function viewContent(id: string) {
    const res = await withAccessToken(({ headers }) =>
      fetch(`${API}/content/${id}`, { headers })
    );

    if (!res.ok) return alert("Unable to read file");

    const text = await res.text();
    setContent(text);
  }

  function copyContent() {
    if (!content) return;
    navigator.clipboard.writeText(content);
  }

  function copyLick(id: string) {
    navigator.clipboard.writeText(`${API}/download/${id}`);
  }

  async function deleteFile(id: string) {
    if (!confirm("Delete this file?")) return;

    await withAccessToken(({ headers }) =>
      fetch(`${API}/${id}`, { headers, method: "DELETE" })
    );

    loadFiles();
  }

  useEffect(() => {
    const syncData = async () => {
      await loadFiles();
    };
    syncData();
  }, []);

  return (
    <div className="p-4 sm:p-8 flex flex-col gap-8">
      <Header onUpload={uploadFile} onRefresh={loadFiles} />
      <ListView
        files={files}
        onDelete={deleteFile}
        onView={viewContent}
        onDownload={downloadFile}
        onCopyLick={copyLick}
      />

      <ContentPreview onCopyContent={copyContent} content={content} />
    </div>
  );
}
