
import { orgName } from "../../search/page";

export default function NavbarSlider(params:any){

    const {userRole} = params;
//Using the user role , give for each user a different navbar
//
    return(
        <div>

            {/* Tech Admin , give him the full access to all places and users  */}
            <div>

            </div>
            {/*  Admin , give him the full access to all places only */}
            <div>
                
            </div>
            {/* Manager , give him the  access to the place he/she manage */}
            <div>
                
            </div>
            {/* Basic , give him the  access to all places he/she add  */}
            <div>
                
            </div>
        </div>
    )
}