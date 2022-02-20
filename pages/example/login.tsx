import React, { useContext, useEffect, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'

import { Label, Input, Button, WindmillContext } from '@roketid/windmill-react-ui'
import { useAuth } from 'hooks/auth'
import Loader from 'example/components/Loader/Loader'
import { useRouter } from 'next/router'

interface IEvent {
  preventDefault: () => void
}

function LoginPage() {
  const [showLoader, setShowLoaderState] = useState(true)

  const { query } = useRouter()
  const { login, loading, user } = useAuth({
      middleware: 'guest',
      redirectIfAuthenticated: query.next_to as string,
  })

  const [submitting, setSubmittingState] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [errors, setErrors] = useState([])
  const [status, setStatus] = useState<string|null>(null)

  useEffect(() => {
    const reset = query && query.reset ? query.reset as string : ''
    if (reset.length > 0 && errors.length === 0) {
      setStatus(atob(reset))
    } else {
      setStatus(null)
    }
  }, [query, errors])

  useEffect(() => {
    if (!loading && !user) {
      setShowLoaderState(false)
    }

    return () => {
      setShowLoaderState(true)
    }
  }, [loading, user])

  const submitForm = async (event: IEvent) => {
    event.preventDefault()

    setSubmittingState(true)
    login({ email, password, setErrors, setStatus })
    setSubmittingState(false)
  }

  const { mode } = useContext(WindmillContext)
  const imgSource = mode === 'dark' ? '/assets/img/login-office-dark.jpeg' : '/assets/img/login-office.jpeg'
  
  return showLoader
    ? (<Loader />)
    : (
    <div className='flex items-center min-h-screen p-6 bg-gray-50 dark:bg-gray-900'>
      <div className='flex-1 h-full max-w-4xl mx-auto overflow-hidden bg-white rounded-lg shadow-xl dark:bg-gray-800'>
        <div className='flex flex-col overflow-y-auto md:flex-row'>
          <div className='relative h-32 md:h-auto md:w-1/2'>
            <Image
              aria-hidden='true'
              className='hidden object-cover w-full h-full'
              src={imgSource}
              alt='Office'
              layout='fill'
            />
          </div>
          <main className='flex items-center justify-center p-6 sm:p-12 md:w-1/2'>
            <form onSubmit={submitForm} className='w-full'>
              <h1 className='mb-4 text-xl font-semibold text-gray-700 dark:text-gray-200'>
                Login
              </h1>
              {
                errors.length && !submitting
                  ? <h6 className='mb-4 text-red-500 text-xs'>{errors[0]}</h6>
                  : ``
              }
              {status && (
                <div className="mb-4 font-medium text-sm text-green-600 dark:text-green-400">
                  {status}
                </div>
              )}

              <Label>
                <span>Email</span>
                <Input
                  className='mt-1'
                  type='email'
                  placeholder='john@doe.com'
                  value={email}
                  onChange={event => setEmail(event.target.value)}
                  required
                />
              </Label>

              <Label className='mt-4'>
                <span>Password</span>
                <Input
                  className='mt-1'
                  type='password'
                  placeholder='***************'
                  value={password}
                  onChange={event => setPassword(event.target.value)}
                  required
                />
              </Label>

              <Button type='submit' className='mt-4' disabled={submitting} block>
                Log in
              </Button>

              <hr className='my-8' />

              <p className='mt-4'>
                <Link href='/example/forgot-password'>
                  <a className='text-sm font-medium text-purple-600 dark:text-purple-400 hover:underline'>
                    Forgot your password?
                  </a>
                </Link>
              </p>
              <p className='mt-1'>
                <Link href='/example/create-account'>
                  <a className='text-sm font-medium text-purple-600 dark:text-purple-400 hover:underline'>
                    Create account
                  </a>
                </Link>
              </p>
            </form>
          </main>
        </div>
      </div>
    </div>
  );
}

export default LoginPage
