"use client"
import { zodResolver } from "@hookform/resolvers/zod";
import { SubmitHandler, useForm } from "react-hook-form"
import {z} from "zod"


const schema = z.object({
    email :z.string()
})
type FormFields =z.infer<typeof schema>;

export default function ManageUsers(){
    const {register , handleSubmit , setError ,formState:{errors ,isSubmitting}} = useForm<FormFields>({
        resolver:zodResolver(schema),
    });

    const onSubmit:SubmitHandler<FormFields>= (data)=>{
        console.log(data)
    }

    return(
        <div>
            

            <div>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <input type="text" {...register("email")}/>
                    {errors.email &&(
                        <div className="text-red-400">{errors.email.message}</div>
                    )}
                    <button type="submit">Search</button>
                </form>
            </div>
        </div>
    )
}