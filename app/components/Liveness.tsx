'use client';

import React from 'react';
import { FaceLivenessDetector } from '@aws-amplify/ui-react-liveness';
import { Loader, ThemeProvider } from '@aws-amplify/ui-react';
import { get } from 'aws-amplify/api';

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

      const data = await getSession();


      if ( !data ) {
          throw new Error('Session ID not found');
      }

      const sessionIdJsonStr = data.toLocaleString();
      console.log('Session ID JSON:', sessionIdJsonStr);

      const sessionId = JSON.parse(sessionIdJsonStr).sessionId;

      console.log('Session ID:', sessionId);

      setCreateLivenessApiData({ sessionId: data.toLocaleString() });
      setLoading(false);
    };

    fetchCreateLiveness();
  }, []);

  async function getSession() {
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
      console.log('GET call failed: ', JSON.parse(error.response.body));
    }
  }

  async function getResults(sessionId: string) {
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
      console.log('GET call failed: ', JSON.parse(error.response.body));
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

    if ( !data ) {
      throw new Error('Result data not found');
  }

const resultJsonStr = data.toLocaleString();
    console.log('Result JSON:', resultJsonStr);

    const result = JSON.parse(resultJsonStr).sessionId;

    console.log('Result:', result);


    const confidence = parseFloat(result.confidence);


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
    </ThemeProvider>
  );
}