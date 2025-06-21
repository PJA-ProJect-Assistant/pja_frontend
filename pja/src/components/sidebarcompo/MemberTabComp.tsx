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
  const selectedWS = useSelector(
    (state: RootState) => state.workspace.selectedWS
  );
  const workspaceId = selectedWS?.workspaceId;

  const [members, setMembers] = useState<Member[]>([]);

  useEffect(() => {
    const fetchMembers = async() => {
      try {
            console.log("worksapceId는 ", workspaceId)
            const accessToken = localStorage.getItem("accessToken");
            const headers = {
              Authorization: `Bearer ${accessToken}`
            };
            const response = await api.get(
              `/workspaces/${workspaceId}/members`,
              { headers }
            );

            if(response.data.status === "success") {
              setMembers(response.data.data);
              console.log(response.data.data);
            }
          } catch (error: any) {
            if (error.response) {
              console.error("에러:", error.response.data.message);
            } else {
              console.error("서버 응답 실패");
            }
          }
        };

        fetchMembers();
  },[workspaceId]);


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
