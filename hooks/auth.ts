import useSWR from 'swr'
import { useCallback, useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import { ParsedUrlQuery, stringify } from 'querystring';
import api, { csrf } from 'lib/api'

declare type AuthMiddleware = 'auth' | 'guest'

interface IUseAuth {
  middleware: AuthMiddleware
  redirectIfAuthenticated?: string
}

interface IApiRequest {
  setErrors: React.Dispatch<React.SetStateAction<never[]>>
  setStatus: React.Dispatch<React.SetStateAction<any|null>>
  [key: string]: any
}

export const useAuth = (config: IUseAuth) => {
  const loginUrl = process.env.NEXT_PUBLIC_AUTH_PAGE_LOGIN || '/example/login'
  const verifyEmailUrl = process.env.NEXT_PUBLIC_AUTH_LOGIN || '/example/verify-email'
  const redirectedUrl = process.env.NEXT_PUBLIC_AUTH_REDIRECTED || '/example'

  const apiPathUser = process.env.NEXT_PUBLIC_API_PATH_USER || '/api/user'
  const apiPathLogin = process.env.NEXT_PUBLIC_API_PATH_LOGIN || '/login'
  const apiPathRegister = process.env.NEXT_PUBLIC_API_PATH_REGISTER || '/register'
  const apiPathForgotPassword = process.env.NEXT_PUBLIC_API_PATH_FORGOT_PASSWORD || '/forgot-password'
  const apiPathResetPassword = process.env.NEXT_PUBLIC_API_PATH_RESET_PASSWORD || '/reset-password'
  const apiPathVerifyEmail = process.env.NEXT_PUBLIC_API_PATH_VERIFY_EMAIL || '/email/verification-notification'
  const apiPathLogout = process.env.NEXT_PUBLIC_API_PATH_LOGIN || '/logout'

  const router = useRouter()
    
  const {middleware, redirectIfAuthenticated} = config
  const redirectIfAuthenticatedUrl = redirectIfAuthenticated || redirectedUrl


  const [loading, setLoadingState] = useState(true)

  const { data: user, error, mutate } = useSWR(apiPathUser, () =>
    api
      .get(apiPathUser)
      .then(res => res.data)
      .catch(error => {
        if (error.response.status !== 409) throw error

        router.push(redirectIfAuthenticatedUrl.indexOf('verify-email') < 0 ? verifyEmailUrl : redirectIfAuthenticatedUrl)
      }),
  )

  const register = async (args: IApiRequest) => {
    const { setErrors, ...props } = args
    await csrf()
    setErrors([])

    api
      .post(apiPathRegister, props)
      .then(() => mutate())
      .catch(error => {
        if (error.response.status !== 422) throw error

        setErrors(Object.values(error.response.data.errors).flat() as never[])
      })
  }

  const login = async (args: IApiRequest) => {
    const { setErrors, setStatus, ...props } = args
    await csrf()
    setErrors([])
    setStatus(null)

    api
      .post(apiPathLogin, props)
      .then(() => mutate())
      .catch(error => {
        if (error.response.status !== 422) throw error

        setErrors(Object.values(error.response.data.errors).flat() as never[])
      })
  }

  const forgotPassword = async (args: IApiRequest) => {
    const { setErrors, setStatus, email } = args
    await csrf()
    setErrors([])
    setStatus(null)

    api
      .post(apiPathForgotPassword, { email })
      .then(response => setStatus(response.data.status))
      .catch(error => {
        if (error.response.status !== 422) throw error

        setErrors(Object.values(error.response.data.errors).flat() as never[])
      })
  }

  const resetPassword = async (args: IApiRequest) => {
    const { setErrors, setStatus, ...props } = args
    await csrf()
    setErrors([])
    setStatus(null)

    api
      .post(apiPathResetPassword, { token: router.query.token, ...props })
      .then(response => router.push(loginUrl + '?reset=' + btoa(response.data.status)))
      .catch(error => {
        if (error.response.status !== 422) throw error

        setErrors(Object.values(error.response.data.errors).flat() as never[])
      })
  }

  const resendEmailVerification = (args: IApiRequest) => {
    const { setStatus } = args

    api
      .post(apiPathVerifyEmail)
      .then(response => setStatus(response.data.status))
  }

  const logout = useCallback(async (nextUrl?: string, nextQuery?: ParsedUrlQuery) => {
    if (! error) {
      await api.post(apiPathLogout)

      mutate()
    }

    let wrapNextUrl = loginUrl as string

    if (nextUrl) {
      const queryString = stringify(nextQuery)
      wrapNextUrl = encodeURIComponent(nextUrl + (queryString ? '?' + queryString : ''))
    }

    window.location.assign(loginUrl + (nextUrl && nextUrl.indexOf(loginUrl) < 0 && nextUrl.indexOf(verifyEmailUrl) < 0 ? '?next_to=' + wrapNextUrl : ''))
  }, [mutate, error, loginUrl, apiPathLogout, verifyEmailUrl])

  useEffect(() => {
    if (middleware === 'guest' && user) {
      const toUrl = redirectIfAuthenticatedUrl + (
        redirectIfAuthenticatedUrl.indexOf('logged=1') > 0 ? '' : (redirectIfAuthenticatedUrl.indexOf('?') > 0 ? '&' : '?') + 'logged=1'
      )
      router.push(toUrl, redirectIfAuthenticatedUrl)
    }
    if (middleware === 'auth' && error) logout(router.pathname, router.query)
    setLoadingState(false)

    return () => {
      setLoadingState(true)
    }
  }, [middleware, redirectIfAuthenticatedUrl, router, user, error, logout])

  return {
    loginUrl,
    verifyEmailUrl,
    redirectedUrl,
    apiPathUser,
    apiPathLogin,
    apiPathRegister,
    apiPathForgotPassword,
    apiPathResetPassword,
    apiPathVerifyEmail,
    apiPathLogout,

    loading,
    user,
    register,
    login,
    forgotPassword,
    resetPassword,
    resendEmailVerification,
    logout
  }
}