import { useState } from "react";
import { Members } from "../../constants/userconstants";
import { dummyWSMember } from "../../constants/wsconstants";
import "./ParticipantsCell.css";

type Props = {
  value?: number[];
  wsid: number;
  onChange: (newParti: number[]) => void;
  disable: boolean;
};

export const ParticipantsCell = ({
  value = [],
  wsid,
  onChange,
  disable,
}: Props) => {
  const [isEditing, setIsEditing] = useState(false);

  const handleSelect = (userId: number) => {
    if (value.includes(userId)) {
      setIsEditing(false);
      return; // 중복 방지
    }
    const updated = [...value, userId];
    onChange(updated);
    setIsEditing(false);
  };

  return (
    <div className="paricipants-container">
      {isEditing && !disable && (
        <div className="participants-dropdown">
          {Members.filter((m) =>
            dummyWSMember
              .filter((wsm) => wsm.workspace_id === wsid)
              .some((wsm) => wsm.user_id === m.user_id)
          ).map((member) => {
            const isSelected = value.includes(member.user_id);
            return (
              <div
                key={member.user_id}
                className="participant-option"
                onClick={() => {
                  if (!isSelected) handleSelect(member.user_id);
                }}
              >
                <div>
                  {member.profile_image ? (
                    <img
                      src={member.profile_image}
                      alt={member.name}
                      className="partiprofile-img"
                    />
                  ) : (
                    <div className="partiprofile-none">
                      {member.name.charAt(0)}
                    </div>
                  )}
                  <span className="participant-name">{member.name}</span>
                </div>

                {isSelected && (
                  <button
                    className="remove-button"
                    onClick={(e) => {
                      e.stopPropagation(); // 상위 클릭 방지
                      const updated = value.filter(
                        (id) => id !== member.user_id
                      );
                      onChange(updated);
                      setIsEditing(false);
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
      >
        <div className="selected-partinames">
          {value.map((id) => {
            const user = Members.find((m) => m.user_id === id);
            return (
              <div key={id}>
                {user?.profile_image ? (
                  <img
                    src={user.profile_image}
                    alt={user.name}
                    className="partiprofile-img"
                  />
                ) : (
                  <div className="partiprofile-none">
                    {user?.name.charAt(0)}
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
