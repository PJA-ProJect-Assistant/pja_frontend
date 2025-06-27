import { useEffect, useRef, useState } from "react";
import "./ParticipantsCell.css";
import { useCategoryFeatureCategory } from "../../hooks/useCategoryFeatureAction";

type Props = {
  value?: number[];
  onChange: (newParti: number[]) => void;
  disable: boolean;
};

export const ParticipantsCell = ({ value = [], onChange, disable }: Props) => {
  const [isEditing, setIsEditing] = useState(false);
  const { participantList } = useCategoryFeatureCategory();
  const dropdownRef = useRef<HTMLDivElement | null>(null);

  const handleSelect = (userId: number) => {
    if (!value.includes(userId)) {
      onChange([...value, userId]);
    }
    setIsEditing(false);
  };

  const handleRemove = (userId: number) => {
    const updated = value.filter((id) => id !== userId);
    onChange(updated);
    setIsEditing(false);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsEditing(false);
      }
    };

    if (isEditing) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isEditing]);

  return (
    <div className="paricipants-container">
      {isEditing && !disable && (
        <div className="participants-dropdown" ref={dropdownRef}>
          {participantList.map((member) => {
            const isSelected = value.includes(member.memberId);
            return (
              <div
                key={member.memberId}
                className="participant-option"
                onClick={() => {
                  !isSelected && handleSelect(member.memberId);
                }}
              >
                <div>
                  {member.profileImage ? (
                    <img
                      src={member.profileImage}
                      alt={member.username}
                      className="partiprofile-img"
                    />
                  ) : (
                    <div className="partiprofile-none">
                      {member.username.charAt(0)}
                    </div>
                  )}
                  <span className="participant-name">{member.username}</span>
                </div>

                {isSelected && (
                  <button
                    className="remove-button"
                    onClick={(e) => {
                      e.stopPropagation(); // 상위 클릭 방지
                      handleRemove(member.memberId);
                    }}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      height="15px"
                      viewBox="0 -960 960 960"
                      width="15px"
                      fill="#828282"
                    >
                      <path d="m291-240-51-51 189-189-189-189 51-51 189 189 189-189 51 51-189 189 189 189-51 51-189-189-189 189Z" />
                    </svg>
                  </button>
                )}
              </div>
            );
          })}
        </div>
      )}
      <div
        className="participants-display"
        onClick={() => !disable && setIsEditing(true)}
        style={{
          cursor: disable ? "default" : "pointer",
        }}
      >
        <div className="selected-partinames">
          {value.map((id) => {
            const user = participantList.find((m) => m.memberId === id);
            return (
              <div key={id} className="partiprofile-container">
                {user?.profileImage ? (
                  <img
                    src={user.profileImage}
                    alt={user.username}
                    className="partiprofile-img"
                  />
                ) : (
                  <div className="partiprofile-none">
                    {user?.username.charAt(0)}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
