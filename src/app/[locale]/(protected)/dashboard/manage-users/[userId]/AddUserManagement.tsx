"use client"
import {z} from "zod"
import { useForm } from "react-hook-form"


const schema = z.object({
    place:z.string() ,
    org:z.string()
});

type FormFields = z.infer<typeof schema>;


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