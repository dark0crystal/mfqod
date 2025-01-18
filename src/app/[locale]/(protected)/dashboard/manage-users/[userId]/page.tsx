import AddUserManagement from "./AddUserManagement";
import EditUserManagement from "./EditUserManagement";
import EditUserRole from "./EditUserRole";

export default function EditUserProfile({ params }: { params: { userId: string } }){



    return(
        <div>
            {/* <AddUserManagement userId={params.userId}/> */}
            {/* <EditUserManagement userId={params.userId}/> */}
            <EditUserRole userId={params.userId}/> 

        </div>
    )
}