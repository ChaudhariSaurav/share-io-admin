// src/pages/Dashboardpage.js
import React, { useEffect, useState } from "react";
import { ref, onValue, remove, update, push } from "firebase/database";
import { database } from "../config/firebaseConfig";
import { Link } from "react-router-dom";
import {
  Search,
  Filter,
  SortAsc,
  FilePlus,
  Trash2,
  Edit3,
  Eye,
  Hash,
} from "lucide-react";
import toast, { Toaster } from "react-hot-toast";

const Dashboardpage = () => {
  const [sharedFiles, setSharedFiles] = useState([]);
  const [filteredFiles, setFilteredFiles] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [fileType, setFileType] = useState("all");
  const [sortBy, setSortBy] = useState("newest");

  // Fetch from Firebase
  useEffect(() => {
    const sharedRef = ref(database, "shares");

    const unsubscribe = onValue(sharedRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const filesArray = Object.entries(data).flatMap(
          ([shareId, shareData]) =>
            (shareData.files || []).map((file, index) => ({
              id: `${shareId}-${index}`,
              shareId,
              fileIndex: index,
              createdAt: shareData.createdAt,
              expiresAt: shareData.expiresAt,
              ...file,
            })),
        );
        setSharedFiles(filesArray);
        setFilteredFiles(filesArray);
      } else {
        setSharedFiles([]);
        setFilteredFiles([]);
      }
    });

    return () => unsubscribe();
  }, []);

  // Apply filters
  useEffect(() => {
    let result = [...sharedFiles];

    // Multi-field search (name + shareId)
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

    if (sortBy === "newest") {
      result.sort((a, b) => b.createdAt - a.createdAt);
    } else if (sortBy === "oldest") {
      result.sort((a, b) => a.createdAt - b.createdAt);
    } else if (sortBy === "sizeAsc") {
      result.sort((a, b) => a.size - b.size);
    } else if (sortBy === "sizeDesc") {
      result.sort((a, b) => b.size - a.size);
    }

    setFilteredFiles(result);
  }, [searchTerm, fileType, sortBy, sharedFiles]);

  // CRUD Operations
  const handleDelete = (shareId) => {
    const fileRef = ref(database, `shares/${shareId}`);
    remove(fileRef)
      .then(() => toast.success("🗑️ File deleted"))
      .catch((err) => toast.error("❌ Delete failed: " + err.message));
  };

  const handleUpdate = (shareId, fileIndex, newName) => {
    if (!newName) return;
    const fileRef = ref(database, `shares/${shareId}/files/${fileIndex}`);
    update(fileRef, { name: newName })
      .then(() => toast.success("✏️ File renamed"))
      .catch((err) => toast.error("❌ Update failed: " + err.message));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 via-gray-200 to-gray-300 relative pb-28">
      <Toaster position="top-right" reverseOrder={false} />

      {/* Files Grid */}
      <div className="max-w-7xl mx-auto p-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredFiles.map((file) => (
          <div
            key={file.id}
            className="bg-white/70 backdrop-blur-lg shadow-md rounded-xl p-5 border border-gray-200 hover:shadow-lg transition"
          >
            {/* Show Share ID */}
            <div className="flex items-center text-gray-500 text-xs mb-2 gap-1">
              <Hash size={14} /> {file.shareId}
            </div>

            {/* File Info */}
            <div className="space-y-1">
              <h3 className="text-base sm:text-lg font-semibold truncate">
                {file.name}
              </h3>
              <p className="text-xs text-gray-600">
                <span className="font-medium">Size:</span>{" "}
                {(file.size / 1024).toFixed(2)} KB
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
                {new Date(file.expiresAt).toLocaleString()}
              </p>
            </div>

            {/* Actions */}
            <div className="flex justify-between mt-4 text-sm">
              <Link
                to={file.url}
                target="_blank"
                className="flex items-center gap-1 text-blue-600 hover:text-blue-700"
              >
                <Eye size={16} /> View
              </Link>

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
                onClick={() => handleDelete(file.shareId)}
                className="flex items-center gap-1 text-red-600 hover:text-red-700"
              >
                <Trash2 size={16} /> Delete
              </button>
            </div>
          </div>
        ))}

        {filteredFiles.length === 0 && (
          <p className="text-gray-600 col-span-full text-center">
            No shared files found.
          </p>
        )}
      </div>

      {/* Fixed Bottom Filter Toolbar */}
      <div className="fixed bottom-0 left-0 right-0 z-20 bg-white/80 backdrop-blur-md shadow-t border-t">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 p-4">
          {/* Search */}
          <div className="relative w-full sm:w-1/3">
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

          {/* Sorting */}
          <div className="flex items-center gap-2 w-full sm:w-1/4">
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

          {/* Add File Button */}
          {/* <button
            onClick={handleCreate}
            className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 text-sm"
          >
            <FilePlus size={18} /> Add File
          </button> */}
        </div>
      </div>
    </div>
  );
};

export default Dashboardpage;
