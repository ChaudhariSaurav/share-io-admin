// src/pages/Dashboardpage.js
import React, { useEffect, useState } from "react";
import { ref, remove, update } from "firebase/database";
import { database } from "../config/firebaseConfig";
import {
  Search,
  Filter,
  SortAsc,
  Trash2,
  Edit3,
  Eye,
  Hash,
  Inbox,
  Loader2,
  X,
} from "lucide-react";
import toast, { Toaster } from "react-hot-toast";
import useUserStore from "../store/userStore";

// ✅ Utility for file size
const formatFileSize = (bytes) => {
  if (!bytes) return "0 KB";
  const kb = bytes / 1024;
  if (kb < 1024) return `${kb.toFixed(2)} KB`;
  return `${(kb / 1024).toFixed(2)} MB`;
};

const Dashboardpage = () => {
  const { data: sharedFiles, fetchSharesOnce, isLoggedIn } = useUserStore();

  const [files, setFiles] = useState([]);
  const [filteredFiles, setFilteredFiles] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [fileType, setFileType] = useState("all");
  const [sortBy, setSortBy] = useState("newest");
  const [loading, setLoading] = useState(true);

  // Pagination
  const itemsPerPage = 8;
  const [currentPage, setCurrentPage] = useState(1);

  // Modal
  const [modalFile, setModalFile] = useState(null);

  // Fetch files after login
  useEffect(() => {
    const loadData = async () => {
      if (isLoggedIn) {
        setLoading(true);
        try {
          await fetchSharesOnce();
        } catch (err) {
          console.error(err);
          toast.error("Failed to fetch files");
        } finally {
          setLoading(false);
        }
      } else {
        setLoading(false);
      }
    };
    loadData();
  }, [isLoggedIn, fetchSharesOnce]);

  // Update local state whenever sharedFiles changes
  useEffect(() => {
    setFiles(sharedFiles);
  }, [sharedFiles]);

  // Filter & sort
  useEffect(() => {
    let result = [...files];

    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(
        (file) =>
          file.name.toLowerCase().includes(term) ||
          file.shareId.toLowerCase().includes(term),
      );
    }

    if (fileType !== "all") {
      result = result.filter((file) => file.type === fileType);
    }

    if (sortBy === "newest") result.sort((a, b) => b.createdAt - a.createdAt);
    else if (sortBy === "oldest")
      result.sort((a, b) => a.createdAt - b.createdAt);
    else if (sortBy === "sizeAsc") result.sort((a, b) => a.size - b.size);
    else if (sortBy === "sizeDesc") result.sort((a, b) => b.size - a.size);

    setFilteredFiles(result);
    setCurrentPage(1);
  }, [searchTerm, fileType, sortBy, files]);

  // Delete a file/share and update UI
  const handleDelete = (shareId, fileIndex = null) => {
    const confirmMsg =
      fileIndex !== null
        ? "Are you sure you want to delete this file?"
        : "Are you sure you want to delete this share?";
    if (!window.confirm(confirmMsg)) return;

    const path =
      fileIndex !== null
        ? `shares/${shareId}/files/${fileIndex}`
        : `shares/${shareId}`;

    remove(ref(database, path))
      .then(() => {
        toast.success("🗑️ Deleted successfully");
        setFiles((prev) =>
          fileIndex !== null
            ? prev.filter(
                (f) => !(f.shareId === shareId && f.fileIndex === fileIndex),
              )
            : prev.filter((f) => f.shareId !== shareId),
        );
      })
      .catch((err) => toast.error("❌ Delete failed: " + err.message));
  };

  const handleUpdate = (shareId, fileIndex, newName) => {
    if (!newName) return;
    update(ref(database, `shares/${shareId}/files/${fileIndex}`), {
      name: newName,
    })
      .then(() => {
        toast.success("✏️ File renamed");
        setFiles((prev) =>
          prev.map((f) =>
            f.shareId === shareId && f.fileIndex === fileIndex
              ? { ...f, name: newName }
              : f,
          ),
        );
      })
      .catch((err) => toast.error("❌ Update failed: " + err.message));
  };

  // Pagination
  const totalPages = Math.ceil(filteredFiles.length / itemsPerPage);
  const visibleFiles = filteredFiles.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
  );

  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 via-gray-200 to-gray-300 relative">
      <Toaster position="top-right" />

      {/* Files Grid */}
      <div className="max-w-7xl mx-auto p-2 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mt-4 mb-48">
        {loading && (
          <div className="col-span-full flex justify-center items-center py-20">
            <Loader2 className="animate-spin h-12 w-12 text-blue-500" />
          </div>
        )}

        {!loading && !isLoggedIn && (
          <div className="col-span-full flex flex-col items-center text-gray-500 py-10">
            <Inbox size={48} className="mb-3" />
            <p className="text-lg font-medium">
              Please log in to view shared files
            </p>
          </div>
        )}

        {!loading &&
          isLoggedIn &&
          visibleFiles.map((file) => (
            <div
              key={file.id}
              className="bg-white/80 backdrop-blur-md shadow-md rounded-xl p-5 border border-gray-200 hover:shadow-lg transition"
            >
              <div className="flex items-center text-gray-500 text-xs mb-2 gap-1">
                <Hash size={14} /> {file.shareId}
              </div>

              <div className="space-y-1">
                <h3 className="text-base sm:text-lg font-semibold truncate">
                  {file.name}
                </h3>
                <p className="text-xs text-gray-600">
                  <span className="font-medium">Size:</span>{" "}
                  {formatFileSize(file.size)}
                </p>
                <p className="text-xs text-gray-600">
                  <span className="font-medium">Type:</span> {file.type}
                </p>
                <p className="text-xs text-gray-600">
                  <span className="font-medium">Created:</span>{" "}
                  {new Date(file.createdAt).toLocaleString()}
                </p>
                <p className="text-xs text-gray-600">
                  <span className="font-medium">Expires:</span>{" "}
                  {file.expiresAt
                    ? new Date(file.expiresAt).toLocaleString()
                    : "—"}
                </p>
              </div>

              <div className="flex justify-between mt-4 text-sm">
                <button
                  onClick={() => setModalFile(file)}
                  className="flex items-center gap-1 text-blue-600 hover:text-blue-700"
                >
                  <Eye size={16} /> View
                </button>

                <button
                  onClick={() =>
                    handleUpdate(
                      file.shareId,
                      file.fileIndex,
                      prompt("New file name:", file.name),
                    )
                  }
                  className="flex items-center gap-1 text-yellow-600 hover:text-yellow-700"
                >
                  <Edit3 size={16} /> Edit
                </button>

                <button
                  onClick={() => handleDelete(file.shareId, file.fileIndex)}
                  className="flex items-center gap-1 text-red-600 hover:text-red-700"
                >
                  <Trash2 size={16} /> Delete
                </button>
              </div>
            </div>
          ))}

        {!loading && isLoggedIn && visibleFiles.length === 0 && (
          <div className="col-span-full flex flex-col items-center text-gray-500 py-2">
            <Inbox size={48} className="mb-3" />
            <p className="text-lg font-medium">No shared files found</p>
            <p className="text-sm">Try adjusting your filters or search</p>
          </div>
        )}
      </div>

      {/* Filter + Pagination - Fixed Footer */}
      <div className="fixed bottom-0 left-0 right-0 z-40 bg-white/90 backdrop-blur-md shadow-t border-t p-4 flex flex-col sm:flex-row sm:items-center gap-3 justify-between flex-wrap">
        {/* Search */}
        <div className="flex items-center gap-2 w-full sm:w-1/3 relative">
          <Search
            size={18}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
          />
          <input
            type="text"
            placeholder="Search by name or Share ID..."
            className="w-full pl-9 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {/* File Type Filter */}
        <div className="flex items-center gap-2 w-full sm:w-1/4">
          <Filter size={18} className="text-gray-400" />
          <select
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500"
            value={fileType}
            onChange={(e) => setFileType(e.target.value)}
          >
            <option value="all">All Types</option>
            <option value="application/pdf">PDF</option>
            <option value="image/png">PNG</option>
            <option value="image/jpeg">JPEG</option>
            <option value="text/plain">TXT</option>
          </select>
        </div>

        {/* Sorting & Total */}
        <div className="flex items-center gap-4 w-full sm:w-1/4 justify-between">
          <div className="flex items-center gap-2 w-full">
            <SortAsc size={18} className="text-gray-400" />
            <select
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
            >
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
              <option value="sizeAsc">Size: Small → Large</option>
              <option value="sizeDesc">Size: Large → Small</option>
            </select>
          </div>

          <div className="text-sm text-gray-600 font-medium whitespace-nowrap">
            Total Shares: {new Set(files.map((f) => f.shareId)).size}
          </div>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center items-center gap-2 w-full mt-2 sm:mt-0 flex-wrap">
            {Array.from({ length: totalPages }).map((_, idx) => {
              const page = idx + 1;
              return (
                <button
                  key={page}
                  onClick={() => handlePageChange(page)}
                  className={`px-3 py-1 rounded-lg border text-sm transition ${
                    currentPage === page
                      ? "bg-blue-600 text-white border-blue-600"
                      : "bg-white border-gray-300 text-gray-600 hover:bg-gray-100"
                  }`}
                >
                  {page}
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* Modal */}
      {modalFile && (
        <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">
          <div className="bg-white rounded-xl p-6 max-w-lg w-full relative shadow-lg">
            <button
              className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
              onClick={() => setModalFile(null)}
            >
              <X size={20} />
            </button>
            <h2 className="text-lg font-bold mb-2">{modalFile.name}</h2>
            <p>
              <span className="font-medium">Share ID:</span> {modalFile.shareId}
            </p>
            <p>
              <span className="font-medium">Type:</span> {modalFile.type}
            </p>
            <p>
              <span className="font-medium">Size:</span>{" "}
              {formatFileSize(modalFile.size)}
            </p>
            <p>
              <span className="font-medium">Created:</span>{" "}
              {new Date(modalFile.createdAt).toLocaleString()}
            </p>
            <p>
              <span className="font-medium">Expires:</span>{" "}
              {modalFile.expiresAt
                ? new Date(modalFile.expiresAt).toLocaleString()
                : "—"}
            </p>
            <a
              href={modalFile.url}
              target="_blank"
              rel="noreferrer"
              className="mt-4 inline-block bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              Open File
            </a>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboardpage;
