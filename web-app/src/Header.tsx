import FileInput from "./FileInput";
import { useAuthentication } from "./hooks/useAuthentication";
import { REFRESH, UPLOAD } from "./icons";

export default function Header({
  onRefresh,
  onUpload,
}: {
  onRefresh: VoidFunction;
  onUpload: (files: FileList | null) => void;
}) {
  const { user, logout } = useAuthentication();
  return (
    <h1 className="flex flex-row justify-between items-center">
      <div className="inline-flex items-baseline gap-2">
        <img src="/favicon.png" className="w-8 h-8" />
        <span className="text-4xl font-bold">Cloud Store</span>
      </div>
      <div className="flex flex-row gap-4 items-center">
        <FileInput label={UPLOAD} onChange={onUpload} title="Upload" />
        <button
          onClick={onRefresh}
          title="Refresh"
          className=" text-blue-500 cursor-pointer inline-flex items-center px-3 py-2 bg-slate-100 text-lg font-bold rounded-lg hover:bg-slate-200 "
        >
          {REFRESH}
        </button>
        {user && (
          <div className="flex gap-2 items-center">
            <span>{user.displayName}</span>
            <button
              onClick={logout}
              className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
            >
              Logout
            </button>
          </div>
        )}
      </div>
    </h1>
  );
}
