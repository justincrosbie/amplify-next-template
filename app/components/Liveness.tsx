'use client';

import React, { useCallback, useEffect, useRef, useState } from 'react';
import { FaceLivenessDetector } from '@aws-amplify/ui-react-liveness';
import { Button, Flex, Text, Heading, Loader, Theme, ThemeProvider, useTheme } from '@aws-amplify/ui-react';
import axios from 'axios';
// import { useScreenshot } from 'use-react-screenshot';
import html2canvas from "html2canvas";
import { QualityFilter } from '@aws-sdk/client-rekognition';

export function LivenessQuickStartReact() {
  const [loading, setLoading] = React.useState<boolean>(true);
  const [checkAge, setCheckAge] = React.useState<boolean>(false);

  const [error, setError] = useState(undefined as any | undefined);

  const ref = useRef(null)
  // const [image, takeScreenshot] = useScreenshot()
  // const getImage = () => takeScreenshot(ref.current)

  const [image, setImage] = React.useState<string | null>(null);

  const [createLivenessApiData, setCreateLivenessApiData] = React.useState<{
    sessionId: string;
  } | null>(null);

  useEffect(() => {
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

  useEffect(() => {
    console.log('Image:', image)

    if ( image ) getAge();
  }, [image]);

  const [result, setResult] = React.useState<any>(null);


  const { tokens } = useTheme();
  const theme: Theme = {
    name: 'AAV Liveness Detection',
    tokens: {
      colors: {
        background: {
          primary: {
            value: tokens.colors.neutral['90'].value,
          },
          secondary: {
            value: tokens.colors.neutral['100'].value,
          },
        },
        font: {
          primary: {
            value: tokens.colors.white.value,
          },
        },
        brand: {
          primary: {
            '10': tokens.colors.teal['100'],
            '80': tokens.colors.teal['40'],
            '90': tokens.colors.teal['20'],
            '100': tokens.colors.teal['10'],
          },
        },
      },
    },
  };

  const CustomError = useCallback(() => {
    return (
      <Flex
        justifyContent="center"
        alignItems="center"
        width="100%"
        height="100%"
      >
        <Flex
          backgroundColor="white"
          direction="column"
          justifyContent="center"
          padding="32px"
        >
          <Heading color="black">{error?.state}</Heading>
          <Text>{error?.error.message}</Text>
          <Button>Try again?</Button>
        </Flex>
      </Flex>
    );
  }, [error]);

  const getAge = async () => {
    try {
      const response = await axios.post('https://aavservice.fly.dev/api/verify', {
        url: image
      });
      console.log(response)

      const access_token = response?.data?.access_token ? response.data.access_token : 'not_allowed';

      window.location.href = `https://adulthub.fly.dev/auth/callback?jwt=${access_token}`;

    } catch (error: any) {
      console.log('Error:', error);
      if ( error.response.status === 401 ) {
        window.location.href = `https://adulthub.fly.dev/auth/callback?jwt=not_allowed`;
      } else {
        window.location.href = `https://adulthub.fly.dev/auth/callback?jwt=server_error`;
      }
    }
  }

  function captureScreenshot() {

    // after a 2 second interval, take a screenshot
    // setTimeout(() => {
    //   // takeScreenshot(ref.current);
    //   takeScreenshot(ref.current);
    // }, 2000);

        if (!ref.current) return;

        const els = document.getElementsByClassName('amplify-liveness-video');

        Array.from(els).forEach((el: any) => {
          // Do stuff here
          el.style.display = 'block';

          var canvasPromise = html2canvas(el, {
            useCORS: true,
          });
          canvasPromise.then((canvas)=> {
            var dataURL = canvas.toDataURL("image/jpeg", 0.5);
    
            setImage(dataURL);
            // Create an image element from the data URL
          });
    
        });        
  }


  // async function callFunction() {
  //   try {
  //     const restOperation = get({ 
  //       apiName: 'myRestApi',
  //       path: 'api-function' 
  //     });
  //     const response = await restOperation.response;
  //     console.log('GET call succeeded: ', response);
  //     console.log('GET call succeeded, json = : ', response.body.json());
  //     return response.body.json();
  //   } catch (error: any) {
  //     console.log('GET call failed: ', JSON.parse(error));
  //   }
  // }
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

  // async function getSessionAWS() {
  //   try {
  //     const restOperation = get({ 
  //       apiName: 'myRestApi',
  //       path: 'liveness-create-session' 
  //     });
  //     const response = await restOperation.response;
  //     console.log('GET call succeeded: ', response);
  //     console.log('GET call succeeded, json = : ', response.body.json());
  //     return response.body.json();
  //   } catch (error: any) {
  //     console.log('GET call failed: ', JSON.parse(error));
  //   }
  // }

  // async function getResultsAWS(sessionId: string) {
  //   try {
  //     const restOperation = get({ 
  //       apiName: 'myRestApi',
  //       path: 'liveness-get-results' 
  //     });
  //     const response = await restOperation.response;
  //     console.log('GET call succeeded: ', response);
  //     console.log('GET call succeeded, json = : ', response.body.json());
  //     return response.body.json();
  //   } catch (error: any) {
  //     console.log('GET call failed: ', JSON.parse(error));
  //   }
  // }

  
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

    await captureScreenshot();

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

    // alert('Analysis complete: ' + resultStr);

    console.log('Screenshot:', image)

    if ( conf_rounded < 80 ) {
      window.location.href = `https://adulthub.fly.dev/auth/callback?jwt=not_allowed`;
    } else {
    }
  };

  return (


    
    <ThemeProvider theme={theme}>
      {loading ? (
        <Loader />
      ) : (

        createLivenessApiData ? (
              <div ref={ref}>
              <FaceLivenessDetector
              sessionId={createLivenessApiData.sessionId}
              region="us-east-1"
              onAnalysisComplete={handleAnalysisComplete}
              onError={(error) => {
                setError(error);
              }}
              components={{
                ErrorView: CustomError,
              }}
                      />
              </div>
            
        ) : ( <div>Session ID not found</div> )        
      )}

      {
              result ?
              <div>
                  <h3>{result}</h3>
              </div>
           : <div></div>
    
      }

      <Button onClick={captureScreenshot}>Capture</Button>
    </ThemeProvider>
  );
}