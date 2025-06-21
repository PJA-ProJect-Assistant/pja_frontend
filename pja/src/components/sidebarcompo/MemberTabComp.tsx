import "./MemberTabComp.css";
import InviteModal from "./InviteModal";
import type { Member, MemberRole } from "../../types/invite";

interface MemberTabCompProps {
  members: Member[];
  currentUserRole: MemberRole;
  isInviteModalOpen: boolean;
  onCloseInviteModal: () => void;
  onModify: (memberId: string) => void;
  onDelete: (memberId: string) => void;
}

interface MemberListItemProps {
  member: Member;
  currentUserRole: MemberRole;
  onModify: (memberId: string) => void;
  onDelete: (memberId: string) => void;
}

const MemberListItem = ({
  member,
  currentUserRole,
  onModify,
  onDelete,
}: MemberListItemProps) => {
  const canManage = currentUserRole === "ADMIN";
  return (
    <div className="member-tab-box">
      <div className="member-info-container">
        <div
          className="Mem-profile-img"
          style={{ backgroundImage: `url(${member.profile})` }}
        ></div>
        <div className="Mem-user-info">
          <div className="Mem-user-name">{member.name}</div>
          <div className="Mem-user-email">{member.email}</div>
        </div>
      </div>
      <div className="member-action-container">
        {/* '수정' 버튼은 조건부로 렌더링합니다. */}
        {canManage && (
          <button
            className="member-modify-btn"
            onClick={() => onModify(member.memberId)}
          >
            수정
          </button>
        )}

        {/* '삭제' 버튼은 항상 렌더링합니다. */}
        <button
          className="member-delete-btn"
          onClick={() => onDelete(member.memberId)}
        >
          삭제
        </button>
      </div>
    </div>
  );
};

const MemberTabComp = ({
  members,
  currentUserRole,
  isInviteModalOpen,
  onCloseInviteModal,
  onModify,
  onDelete,
}: MemberTabCompProps) => {
  return (
    <>
      {isInviteModalOpen && <InviteModal onClose={onCloseInviteModal} />}

      {/* 멤버 목록을 .map()으로 순회하며 위에서 만든 MemberListItem을 렌더링합니다. */}
      {members.map((member) => (
        <MemberListItem
          key={member.memberId}
          member={member}
          currentUserRole={currentUserRole}
          onModify={onModify}
          onDelete={onDelete}
        />
      ))}
    </>
  );
};

export default MemberTabComp;
