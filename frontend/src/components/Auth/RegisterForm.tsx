import React from 'react'
import { useForm } from 'react-hook-form'
import axios from 'axios'

type FormData = {
  email: string
  password: string
  username?: string
  fullName?: string
}

export default function RegisterForm() {
  const { register, handleSubmit } = useForm<FormData>()

  const onSubmit = async (data: FormData) => {
    try {
      const res = await axios.post('/api/auth/register', data)
      console.log('register response', res.data)
      alert('Register response: ' + JSON.stringify(res.data))
    } catch (err: unknown) {
      if (err instanceof Error) {
        alert('Register failed: ' + err.message)
      } else {
        alert('Register failed: An unknown error occurred')
      }
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
      <div>
        <label className="block text-sm font-medium">Username</label>
        <input {...register('username')} className="border p-2 w-full" />
      </div>
      <div>
        <label className="block text-sm font-medium">Full name</label>
        <input {...register('fullName')} className="border p-2 w-full" />
      </div>
      <button type="submit" className="px-4 py-2 bg-green-600 text-white rounded">Register</button>
    </form>
  )
}
