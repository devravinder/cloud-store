import { DELETE, DOWNLOAD, LINK, VIEW } from "./icons";

export default function ListView({
  files,
  onDelete,
  onDownload,
  onView,
  onCopyLick,
}: {
  files: FileMeta[];
  onDownload: (id: string) => void;
  onView: (id: string) => void;
  onDelete: (id: string) => void;
  onCopyLick: (id: string) => void;
}) {
  return (
    <div className="flex flex-col p-4 pb-8 rounded-lg bg-white shadow">
      <div className="max-h-75 rounded-lg overflow-y-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr>
              <th className="hidden sm:table-cell">Id</th>
              <th>File</th>
              <th>Size</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {files.length == 0 && (
              <tr>
                <td colSpan={4} className="text-center py-4">
                  No files found
                </td>
              </tr>
            )}

            {files.map((file) => (
              <tr key={file.id}>
                <td data-label="Id" className="hidden sm:table-cell">
                  {file.id}
                </td>
                <td data-label="File">{file.name}</td>
                <td data-label="Size">{(file.size / 1024).toFixed(2)} KB</td>
                <td data-label="Actions" className="flex flex-row gap-2 flex-wrap">
                  <button
                    className="disabled:cursor-not-allowed text-blue-500 cursor-pointer inline-flex items-center px-3 py-2 bg-slate-100 text-sm font-medium rounded-lg hover:bg-slate-200 "
                    title="Download"
                    onClick={() => onCopyLick(file.id)}
                  >
                    {LINK}
                  </button>
                  <button
                    className="disabled:cursor-not-allowed text-blue-500 cursor-pointer inline-flex items-center px-3 py-2 bg-slate-100 text-sm font-medium rounded-lg hover:bg-slate-200 "
                    title="Download"
                    onClick={() => onDownload(file.id)}
                  >
                    {DOWNLOAD}
                  </button>
                  <button
                    className="disabled:cursor-not-allowed text-blue-500 cursor-pointer inline-flex items-center px-3 py-2 bg-slate-100 text-sm font-medium rounded-lg hover:bg-slate-200 "
                    title="View"
                    onClick={() => onView(file.id)}
                  >
                    {VIEW}
                  </button>
                  <button
                    className="disabled:cursor-not-allowed text-blue-500 cursor-pointer inline-flex items-center px-3 py-2 bg-slate-100 text-sm font-medium rounded-lg hover:bg-slate-200 "
                    title="Delete"
                    onClick={() => onDelete(file.id)}
                  >
                    {DELETE}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
