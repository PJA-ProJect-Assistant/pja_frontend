import api from "../lib/axios";
import type { ApiResponse } from "../types/common";
import type { ERDData, geterd, GenerateApiResponse, getcolumn, ERDField, gettable, getrelation, setRelation } from "../types/erd";
//ERD 관련 테이블

//erd ai자동생성 요청
export const postErdAI = async (workspaceId: number) => {
  try {
    await api.post(`/workspaces/${workspaceId}/erds/recommendations`);
    console.log("erd ai 생성 :");
  } catch (error: any) {
    console.error("🔴 [postErdAI] Erd AI 생성 실패:", error);

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

//erd 생성
export const postErd = async (
  workspaceId: number
): Promise<ApiResponse<geterd>> => {
  try {
    const response = await api.post(`/workspaces/${workspaceId}/erd`);
    console.log("erd 생성 :", response);
    return response.data;
  } catch (error: any) {
    console.error("🔴 [postErd] Erd 생성 실패:", error);

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

//erd 전체 조회
export const getAllErd = async (
  workspaceId: number,
  erdId: number
): Promise<ApiResponse<ERDData>> => {
  try {
    const response = await api.get(
      `/workspaces/${workspaceId}/erd/${erdId}/flow`
    );
    console.log("erd 전체 조회 :", response);
    return response.data;
  } catch (error: any) {
    console.error("🔴 [getAllErd] Erd 조회 실패:", error);

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

//erdId 조회
export const getErdId = async (
  workspaceId: number
): Promise<ApiResponse<{ erdId: number }>> => {
  try {
    const response = await api.get(`/workspaces/${workspaceId}/erd`);
    console.log("erd id 조회 :", response);
    return response.data;
  } catch (error: any) {
    console.error("🔴 [getErdId] Erd id 조회 실패:", error);

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

//erd table 생성
export const postErdTable = async (
  workspaceId: number,
  erdId: number,
): Promise<ApiResponse<gettable>> => {
  try {
    const response = await api.post(`/workspaces/${workspaceId}/erd/${erdId}/table`, {
      "tableName": "새테이블",
    });
    console.log("erd 테이블 생성 :", response);
    return response.data;
  } catch (error: any) {
    console.error("🔴 [postErdTable] Erd 테이블 생성 실패:", error);

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

//erd table 이름 수정
export const putErdTable = async (
  workspaceId: number,
  erdId: number,
  tableId: string,
  newTableName: string,
): Promise<ApiResponse<gettable>> => {
  try {
    const response = await api.put(`/workspaces/${workspaceId}/erd/${erdId}/table/${tableId}`, {
      newTableName,
    });
    console.log("erd 테이블이름 수정 :", response);
    return response.data;
  } catch (error: any) {
    console.error("🔴 [putErdTable] Erd 테이블 수정 실패:", error);

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

//erd table 삭제
export const deleteErdTable = async (
  workspaceId: number,
  erdId: number,
  tableId: string,
) => {
  try {
    await api.delete(`/workspaces/${workspaceId}/erd/${erdId}/table/${tableId}`);
    console.log("erd 테이블 삭제 :");

  } catch (error: any) {
    console.error("🔴 [deleteErdTable] Erd 테이블 삭제 실패:", error);

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


//erd 컬럼 생성
export const postErdColumn = async (
  workspaceId: number,
  erdId: number,
  tableId: string,
): Promise<ApiResponse<getcolumn>> => {
  try {
    const response = await api.post(`/workspaces/${workspaceId}/erd/${erdId}/table/${tableId}/column`, {
      "columnName": "새 필드",
      "columnType": "",
      "primaryKey": false,
      "foreignKey": false,
      "nullable": false
    });
    console.log("erd 필드 생성 :", response);
    return response.data;
  } catch (error: any) {
    console.error("🔴 [postErdColumn] Erd 필드 생성 실패:", error);
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

//erd 컬럼 삭제
export const deleteErdColumn = async (
  workspaceId: number,
  erdId: number,
  tableId: string,
  columnId: string,
): Promise<ApiResponse<void>> => {
  try {
    const response = await api.delete(`/workspaces/${workspaceId}/erd/${erdId}/table/${tableId}/column/${columnId}`);
    console.log("erd 필드 삭제 :", response);
    return response.data;
  } catch (error: any) {
    console.error("🔴 [deleteErdColumn] Erd 필드 삭제 실패:", error);
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

//erd 컬럼 수정
export const putErdColumn = async (
  workspaceId: number,
  erdId: number,
  tableId: string,
  columnId: string,
  updateField: ERDField
): Promise<ApiResponse<getcolumn>> => {
  try {
    const response = await api.post(`/workspaces/${workspaceId}/erd/${erdId}/table/${tableId}/column/${columnId}`, {
      "columnName": updateField.name,
      "columnType": updateField.type,
      "primaryKey": updateField.primary,
      "foreignKey": updateField.foreign,
      "nullable": updateField.nullable
    });
    console.log("erd 필드 수정 :", response);
    return response.data;
  } catch (error: any) {
    console.error("🔴 [putErdColumn] Erd 필드 수정 실패:", error);
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

//erd 관계 생성
export const postErdRelation = async (
  workspaceId: number,
  erdId: number,
  newRelation: setRelation,
): Promise<ApiResponse<getrelation>> => {
  try {
    const response = await api.post(`/workspaces/${workspaceId}/erd/${erdId}/relation`, {
      fromTableId: newRelation.fromTableId,
      toTableId: newRelation.toTableId,
      foreignKeyId: newRelation.foreignKeyId,
      toTableKeyId: newRelation.toTableKeyId,
      foreignKeyName: newRelation.foreignKeyName,
      constrantName: newRelation.constraintName,
      type: newRelation.type,
    });
    console.log("erd 필드 생성 :", response);
    return response.data;
  } catch (error: any) {
    console.error("🔴 [postErdColumn] Erd 필드 생성 실패:", error);
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

//api 명세서 생성 요청
export const generateApiSpec = async (
  workspaceId: number
): Promise<GenerateApiResponse> => {
  try {
    const response = await api.post<GenerateApiResponse>(
      `/workspaces/${workspaceId}/apis/generate`
    );
    return response.data;
  } catch (error: any) {
    console.error("API 명세서 생성 API 호출 실패:", error);
    // 에러를 다시 throw하여 호출한 쪽(컴포넌트)에서 catch할 수 있도록 합니다.

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
