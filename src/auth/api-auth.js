import { API_URL } from "../utils/constant"

const signin = async (user) => {
  try {
    let response = await fetch(`${API_URL}auth/signin/`, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      
      body: JSON.stringify(user)
    })
    console.log(response);
    return await response.json()
  } catch(err) {
    console.log(err)
  }
}

const signout = async () => {
  try {
    let response = await fetch(`${API_URL}auth/signout/`, { method: 'GET' })
    return await response.json()
  } catch(err) {
    console.log(err)
  }
}

export {
  signin,
  signout
}