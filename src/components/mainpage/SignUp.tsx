import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'

export default function SignUp() {
    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const navigate = useNavigate()

    function handleSubmit(e: React.FormEvent) {
        e.preventDefault()
        // TODO: replace with real signup call once backend exists
        console.log({ name, email, password })
        navigate('/')
    }

    return (
        <div className="min-h-screen flex items-center justify-center px-4">
            <div className="w-full max-w-sm">
                <h1 className="text-2xl font-semibold text-center mb-1">
                    Issue Tracker
                </h1>
                <p className="text-sm text-gray-400 text-center mb-8">
                    Create your workspace account
                </p>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label htmlFor="name" className="block text-sm text-gray-300 mb-1">
                            Name
                        </label>
                        <input
                            id="name"
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                            className="w-full rounded-md bg-white/5 border border-white/10 px-3 py-2 text-sm text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-400"
                            placeholder="Jane Doe"
                        />
                    </div>

                    <div>
                        <label htmlFor="email" className="block text-sm text-gray-300 mb-1">
                            Email
                        </label>
                        <input
                            id="email"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            className="w-full rounded-md bg-white/5 border border-white/10 px-3 py-2 text-sm text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-400"
                            placeholder="you@example.com"
                        />
                    </div>

                    <div>
                        <label htmlFor="password" className="block text-sm text-gray-300 mb-1">
                            Password
                        </label>
                        <input
                            id="password"
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            minLength={8}
                            className="w-full rounded-md bg-white/5 border border-white/10 px-3 py-2 text-sm text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-400"
                            placeholder="At least 8 characters"
                        />
                    </div>

                    <button
                        type="submit"
                        className="w-full rounded-md bg-indigo-500 hover:bg-indigo-400 transition-colors text-sm font-medium py-2"
                    >
                        Create account
                    </button>
                </form>

                <p className="text-sm text-gray-400 text-center mt-6">
                    Already have an account?{' '}
                    <Link to="/login" className="text-indigo-300 hover:text-indigo-200">
                        Sign in
                    </Link>
                </p>
            </div>
        </div>
    )
}