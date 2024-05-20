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

      const sessionId = data.toLocaleString();

      console.log('Session ID:', sessionId);

      setCreateLivenessApiData({ sessionId: data.toLocaleString() });
      setLoading(false);
    };

    fetchCreateLiveness();
  }, []);

  async function getSession() {
    try {
      const restOperation = get({ 
        apiName: 'liveness-create-session',
        path: '' 
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
    const response = await fetch(
      `/api/get?sessionId=${createLivenessApiData.sessionId}`
    );
    const data = await response.json();

    /*
     * Note: The isLive flag is not returned from the GetFaceLivenessSession API
     * This should be returned from your backend based on the score that you
     * get in response. Based on the return value of your API you can determine what to render next.
     * Any next steps from an authorization perspective should happen in your backend and you should not rely
     * on this value for any auth related decisions.
     */
    if (data.isLive) {
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