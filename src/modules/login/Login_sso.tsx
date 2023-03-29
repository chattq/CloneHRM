import React, { useState } from 'react';
import queryString from 'query-string';

import * as  AuthService from 'services/auth_service';
import { useEffect } from 'react';

const Login = () => {

  const ssoDomain: string = `${process.env.REACT_APP_ACC_BASE_URL}`;
  const redirectUri: string = `${process.env.REACT_APP_DOMAIN}/login`;
  const client_id: string = `${process.env.REACT_APP_SOLUTION_CODE}`;
  const client_secret: string = `${process.env.REACT_APP_SOLUTION_SECRET}`;
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {

    console.log(client_id, redirectUri, ssoDomain);

    let rparams = queryString.parse(window.location.search);

    var code1 = rparams["code"];

    if (code1) {
      let code: string = code1 as string;

      let params = new URLSearchParams();
      params.append('client_id', client_id);
      params.append('client_secret', client_secret);
      params.append('grant_type', 'authorization_code');
      params.append('code', code);
      params.append('redirect_uri', redirectUri);

      fetch(`${ssoDomain}/OAuth/token`, {
        method: 'post',
        body: params,
        headers: { 'Content-Type': 'application/x-www-form-urlencoded', 'Accept': 'application/json' },
      }).then(async (resp) => {


        var data = await resp.json();

        localStorage.setItem('token', data.access_token);


        window.location.href = '/';

      });
    }
    else {

      const authorizationUri = `${ssoDomain}/OAuth/Authorize?client_id=${client_id}&redirect_uri=${encodeURI(redirectUri)}&scope=identity&response_type=code`;
      window.location.href = authorizationUri;

    }

  }, []);


  return (<>
    {

      errorMessage != '' ? <strong>{errorMessage}</strong>
        : <strong>
          Logging in...

        </strong>
    }
  </>
  );
};


export default Login;