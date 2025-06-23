import "./MemberTabComp.css";
import InviteModal from "./InviteModal";
import type { Member, MemberRole } from "../../types/invite";

interface MemberTabCompProps {
  members: Member[];
  currentUserRole: MemberRole;
  isInviteModalOpen: boolean;
  onCloseInviteModal: () => void;
  //  역할 변경을 처리할  prop
  onRoleChange: (memberId: string, newRole: MemberRole) => void;
  onDelete: (memberId: string) => void;
}

interface MemberListItemProps {
  member: Member;
  currentUserRole: MemberRole;
  // 역할 변경을 처리할  prop
  onRoleChange: (memberId: string, newRole: MemberRole) => void;
  onDelete: (memberId: string) => void;
}

const MemberListItem = ({
  member,
  currentUserRole,
  onRoleChange,
  onDelete,
}: MemberListItemProps) => {
  const canManage = currentUserRole === "OWNER";
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
        {/*  역할 변경 드롭다운 추가 */}
        {canManage && (
          <div className="role-select-wrapper">
            <select
              className="role-select"
              value={member.role}
              onChange={(e) =>
                onRoleChange(member.memberId, e.target.value as MemberRole)
              }
            >
              <option value="OWNER">OWNER</option>
              <option value="MEMBER">MEMBER</option>
              <option value="GUEST">GUEST</option>
            </select>
          </div>
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
  onRoleChange,
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
          onRoleChange={onRoleChange}
          onDelete={onDelete}
        />
      ))}
    </>
  );
};

export default MemberTabComp;
