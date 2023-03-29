
import { usePermission } from "hooks/usePermission"
export default function PermissionContainer({ permission, children, ...params }) {

    const hasPermission = usePermission();
    return (
        hasPermission(permission) ? <>{children} </> : <></>
    )

}

