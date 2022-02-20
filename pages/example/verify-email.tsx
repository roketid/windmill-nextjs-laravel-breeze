import { useContext, useEffect, useState } from 'react'
import Image from 'next/image'

import { Button, WindmillContext } from '@roketid/windmill-react-ui'
import { useAuth } from 'hooks/auth'
import Loader from 'example/components/Loader/Loader'
import { useRouter } from 'next/router'

function ForgotPassword() {
  const router = useRouter()

  const { loading, user, redirectedUrl, logout, resendEmailVerification } = useAuth({
    middleware: 'auth',
  })

  const [submitting, setSubmittingState] = useState(false)
  const [status, setStatus] = useState(null)
  const [errors, setErrors] = useState([])

  const { mode } = useContext(WindmillContext)
  const imgSource = mode === 'dark' ? '/assets/img/mailbox-dark.jpg' : '/assets/img/mailbox.jpg'

  useEffect(() => {
    if (errors.length === 0 && user && user.email_verified_at) {
      router.push(redirectedUrl)
    }
  })

  return loading || user
    ? <Loader />
    : (
    <div className="flex items-center min-h-screen p-6 bg-gray-50 dark:bg-gray-900">
      <div className="flex-1 h-full max-w-4xl mx-auto overflow-hidden bg-white rounded-lg shadow-xl dark:bg-gray-800">
        <div className="flex flex-col overflow-y-auto md:flex-row">
          <div className="relative h-32 md:h-auto md:w-1/3">
            <Image
              aria-hidden="true"
              className="object-cover w-full h-full"
              src={imgSource}
              alt="Office"
              layout='fill'
            />
          </div>
          <main className="flex items-center justify-center p-6 sm:p-12 md:w-2/3">
            <div className="w-full">
              <h1 className="mb-4 text-xl font-semibold text-gray-700 dark:text-gray-200">
                Verify Email
              </h1>
              {
                errors.length && !submitting
                  ? <h6 className='mb-4 text-red-500 text-xs'>{errors[0]}</h6>
                  : ``
              }
              <div className="mb-8 text-sm text-gray-700 dark:text-gray-200">
                Thanks for signing up! Before getting started, could you
                verify your email address by clicking on the link we just
                emailed to you? If you didn&apos;t receive the email, we will
                gladly send you another.
              </div>

                {status === 'verification-link-sent' && (
                  <div className="mb-4 font-medium text-sm text-green-600 dark:text-green-400">
                    A new verification link has been sent to the email
                    address you provided during registration.
                  </div>
                )}

                <div className="mt-4 flex items-center justify-between">
                    <Button
                        onClick={() => {
                          setSubmittingState(true)
                          resendEmailVerification({ setStatus, setErrors })
                          setSubmittingState(false)
                        }}
                        disabled={submitting || status === 'verification-link-sent'}
                      >
                        Resend Verification Email
                    </Button>

                    <button
                        type="button"
                        className="underline text-sm text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-gray-100"
                        onClick={() => logout()}>
                        Logout
                    </button>
                </div>
            </div>
          </main>
        </div>
      </div>
    </div>
  )
}

export default ForgotPassword
