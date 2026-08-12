import { useState } from "react"
import { Link, useNavigate } from 'react-router-dom'
export default function Login() {

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('')
    const navigate = useNavigate()

    function handleSubmit(e: React.FormEvent) {
        e.preventDefault()

        console.log({ email, password })
        navigate('/')
    }

    return (
        <div className="min-h-screen bg-white text-gray-900 flex items-center justify-center px-4">
            <div className="w-full max-w-sm">
                <h1 className="text-2xl font-semibold text-center mb-1">
                    Issue Tracker
                </h1>
                <p className="text-sm text-gray-500 text-center mb-8">
                    Sign in to your workspace
                </p>

                <form onSubmit={handleSubmit} className='space-y-4'>
                    <div>
                        <label htmlFor="email" className="block text-sm text-gray-700 mb-1">
                            Email
                        </label>
                        <input id="email" type="email" value={email}
                            onChange={(e) => { setEmail(e.target.value) }}
                            required
                            className="w-full rounded-md bg-white border border-gray-300 px-3 py-2 text-sm text-gray-900 
                        placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                            placeholder="you@example.com" />
                    </div>

                    <div>
                        <label htmlFor="password"
                            className="block text-sm text-gray-700 mb-1">
                            password
                        </label>
                        <input
                            id="password"
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            className="w-full rounded-md bg-white border border-gray-300 px-3 py-2 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                            placeholder="••••••••"
                        />
                    </div>
                    <button
                        type="submit"
                        className="w-full rounded-md bg-indigo-600 hover:bg-indigo-500 transition-colors text-sm font-medium text-white py-2"
                    >
                        Sign in
                    </button>
                </form>
                <p className="text-sm text-gray-500 text-center mt-6">
                    Don't have an account?{' '}
                    <Link to="/signup" className="text-indigo-600 hover:text-indigo-500">
                        Sign up
                    </Link>
                </p>
            </div >

        </div >
    )
}
