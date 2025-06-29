import "./MemberTabComp.css";
import InviteModal from "./InviteModal";
import type { Member, MemberRole } from "../../types/invite";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import {
  getMemberList,
  deleteMember,
  getMemberRole,
  updateMemberRole,
} from "../../services/workspaceMemberApi";
import type { RootState } from "../../store/store";

interface MemberTabCompProps {
  isInviteModalOpen: boolean;
  onCloseInviteModal: () => void;
  onRoleChange: (memberId: string, newRole: MemberRole) => void;
}

interface MemberListItemProps {
  member: Member;
  currentUserRole: MemberRole;
  onRoleChange: (memberId: string, newRole: MemberRole) => void;
  onDelete: (memberId: string) => void;
}

const MemberListItem = ({
  member,
  currentUserRole,
  onRoleChange,
  onDelete,
}: MemberListItemProps) => {
  console.log("currentUserRole :", currentUserRole);
  const canManage = currentUserRole === "OWNER";
  console.log("멤버 역할은?? ", member.workspaceRole);
  return (
    <div className="member-tab-box">
      <div className="member-info-container">
        {member.profile ? (
          <img
            className="Mem-profile-img"
            src={member.profile}
            alt="프로필 이미지"
          />
        ) : (
          <div className="Mem-profile-img">{member.name.charAt(0)}</div>
        )}
        <div className="Mem-user-info">
          <div className="Mem-user-name">{member.name}</div>
          <div className="Mem-user-email">
            {member.email.split(/([@.])/g).map((chunk, i) =>
              chunk === "@" || chunk === "." ? (
                <span key={i}>
                  {chunk}
                  <wbr />
                </span>
              ) : (
                <span key={i}>{chunk}</span>
              )
            )}
          </div>
        </div>
      </div>
      <div className="member-action-container">
        {canManage && (
          <div className="member-action-container">
            <div className="role-select-wrapper">
              <select
                className="role-select"
                value={member.workspaceRole}
                onChange={(e) =>
                  onRoleChange(member.memberId, e.target.value as MemberRole)
                }
              >
                <option value="OWNER">OWNER</option>
                <option value="MEMBER">MEMBER</option>
                <option value="GUEST">GUEST</option>
              </select>
            </div>

            <button
              className="member-delete-btn"
              onClick={() => onDelete(member.memberId)}
            >
              삭제
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

const MemberTabComp = ({
  isInviteModalOpen,
  onCloseInviteModal,
}: MemberTabCompProps) => {
  const selectedWS = useSelector(
    (state: RootState) => state.workspace.selectedWS
  );
  const workspaceId = selectedWS?.workspaceId;
  const [members, setMembers] = useState<Member[]>([]);
  const [currentUserRole, setCurrentUserRole] = useState<MemberRole>("GUEST"); // 기본값: GUEST

  const fetchMembers = async () => {
    if (!workspaceId) return;
    try {
      const res = await getMemberList(workspaceId);
      if (res.status === "success") {
        setMembers(res.data);
      }
    } catch (err) {
      console.error("멤버 불러오기 실패", err);
    }
  };

  const fetchRole = async () => {
    if (!workspaceId) return;
    try {
      const res = await getMemberRole(workspaceId);
      if (res.status === "success") {
        setCurrentUserRole(res.data.role);
      }
    } catch (err) {
      console.error("멤버 역할 불러오기 실패", err);
    }
  };

  useEffect(() => {
    fetchMembers();
    fetchRole();
  }, [workspaceId]);

  const handleDelete = async (memberId: string) => {
    if (!workspaceId) return;
    try {
      await deleteMember(workspaceId, Number(memberId));
      await fetchMembers(); // 삭제 후 다시 불러오기
    } catch (err) {
      console.error("멤버 삭제 실패", err);
    }
  };

  const handleRoleChange = async (memberId: string, newRole: MemberRole) => {
    if (!workspaceId) return;
    try {
      await updateMemberRole(workspaceId, {
        userId: Number(memberId),
        workspaceRole: newRole,
      });
      await fetchMembers(); // 역할 변경 후 갱신
    } catch (err) {
      console.error("멤버 역할 변경 실패", err);
    }
  };

  return (
    <>
      {isInviteModalOpen && <InviteModal onClose={onCloseInviteModal} />}
      {members.map((member) => (
        <MemberListItem
          key={member.memberId}
          member={member}
          currentUserRole={currentUserRole}
          onRoleChange={handleRoleChange}
          onDelete={handleDelete}
        />
      ))}
    </>
  );
};

export default MemberTabComp;
