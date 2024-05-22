'use client';

import React from 'react';
import { FaceLivenessDetector } from '@aws-amplify/ui-react-liveness';
import { Loader, ThemeProvider } from '@aws-amplify/ui-react';
import { get } from 'aws-amplify/api';
import axios from 'axios';

export function LivenessQuickStartReact() {
  const [loading, setLoading] = React.useState<boolean>(true);
  const [createLivenessApiData, setCreateLivenessApiData] = React.useState<{
    sessionId: string;
  } | null>(null);

  React.useEffect(() => {
    const fetchCreateLiveness: () => Promise<void> = async () => {
      /*
       * This should be replaced with a real call to your own backend API
       */
      // await new Promise((r) => setTimeout(r, 2000));
      // const mockResponse = { sessionId: '132b83b9-7ec5-460c-a647-c04c66a535ad' };
      // const data = mockResponse;

      // console.log('Calling function');
      // const testData = await callFunction();
      // console.log('Test Data:', testData);

      const data = await getSession();

      if ( !data ) {
          throw new Error('Session ID not found');
      }

      console.log('Data:', data);

      const sessionId = data.SessionId;

      console.log('Session ID:', sessionId);

      setCreateLivenessApiData({ sessionId });
      setLoading(false);
    };

    fetchCreateLiveness();
  }, []);

  const [result, setResult] = React.useState<any>(null);

  async function callFunction() {
    try {
      const restOperation = get({ 
        apiName: 'myRestApi',
        path: 'api-function' 
      });
      const response = await restOperation.response;
      console.log('GET call succeeded: ', response);
      console.log('GET call succeeded, json = : ', response.body.json());
      return response.body.json();
    } catch (error: any) {
      console.log('GET call failed: ', JSON.parse(error));
    }
  }
// https://rekog-klient-env.eba-jypdp7va.us-east-1.elasticbeanstalk.com

  async function getSession() {
    const response = await axios.get("https://www.jc-aav.xyz/recog/create");

    console.log(response.data)
    return response.data;
  }

  async function getResults(sessionId: string) {
    const response = await axios.get(`https://www.jc-aav.xyz/recog/results/${sessionId}`);

    console.log(response.data)
    return response.data;
  }

  async function getSessionAWS() {
    try {
      const restOperation = get({ 
        apiName: 'myRestApi',
        path: 'liveness-create-session' 
      });
      const response = await restOperation.response;
      console.log('GET call succeeded: ', response);
      console.log('GET call succeeded, json = : ', response.body.json());
      return response.body.json();
    } catch (error: any) {
      console.log('GET call failed: ', JSON.parse(error));
    }
  }

  async function getResultsAWS(sessionId: string) {
    try {
      const restOperation = get({ 
        apiName: 'myRestApi',
        path: 'liveness-get-results' 
      });
      const response = await restOperation.response;
      console.log('GET call succeeded: ', response);
      console.log('GET call succeeded, json = : ', response.body.json());
      return response.body.json();
    } catch (error: any) {
      console.log('GET call failed: ', JSON.parse(error));
    }
  }

  const handleAnalysisComplete: () => Promise<void> = async () => {

    if ( !createLivenessApiData ) {
        throw new Error('Session ID not found');
    }

    /*
     * This should be replaced with a real call to your own backend API
     */
    // const response = await fetch(
    //   `/api/get?sessionId=${createLivenessApiData.sessionId}`
    // );
    // const data = await response.json();

    const data = await getResults(createLivenessApiData.sessionId);
    console.log("Got result!!!", data);
    if ( !data ) {
      throw new Error('Result data not found');
  }
    const confidence = parseFloat(data.confidence);

    /*
     * Note: The isLive flag is not returned from the GetFaceLivenessSession API
     * This should be returned from your backend based on the score that you
     * get in response. Based on the return value of your API you can determine what to render next.
     * Any next steps from an authorization perspective should happen in your backend and you should not rely
     * on this value for any auth related decisions.
     */
    if (confidence > 80 ) {
      console.log('User is live');
    } else {
      console.log('User is not live');
    }

    const conf_rounded = Math.round(confidence * 100) / 100;

    const resultStr = `${data.status}, there is a ${conf_rounded}% confidence that the user is live.`;
    setResult(resultStr);

    alert('Analysis complete: ' + resultStr);
  };

  return (
    <ThemeProvider>
      {loading ? (
        <Loader />
      ) : (

        createLivenessApiData ? (
            <FaceLivenessDetector
            sessionId={createLivenessApiData.sessionId}
            region="us-east-1"
            onAnalysisComplete={handleAnalysisComplete}
            onError={(error) => {
                console.error(error);
            }}
            />
        ) : ( <div>Session ID not found</div> )        
      )}

      {
              result ?
              <div>
                  <h3>{result}</h3>
              </div>
           : <div></div>
    
      }
    </ThemeProvider>
  );
}