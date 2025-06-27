import { useState } from "react";
import "./Loading.css";
import ErdImage from "../../assets/img/Erd.png";
import completedImage from "../../assets/img/completed.png";
import apiImage from "../../assets/img/api.png";
import projectaiImage from "../../assets/img/projectai.png";
import listaiImage from "../../assets/img/listai.png";
export default function Loading() {
  //이미지 배열
  const images = [
    ErdImage,
    completedImage,
    apiImage,
    projectaiImage,
    listaiImage,
  ];
  const [current, setCurrent] = useState(0);

  const goNext = () => {
    setCurrent((prev) => (prev + 1) % images.length);
  };

  const goPrev = () => {
    setCurrent((prev) => (prev - 1 + images.length) % images.length);
  };

  return (
    <div className="tutorial-overlay">
      <div className="loading-modal">
        <p className="loading-text">AI 생성중입니다... 잠시만 기다려주세요</p>
      </div>
      <div className="tutorial-content">
        <div className="image-wrapper">
          {/* 이전 화살표 */}
          <button className="nav-arrow left" onClick={goPrev}>
            ◀
          </button>
          {/* ERD 이미지 */}
          <img src={images[current]} className="tutorial-image" />

          <button className="nav-arrow right" onClick={goNext}>
            ▶
          </button>
        </div>
        {current === 0 && (
          <div className="overlay-tooltips">
            <div className="icon-question">?</div>
            <div className="speech-bubble">확대·축소 버튼으로 크기 조정</div>
            <div className="btn-wrapper">
              <div className="btn-bubble">
                완료하기 클릭하면 저장하기 버튼으로 변경
                <br />
                저장하기를 클릭하면 API 명세서 호출
              </div>
              <div className="btn-icon-question">?</div>
            </div>
            <div className="modify-wrapper">
              <div className="modify-btn-bubble">
                수정하기를 통해 테이블명, 새 테이블 생성
              </div>
              <div className="modify-icon-question">?</div>
            </div>
          </div>
        )}
        {current === 1 && (
          <div className="overlay-tooltips">
            <div className="ai-icon-wrapper">
              <div className="ai-speech-bubble">
                ai 추천 받기를 통해 요구사항을 추천받을 수 있음
              </div>
              <div className="ai-icon-question">?</div>
            </div>
            <div className="click-icon-wrapper">
              <div className="click-icon-question">?</div>
              <div className="click-speech-bubble">완료 버튼 클릭 시 반영</div>
            </div>
          </div>
        )}

        {current === 2 && (
          <div className="overlay-tooltips">
            <div className="api-icon-question">?</div>
            <div className="api-speech-bubble">
              ai로 생성된 명세서를 연필 버튼을 활용해 <br />
              테이블 생성,필드 수정, 삭제 가능
            </div>

            <div className="api-complete-question">?</div>
            <div className="api-complete-speech-bubble">
              완료하기 버튼 클릭 시 리스트 테이블로 이동
            </div>
          </div>
        )}

        {current === 3 && (
          <div className="overlay-tooltips">
            <div className="list-icon-question">?</div>
            <div className="list-speech-bubble">
              리스트 테이블에서 카테고리 추가 시 칸반 테이블에 자동 반영
              <br />
              간트 차트 내 일별 상태 정리
            </div>

            <div className="filter-icon-question">?</div>
            <div className="filter-speech-bubble">
              필터를 통해 카테고리,참여자 ,상태별로 정렬 가능
            </div>
          </div>
        )}

        {current === 4 && (
          <div className="overlay-tooltips">
            <div className="list-ai-icon-question">?</div>
            <div className="list-ai-speech-bubble">
              액션을 일반 생성하기 또는 AI 추천받기로 선택 입력
              <br />
              AI 추천받기 선택 시 AI에게 추천받은 액션 출력
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
