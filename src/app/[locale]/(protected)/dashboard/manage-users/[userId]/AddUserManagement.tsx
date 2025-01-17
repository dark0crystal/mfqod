"use client"
import { useForm } from "react-hook-form"


type FormFields ={
    place:string
    org:string
}

export default function AddUserManagement(){

    const {register} = useForm<FormFields>()
    return(
        <div>
            add user management
            <div>
                <form>
                    <input type="text" {...register("place")}/>
                    <input type="text" {...register("org")}/>
                    <button type="submit">Submit</button>
                </form>
            </div>
        </div>
    )
}