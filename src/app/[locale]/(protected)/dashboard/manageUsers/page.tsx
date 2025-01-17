"use client"
import { SubmitHandler, useForm } from "react-hook-form"


type FormFields = {
    email:string
}
export default function ManageUsers(){
    const {register , handleSubmit} = useForm<FormFields>();

    const onSubmit:SubmitHandler<FormFields>= (data)=>{
        console.log(data)
    }
    
    return(
        <div>
            

            <div>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <input type="text" {...register("email")}/>
                    <button type="submit">Search</button>
                </form>
            </div>
        </div>
    )
}