import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
import type { RootState } from "../../store/store";

const RootRedirect = () => {
    const token = useSelector((state: RootState) => state.auth.accessToken);

    return token ? <Navigate to="/main" replace /> : <Navigate to="/login" replace />;
};

export default RootRedirect;