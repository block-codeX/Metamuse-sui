// src/components/SignUpForm.tsx
import React from 'react'
import FormInput from './FormInput'
import Button from './Button'
import Header from '../Navs/Header'
import { useDispatch, useSelector } from 'react-redux'
import { getAuthFormDetails } from '@/redux/slice/auth-slice'
import { authenticateUser } from '@/api/auth'

const SignUpForm: React.FC = () => {
    const { connectWallet } = useSelector((state: any) => state.user)
    const {firstName, lastName, emailAddress, password, authenticating} = useSelector((state: any) => state.auth)
    const dispatch = useDispatch()
    
    const handleInputChange = (e: any) => {
        const {name, value} = e.target
        dispatch(getAuthFormDetails({name,value}))
    }

    const handleSubmit = (e: any) => {
        e.preventDefault()
        authenticateUser({firstName, lastName, email: emailAddress, password, walletAddress: connectWallet},"sign-up")
    }
    
    return (
    <div className='relative auth-bg'>
        <Header />
        <div className="flex items-center justify-center min-h-screen ">
            <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
            <h2 className="text-2xl font-bold text-center mb-6">Sign up</h2>
            <form className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                <FormInput label="First Name" required name="firstName" value={firstName} handleChange={handleInputChange}/>
                <FormInput label="Last Name" required name='lastName' value={lastName} handleChange={handleInputChange}/>
                </div>
                <FormInput label="Email address" type="email" required name='emailAddress' value={emailAddress}
                handleChange={handleInputChange}/>
                <FormInput label="Password" type="password" required name='password' value={password}
                handleChange={handleInputChange}/>
                <FormInput label="Wallet Address" type="text" required value={connectWallet} disabled={true} />
                <Button label="Sign Up" type="submit" className="w-full mt-4 bg-[#D42C2CB2]" loading={authenticating} onClick={handleSubmit} disabled={!firstName || !lastName || !emailAddress || !password || !connectWallet } />
            </form>
            {/* <div className="text-center mt-4">
                <button className="flex items-center justify-center gap-2 p-2 border border-gray-300 rounded hover:bg-gray-100 w-full">
                    <img src="/asset/google-sign.svg" alt="Google Logo" className="" />
                    <span>Sign up with Google</span>
                </button>
            </div> */}
            </div>
            </div>
    </div>
)}

export default SignUpForm
