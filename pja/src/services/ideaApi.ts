import api from "../lib/axios";
import type { ApiResponse } from "../types/common";
import type { IdeaData, TechStack, MainFunction } from "../types/idea";
//아이디어페이지 관련 api

//아이디어 입력 초기 설정
export const initinputidea = async (
  workspaceId: number
): Promise<ApiResponse<IdeaData>> => {
  try {
    console.log("아이디어 입력 초기화 api");
    const response = await api.post(`/workspaces/${workspaceId}/idea-input`);
    console.log("아이디어 초기 생성 :", response);
    return response.data;
  } catch (error: any) {
    console.error("🔴 [initinputidea] 아이디어 입력 초기 생성 실패:", error);

    if (error.response) {
      console.error("응답 상태코드:", error.response.status);
      console.error("서버 status:", error.response.data?.status);
      console.error("서버 message:", error.response.data?.message);
    } else if (error.request) {
      console.error("요청은 보냈지만 응답 없음:", error.request);
    } else {
      console.error("요청 설정 중 에러 발생:", error.message);
    }
    throw error;
  }
};

//기술 스택 생성
export const inputtech = async (
  workspaceId: number,
  ideaInputId: number
): Promise<ApiResponse<TechStack>> => {
  try {
    console.log("기술 스택 생성 api");
    const response = await api.post(
      `/workspaces/${workspaceId}/idea-input/${ideaInputId}/tech-stack`
    );
    console.log("기술 스택 생성 :", response);
    return response.data;
  } catch (error: any) {
    console.error("🔴 [inputtech] 기술스택 생성 실패:", error);

    if (error.response) {
      console.error("응답 상태코드:", error.response.status);
      console.error("서버 status:", error.response.data?.status);
      console.error("서버 message:", error.response.data?.message);
    } else if (error.request) {
      console.error("요청은 보냈지만 응답 없음:", error.request);
    } else {
      console.error("요청 설정 중 에러 발생:", error.message);
    }
    throw error;
  }
};
//기술 스택 삭제
export const deletetech = async (workspaceId: number, techStackId: number) => {
  try {
    console.log("기술 스택 삭제 api");
    await api.delete(
      `/workspaces/${workspaceId}/idea-input/tech-stack/${techStackId}`
    );
    console.log("기술 스택 삭제 ");
  } catch (error: any) {
    console.error("🔴 [deletetech] 기술스택 삭제 실패:", error);

    if (error.response) {
      console.error("응답 상태코드:", error.response.status);
      console.error("서버 status:", error.response.data?.status);
      console.error("서버 message:", error.response.data?.message);
    } else if (error.request) {
      console.error("요청은 보냈지만 응답 없음:", error.request);
    } else {
      console.error("요청 설정 중 에러 발생:", error.message);
    }
    throw error;
  }
};

//메인 기능 생성
export const inputfunc = async (
  workspaceId: number,
  ideaInputId: number
): Promise<ApiResponse<MainFunction>> => {
  try {
    console.log("메인 기능 생성 api");
    const response = await api.post(
      `/workspaces/${workspaceId}/idea-input/${ideaInputId}/main-function`
    );
    console.log("메인 기능 생성 :", response);
    return response.data;
  } catch (error: any) {
    console.error("🔴 [inputfunc] 메인 기능 생성 실패:", error);

    if (error.response) {
      console.error("응답 상태코드:", error.response.status);
      console.error("서버 status:", error.response.data?.status);
      console.error("서버 message:", error.response.data?.message);
    } else if (error.request) {
      console.error("요청은 보냈지만 응답 없음:", error.request);
    } else {
      console.error("요청 설정 중 에러 발생:", error.message);
    }
    throw error;
  }
};

//메인 기능 삭제
export const deletefunc = async (
  workspaceId: number,
  mainFunctionId: number
) => {
  try {
    console.log("메인 기능 삭제 api");
    await api.delete(
      `/workspaces/${workspaceId}/idea-input/main-function/${mainFunctionId}`
    );
    console.log("메인 기능 삭제 :");
  } catch (error: any) {
    console.error("🔴 [deletefunc] 메인기능 삭제 실패:", error);

    if (error.response) {
      console.error("응답 상태코드:", error.response.status);
      console.error("서버 status:", error.response.data?.status);
      console.error("서버 message:", error.response.data?.message);
    } else if (error.request) {
      console.error("요청은 보냈지만 응답 없음:", error.request);
    } else {
      console.error("요청 설정 중 에러 발생:", error.message);
    }
    throw error;
  }
};

//아이디어 입력 조회
export const getidea = async (
  workspaceId: number
): Promise<ApiResponse<IdeaData>> => {
  try {
    const response = await api.get(`/workspaces/${workspaceId}/idea-input`);

    return response.data;
  } catch (error: any) {
    console.error("🔴 [getidea] 아이디어 조회 실패:", error);

    if (error.response) {
      console.error("응답 상태코드:", error.response.status);
      console.error("서버 status:", error.response.data?.status);
      console.error("서버 message:", error.response.data?.message);
    } else if (error.request) {
      console.error("요청은 보냈지만 응답 없음:", error.request);
    } else {
      console.error("요청 설정 중 에러 발생:", error.message);
    }
    throw error;
  }
};

//아이디어 이름 수정
export const putideaName = async (
  workspaceId: number,
  ideaId: number,
  projectName: string
) => {
  try {
    console.log("아이디어 이름 api");
    const response = await api.patch(
      `/workspaces/${workspaceId}/idea-input/${ideaId}/project-name`,
      {
        projectName,
      }
    );
    console.log("아이디어 이름 수정 완료 :", response);
    return response.data;
  } catch (error: any) {
    console.error("🔴 [putideaName] 아이디어 이름 수정 실패:", error);

    if (error.response) {
      console.error("응답 상태코드:", error.response.status);
      console.error("서버 status:", error.response.data?.status);
      console.error("서버 message:", error.response.data?.message);
    } else if (error.request) {
      console.error("요청은 보냈지만 응답 없음:", error.request);
    } else {
      console.error("요청 설정 중 에러 발생:", error.message);
    }
    throw error;
  }
};

//아이디어 타켓 수정
export const putideaTarget = async (
  workspaceId: number,
  ideaId: number,
  projectTarget: string
) => {
  try {
    console.log("아이디어 타켓 api");
    const response = await api.patch(
      `/workspaces/${workspaceId}/idea-input/${ideaId}/project-target`,
      {
        projectTarget,
      }
    );
    console.log("아이디어 타켓 수정 완료 :", response);
    return response.data;
  } catch (error: any) {
    console.error("🔴 [putideaTarget] 아이디어 타켓 수정 실패:", error);

    if (error.response) {
      console.error("응답 상태코드:", error.response.status);
      console.error("서버 status:", error.response.data?.status);
      console.error("서버 message:", error.response.data?.message);
    } else if (error.request) {
      console.error("요청은 보냈지만 응답 없음:", error.request);
    } else {
      console.error("요청 설정 중 에러 발생:", error.message);
    }
    throw error;
  }
};

//아이디어 기술 수정
export const putideaTech = async (
  workspaceId: number,
  ideaId: number,
  techStackId: number,
  content: string
) => {
  try {
    console.log("아이디어 기술 api");
    const response = await api.patch(
      `/workspaces/${workspaceId}/idea-input/${ideaId}/tech-stack/${techStackId}`,
      {
        content,
      }
    );
    console.log("아이디어 기술 수정 완료 :", response);
    return response.data;
  } catch (error: any) {
    console.error("🔴 [putideaTech] 아이디어 기술 수정 실패:", error);

    if (error.response) {
      console.error("응답 상태코드:", error.response.status);
      console.error("서버 status:", error.response.data?.status);
      console.error("서버 message:", error.response.data?.message);
    } else if (error.request) {
      console.error("요청은 보냈지만 응답 없음:", error.request);
    } else {
      console.error("요청 설정 중 에러 발생:", error.message);
    }
    throw error;
  }
};

//아이디어 기능 수정
export const putideaFunction = async (
  workspaceId: number,
  ideaId: number,
  mainFunctionId: number,
  content: string
) => {
  try {
    console.log("아이디어 기능 api");
    const response = await api.patch(
      `/workspaces/${workspaceId}/idea-input/${ideaId}/main-function/${mainFunctionId}`,
      {
        content,
      }
    );
    console.log("아이디어 기능 수정 완료 :", response);
    return response.data;
  } catch (error: any) {
    console.error("🔴 [putideaFunction] 아이디어 기능 수정 실패:", error);

    if (error.response) {
      console.error("응답 상태코드:", error.response.status);
      console.error("서버 status:", error.response.data?.status);
      console.error("서버 message:", error.response.data?.message);
    } else if (error.request) {
      console.error("요청은 보냈지만 응답 없음:", error.request);
    } else {
      console.error("요청 설정 중 에러 발생:", error.message);
    }
    throw error;
  }
};

//아이디어 설명 수정
export const putideaDescription = async (
  workspaceId: number,
  ideaId: number,
  projectDescription: string
) => {
  try {
    console.log("아이디어 설명 수정 api");
    const response = await api.patch(
      `/workspaces/${workspaceId}/idea-input/${ideaId}/project-description`,
      {
        projectDescription,
      }
    );
    console.log("아이디어 설명 수정 완료 :", response);
    return response.data;
  } catch (error: any) {
    console.error("🔴 [putideaDescription] 아이디어 설명 수정 실패:", error);

    if (error.response) {
      console.error("응답 상태코드:", error.response.status);
      console.error("서버 status:", error.response.data?.status);
      console.error("서버 message:", error.response.data?.message);
    } else if (error.request) {
      console.error("요청은 보냈지만 응답 없음:", error.request);
    } else {
      console.error("요청 설정 중 에러 발생:", error.message);
    }
    throw error;
  }
};
