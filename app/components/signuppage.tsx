'use client'
import axios from "axios";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";

export default function SignupPage(){
      const router = useRouter();
      const [email, setEmail] = useState("");
      const [username, setUsername] = useState("");
      const [password, setPassword] = useState("");
      const [error, setError] = useState("");

      async function handleSignup(event: FormEvent<HTMLFormElement>){
        event.preventDefault()
        setError("")

        try{
            const res = await axios.post("http://localhost:5000/api/auth/signup", {
                email,
                username,
                password
            })
            if(res.status){
            router.push("/api/auth/login")
            } else{
                console.log('signup error');
                
            }
        }catch(error: string){
            setError( error.response?.data?.message || "Something went wrong" );
        }
      }
    return  <form onSubmit={handleSignup}>
      <input
        type="text"
        placeholder="Email"
        value={email}
        onChange={(event) => setEmail(event.target.value)}
        required
      />
      <input
        type="text"
        placeholder="Username"
        value={username}
        onChange={(event) => setUsername(event.target.value)}
        required
      />

      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(event) => setPassword(event.target.value)}
        required
      />

      <button type="submit">Signup</button>

      {error && <p>{error}</p>}
    </form>
}