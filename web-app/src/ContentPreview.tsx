import { COPY } from './icons'

export default function ContentPreview({content, onCopyContent}:{onCopyContent:VoidFunction, content: string}) {
  return (
    <div className="flex flex-col gap-4 p-4 rounded-lg  bg-white shadow">
            <div className="flex items-center justify-between">
              <h3 className="text-lg text-slate-700">File Content</h3>
              <button
                onClick={onCopyContent}
                disabled={!content}
                className="disabled:cursor-not-allowed text-blue-500 cursor-pointer inline-flex items-center px-3 py-2 bg-slate-100 text-sm font-medium rounded-lg hover:bg-slate-200 "
                title="Copy content"
              >
                {COPY}
              </button>
            </div>
    
            <pre className="bg-black text-white max-h-72 overflow-auto rounded-lg p-4">
              {content || "Select a file to view content"}
            </pre>
          </div>
  )
}
