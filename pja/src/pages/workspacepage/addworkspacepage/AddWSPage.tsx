import AddWSName from "./AddWSName";
import AddWSTeam from "./AddWSTeam";
import { useState } from "react";

export default function AddWSPage() {
  const [openNextPage, setOpenNextPage] = useState<boolean>(false);
  return (
    <>
      {openNextPage ? (
        <AddWSTeam />
      ) : (
        <AddWSName onClose={() => setOpenNextPage(true)} />
      )}
    </>
  );
}
