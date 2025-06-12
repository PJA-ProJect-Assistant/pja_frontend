import { AnimatePresence } from "framer-motion";
import WsSidebar from "../../../../components/sidebar/WsSidebar";
import { actions } from "../../../../constants/listconstant";
import type { action } from "../../../../types/list";
import "./ActionPostPage.css";
import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { PostHeader } from "../../../../components/header/PostHeader";
import imageUpIcon from "../../../../assets/img/imageUp.png";

export default function ActionPostPage() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [showIcon, setShowIcon] = useState(false);
  const [selectAction, setSelectAction] = useState<action>();
  const [selectedImages, setSelectedImages] = useState<File[]>([]);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [isEditing, setIsEditing] = useState(false);
  const [textContent, setTextContent] = useState<string>("");
  const [originalTextContent, setOriginalTextContent] = useState<string>("");
  const [originalImages, setOriginalImages] = useState<File[]>([]);

  const { acId } = useParams<{
    acId: string;
  }>();

  useEffect(() => {
    const setaction = actions.find((ac) => ac.action_id === Number(acId));
    setSelectAction(setaction);
  }, [acId]);

  const handleFileSelect = (files: FileList | null) => {
    if (files) {
      const imageFiles = Array.from(files).filter((file) =>
        file.type.startsWith("image/")
      );
      setSelectedImages((prev) => [...prev, ...imageFiles]);
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    handleFileSelect(e.target.files);
    // (선택 사항) 같은 파일을 다시 업로드할 수 있도록 입력 값을 초기화합니다.
    if (e.target) e.target.value = "";
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    handleFileSelect(e.dataTransfer.files);
  };

  // 업로드 영역 전체를 클릭했을 때 파일 입력 창을 띄웁니다.
  const handleUploadAreaClick = () => {
    fileInputRef.current?.click();
  };

  const removeImage = (index: number) => {
    setSelectedImages((prev) => prev.filter((_, i) => i !== index));
  };

  //수정하기 클릭 시 수정/저장 토글 함수
  const handleToggleEdit = () => {
    if (!isEditing) {
      //수정모드
      setIsEditing(true);
      setOriginalTextContent(textContent);
      setOriginalImages([...selectedImages]);
    } else {
      //저장하고 수정 모드 종료
      setIsEditing(false);
      console.log("저장된 내용:", textContent);
      console.log("저장된 이미지:", selectedImages);
    }
  };

  return (
    <div className="post-container">
      {/* ... (AnimatePresence, Sidebar 등 기존 코드는 그대로) ... */}
      <AnimatePresence
        onExitComplete={() => {
          setShowIcon(true);
        }}
      >
        {sidebarOpen && (
          <WsSidebar
            onClose={() => {
              setSidebarOpen(false);
              setShowIcon(false);
            }}
          />
        )}
      </AnimatePresence>
      {!sidebarOpen && showIcon && (
        <div className="post-sidebar-closed">
          <div
            className="post-sidebar-icon"
            onClick={() => setSidebarOpen(true)}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              height="24px"
              viewBox="0 -960 960 960"
              width="24px"
              fill="#000000"
            >
              <path d="M360-120v-720h80v720h-80Zm160-160v-400l200 200-200 200Z" />
            </svg>
          </div>
        </div>
      )}
      <div className="actionpost-container">
        <PostHeader />
        <h2>{selectAction?.name}</h2>
        <div className="actionpost-wrapper">
          {isEditing ? (
            <textarea
              placeholder="내용을 입력해주세요"
              className="actionpost-input"
              value={textContent}
              onChange={(e) => setTextContent(e.target.value)}
            />
          ) : (
            <div className="actionpost-display">
              {textContent || "내용이 없습니다."}
            </div>
          )}
        </div>
        {/*사진 업로드 창*/}
        <div className="image-upload-container">
          {/* 파일 input (숨김) */}
          <input
            type="file"
            accept="image/*"
            multiple
            onChange={handleFileInputChange}
            ref={fileInputRef}
            style={{ display: "none" }}
          />

          {/* 이미지 업로드 클릭*/}
          <div
            className={`image-upload-area ${dragActive ? "drag-active" : ""}`}
            onClick={handleUploadAreaClick}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
          >
            {/*  업로드 전 안내 문구 & 아이콘 */}
            {selectedImages.length === 0 && (
              <>
                <span className="upload-placeholder">
                  여기에 이미지를 드래그하거나 클릭하여 업로드하세요
                </span>
                <img
                  src={imageUpIcon}
                  className="image-upload-icon"
                  alt="업로드 아이콘"
                />
              </>
            )}

            {/*  업로드된 파일 이름 표시 */}
            {selectedImages.length > 0 && (
              <div className="uploaded-files">
                {selectedImages.map((image, index) => (
                  <div key={index} className="uploaded-file-name">
                    <span>{image.name}</span>
                    <button
                      className="remove-btn"
                      onClick={() => removeImage(index)}
                    >
                      X
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
        <div className="actionpost-button-container">
          <button
            className={isEditing ? "save-button" : "modify-button"}
            onClick={handleToggleEdit}
          >
            {isEditing ? "저장하기" : "수정하기"}
          </button>
        </div>
      </div>
    </div>
  );
}
