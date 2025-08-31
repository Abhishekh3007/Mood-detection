import React from 'react'
import { useForm } from 'react-hook-form'
import axios from 'axios'

type FormData = {
  email: string
  password: string
}

export default function LoginForm() {
  const { register, handleSubmit } = useForm<FormData>()

  const onSubmit = async (data: FormData) => {
    try {
      const res = await axios.post('/api/auth/login', data)
      console.log('login response', res.data)
      alert('Login response: ' + JSON.stringify(res.data))
    } catch (err: any) {
      alert('Login failed: ' + err.message)
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 max-w-md">
      <div>
        <label className="block text-sm font-medium">Email</label>
        <input {...register('email')} type="email" className="border p-2 w-full" />
      </div>
      <div>
        <label className="block text-sm font-medium">Password</label>
        <input {...register('password')} type="password" className="border p-2 w-full" />
      </div>
      <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded">Login</button>
    </form>
  )
}
