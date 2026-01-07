import { useEffect, useState } from "react";
import ContentPreview from "./ContentPreview";
import Header from "./Header";
import ListView from "./ListView";

const API = import.meta.env.VITE_WEB_APP_BASE_API_URL;
export default function DashBoard() {
  const [files, setFiles] = useState<FileMeta[]>([]);
  const [content, setContent] = useState("");

  async function loadFiles() {
    const res = await fetch(API);
    const files = await res.json();
    setFiles(files);
  }

  async function uploadFile(files: FileList | null) {
    setContent("");

    if (!files) return;

    const form = new FormData();
    form.append("file", files.item(0) as File);

    const res = await fetch(`${API}/upload`, {
      method: "POST",
      body: form,
    });

    const data = await res.json();
    if (!res.ok) return alert(data.error);

    loadFiles();
  }

  function downloadFile(id: string) {
    window.open(`${API}/download/${id}`, "_blank");
  }

  async function viewContent(id: string) {
    const res = await fetch(`${API}/content/${id}`);
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

    await fetch(`${API}/${id}`, { method: "DELETE" });
    loadFiles();
  }

  useEffect(() => {
    const syncData=async()=>{
        await loadFiles()
    }
    syncData()
  }, [])
  

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

      <ContentPreview onCopyContent={copyContent} content={content}/>
    </div>
  );
}
