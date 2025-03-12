// src/components/LoginForm.tsx
import React from 'react'
import FormInput from './FormInput'
import Button from './Button'
import Header from '../Navs/Header'
import { useDispatch, useSelector } from 'react-redux'
import { getAuthFormDetails } from '@/redux/slice/auth-slice'
import { authenticateUser } from '@/api/auth'

const LoginForm: React.FC = () => {
    const {emailAddress, password, authenticating} = useSelector((state:any) => state.auth)
    const dispatch = useDispatch()

    const handleInputChange = (e: any) => {
        const {name, value} = e.target
        dispatch(getAuthFormDetails({name,value}))
    }

    const handleSubmit = (e: any) => {
        e.preventDefault()
        authenticateUser({email: emailAddress, password},"login")
    }
    
    return (
    <div className='relative auth-bg'>
        <Header />
        <div className="flex items-center justify-center min-h-screen ">
            <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
            <h2 className="text-2xl font-bold text-center mb-6">
                Log in to your Account<span className="text-red-500">!</span>
            </h2>
            <form className="space-y-4">
                <FormInput label="Email address" type="email" required handleChange={handleInputChange} name='emailAddress' value={emailAddress} />
                <FormInput label="Password" type="password" required handleChange={handleInputChange} name="password" value={password} />
                <div className="flex justify-between text-sm mb-4">
                {/* <a href="#" className="text-blue-500 hover:underline">Forgot password?</a> */}
                </div>
                <Button label="Log in" type="submit" className="w-full bg-[#D42C2CB2]" loading={authenticating} onClick={handleSubmit} disabled={!emailAddress || !password }/>
            </form>
            {/* <div className="text-center mt-4 text-sm">
                <span>A new user? </span>
                <a href="#" className="text-blue-500 hover:underline">Sign Up</a>
            </div> */}
            </div>
        </div>
    </div>
)}

export default LoginForm
