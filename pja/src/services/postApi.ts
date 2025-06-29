import api from "../lib/axios";
import type {
  PostData,
  ApiResponse,
  UpdateApiResponse,
  CreatedCommentData,
  CreateCommentApiResponse,
  UpdatedCommentData,
  UpdateCommentApiResponse,
  DeleteCommentApiResponse,
} from "../types/post";

export const getPostDetails = async (
  workspaceId: string,
  actionId: string,
  postId: string
): Promise<PostData> => {
  // 성공 시 PostData를 반환하도록 타입 지정
  try {
    const response = await api.get<ApiResponse>(
      `/workspaces/${workspaceId}/project/action/${actionId}/post/${postId}`
    );

    if (response.data.status === "success" && response.data.data) {
      return response.data.data; // 성공 시 data 객체를 반환
    } else {
      // API 응답은 성공(200)이지만, status가 'fail'인 경우
      throw new Error(
        response.data.message || "데이터를 불러오는 데 실패했습니다."
      );
    }
  } catch (error) {
    // axios 에러 처리 (4xx, 5xx 등)
    console.error("API Error in getPostDetails:", error);
    // 에러를 다시 던져서 호출한 쪽에서 처리할 수 있도록 함
    throw error;
  }
};

//게시글 정보 수정하는 api
export const updatePostDetails = async (
  workspaceId: string,
  actionId: string,
  postId: string,
  updateData: {
    content: string;
    files: File[];
    removedFilePaths: string[];
  }
): Promise<PostData> => {
  // 1. multipart/form-data를 위한 FormData 객체 생성
  const formData = new FormData();
  // 2. 텍스트 데이터 추가
  formData.append("content", updateData.content);

  // 3. 파일 데이터 추가 (여러 개일 수 있으므로 반복문 사용)
  updateData.files.forEach((file) => {
    formData.append("files", file);
  });

  formData.append("removedFilePaths", JSON.stringify(updateData.removedFilePaths));

  try {
    const response = await api.patch<UpdateApiResponse>(
      `/workspaces/${workspaceId}/project/action/${actionId}/post/${postId}`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );

    if (response.data.status === "success" && response.data.data) {
      return response.data.data; // 성공 시 수정된 데이터 반환
    } else {
      throw new Error(response.data.message || "게시글 수정에 실패했습니다.");
    }
  } catch (error) {
    console.error("API Error in updatePostDetails:", error);
    throw error;
  }
};

//댓글 생성 api
export const createComment = async (
  workspaceId: string,
  actionId: string,
  postId: string,
  content: string
): Promise<CreatedCommentData> => {
  try {
    const response = await api.post<CreateCommentApiResponse>(
      `/workspaces/${workspaceId}/project/action/${actionId}/post/${postId}/comment`,
      { content } // request body
    );

    if (response.data.status === "success" && response.data.data) {
      return response.data.data;
    } else {
      throw new Error(response.data.message || "댓글 생성에 실패했습니다.");
    }
  } catch (error) {
    console.error("댓글 작성 api 실패:", error);
    throw error;
  }
};

//댓글 수정 api
export const updateComment = async (
  workspaceId: string,
  actionId: string,
  commentId: number,
  content: string
): Promise<UpdatedCommentData> => {
  try {
    const response = await api.patch<UpdateCommentApiResponse>(
      // API 경로에 actionId가 필요합니다.
      `/workspaces/${workspaceId}/project/action/${actionId}/comment/${commentId}`,
      { content }
    );

    if (response.data.status === "success" && response.data.data) {
      return response.data.data;
    } else {
      throw new Error(response.data.message || "댓글 수정에 실패했습니다.");
    }
  } catch (error) {
    console.error("API Error in updateComment:", error);
    throw error;
  }
};

//댓글 삭제 api
export const deleteComment = async (
  workspaceId: string,
  actionId: string,
  commentId: number
): Promise<void> => {
  // 성공 시 반환 값이 없으므로 Promise<void>
  try {
    const response = await api.delete<DeleteCommentApiResponse>(
      `/workspaces/${workspaceId}/project/action/${actionId}/comment/${commentId}`
    );

    // 성공 여부 확인 (status가 'success'가 아니면 에러로 처리)
    if (response.data.status !== "success") {
      throw new Error(response.data.message || "댓글 삭제에 실패했습니다.");
    }
    // 성공 시 아무것도 반환하지 않음
  } catch (error) {
    console.error("API Error in deleteComment:", error);
    throw error;
  }
};
