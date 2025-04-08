import axios from 'axios'

export interface DAuthResponse {
  data: {
    accessToken: string
    refreshToken: string
  }
}

export const queryString = (queryString: string) => {
  const result = queryString
    .split('?')[1]
    .split('&')
    .map((s) => ({ [s.split('=')[0]]: s.split('=')[1] }))
    .reduce((p, c) => ({ ...p, ...c }), {})

  return result
}

export interface DAuthLoginParam {
  code: string
  clientId: string
  clientSecret: string
  redirectUri: string
}

export const getDAuthCode = async ({
  clientId,
  redirectUri,
}: Omit<DAuthLoginParam, 'code' | 'clientSecret'>) => {
  await axios.post(
    `https://dauth.b1nd.com/login?client_id=${clientId}&redirect_uri=${redirectUri}`
  )

  const dauthCode = queryString(window.location.search).code

  return dauthCode
}

export const DAuthLogin = async ({
  clientId,
  clientSecret,
  redirectUri,
}: DAuthLoginParam): Promise<DAuthResponse> => {
  const code = await getDAuthCode({ clientId, redirectUri })
  const { data } = await axios.post('https://dauth.b1nd.com/api/token', {
    code,
    clientId,
    clientSecret,
  })

  return {
    data: {
      accessToken: data.data.accessToken,
      refreshToken: data.data.refreshToken,
    },
  }
}
