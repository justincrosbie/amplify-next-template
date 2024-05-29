'use client';

import React, { useCallback, useEffect, useRef, useState } from 'react';
import { FaceLivenessDetector } from '@aws-amplify/ui-react-liveness';
import { Button, Flex, Text, Heading, Loader, Theme, ThemeProvider, useTheme } from '@aws-amplify/ui-react';
import axios from 'axios';
import html2canvas from "html2canvas";
import { Alert, Card, Typography } from '@material-tailwind/react';

let thisImage = '';

export function LivenessQuickStartReact() {
  const [loading, setLoading] = React.useState<boolean>(true);
  const [checkAge, setCheckAge] = React.useState<boolean>(false);
  const [result, setResult] = React.useState<any>(null);

  const [infoMsg, setInfoMsg] = React.useState<string>('initializing...');
  const [statusMsg, setStatusMsg] = React.useState<string>('Initializing, please wait...');

  const [error, setError] = useState(undefined as any | undefined);

  const ref = useRef(null)

  const [image, setImage] = React.useState<string | null>(null);
  const [preimage, setPreImage] = React.useState<string | null>(null);

  const [createLivenessApiData, setCreateLivenessApiData] = React.useState<{
    sessionId: string;
  } | null>(null);

  useEffect(() => {
    const fetchCreateLiveness: () => Promise<void> = async () => {

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

    log('Sending image to aavservice: ' + image?.substring(0, 100));

    setStatusMsg('Checking results, please wait...')

    try {
      const response = await axios.post('https://aavservice.fly.dev/api/verify', {
        url: image
      });

      log('Sending image to aavservice: ' + JSON.stringify(response.data));

      const access_token = response?.data?.access_token ? response.data.access_token : 'not_allowed';

      setStatusMsg('Redirecting you back...')

      window.location.href = `https://adulthub.fly.dev/auth/callback?jwt=${access_token}`;

    } catch (error: any) {
      log('getAge: ERROR!!: ' + JSON.stringify(error));
      setStatusMsg('There was a problem doing the check!')
      console.log('Error:', error);
      if ( error.response.status === 401 ) {
        window.location.href = `https://adulthub.fly.dev/auth/callback?jwt=not_allowed`;
      } else {
        window.location.href = `https://adulthub.fly.dev/auth/callback?jwt=server_error`;
      }
    }
  }

  
  async function captureScreenshot(sendImage: boolean) {

    // after a 2 second interval, take a screenshot
    // setTimeout(() => {
    //   // takeScreenshot(ref.current);
    //   takeScreenshot(ref.current);
    // }, 2000);

        if (!ref.current) return;

        await new Promise(res => setTimeout(res, 5000))

        var count = 0;
        // log('Clicking cancel...');

      //   const cancelButtonEls = document.getElementsByClassName('amplify-liveness-cancel-button');
      //   Array.from(cancelButtonEls).forEach((el: any) => {
      //     el.click();
      //   });

      //   // amplify-liveness-cancel-container

      //   log('Waiting for cancel overlay to disappear...');

      //   while (document.getElementsByClassName('amplify-liveness-cancel-container').length > 0) {
      //     console.log('Waiting for cancel button to disappear');

      //     // After 5 seconds give up
      //     if ( count > 50 ) {
      //       log('Breaking from cancel overlay to disappear...' + count);
      //       break;
      //     }
      //     log('Waiting for cancel overlay to disappear...' + count);
      //     await new Promise(res => setTimeout(res, 100))
      //     count++;
      // }

      count = 0;
      while (document.getElementsByClassName('amplify-liveness-video').length < 1) {
        // After 5 seconds give up
        if ( count > 50 ) {
          log('Breaking from waiting for amplify-liveness-video...' + count);
          break;
        }
        log('Waiting for amplify-liveness-video...' + count);
        await new Promise(res => setTimeout(res, 100))
        count++;
      }

        await new Promise(res => setTimeout(res, 200))

        const els = document.getElementsByClassName('amplify-liveness-video');
        console.log(els[0]);
        log('Taking screenshot, els is ...els.length: ' + els.length);
        Array.from(els).forEach((el: any) => {

          waitForElement(el);

          el.style.display = 'block';

          var canvasPromise = html2canvas(el, {
            useCORS: true,
          });
          canvasPromise.then((canvas)=> {
            var dataURL = canvas.toDataURL("image/jpeg", 0.2);
    
            console.log('Data URL:', dataURL);

            log('Screenshot taken' );

            thisImage = dataURL;

            // setImage(dataURL);
            if ( sendImage)
              setImage(dataURL);
            else
              setPreImage(dataURL);
            // Create an image element from the data URL
          });
    
        });        
  }
  async function addCaptureButton() {
    let count = 0;
    while (document.getElementsByClassName('amplify-button').length < 1) {
      // After 5 seconds give up
      if ( count > 50 ) {
        log('Add: Breaking from waiting for amplify-liveness-video...' + count);
        break;
      }
      log('Waiting for video...' + count);
      await new Promise(res => setTimeout(res, 100))
      count++;
    }

    await new Promise(res => setTimeout(res, 100))

      const els = document.getElementsByClassName('amplify-button');

      // log('Add: Found capture button:' + els.length);

      Array.from(els).forEach((el: any) => {

        // console.log('Adding capture button to:' + el);

        el.addEventListener("click", function() {
            captureScreenshot(false);
        }, false);      

    });        

    log('Video ready' + count);
  }

  function log(msg: string) {
    console.log(msg);
    setStatusMsg(msg);
  }

  async function waitForElement(el: any) {
    let count = 0;
    while (!isElementInViewport(el)) {
      // After 5 seconds give up
      if ( count > 50 ) {
        log('Breaking from isElementInViewport...' + count);
        break;
      }
      log('Waiting for isElementInViewport...' + count);
      await new Promise(res => setTimeout(res, 100))
      count++;
    }
  }

  function isElementInViewport (el:any) {

    var rect = el.getBoundingClientRect();

    return (
        rect.top >= 0 &&
        rect.left >= 0 &&
        rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) && /* or $(window).height() */
        rect.right <= (window.innerWidth || document.documentElement.clientWidth) /* or $(window).width() */
    );
}  

async function clickCancel() {

  // after a 2 second interval, take a screenshot
  // setTimeout(() => {
  //   // takeScreenshot(ref.current);
  //   takeScreenshot(ref.current);
  // }, 2000);

      if (!ref.current) return;

      await new Promise(res => setTimeout(res, 5000))

      var count = 0;
      log('Clicking cancel...');

      const cancelButtonEls = document.getElementsByClassName('amplify-liveness-cancel-button');
      Array.from(cancelButtonEls).forEach((el: any) => {
        el.click();
      });

      // amplify-liveness-cancel-container

      log('Waiting for cancel overlay to disappear...');

      while (document.getElementsByClassName('amplify-liveness-cancel-container').length > 0) {
        console.log('Waiting for cancel button to disappear');

        // After 5 seconds give up
        if ( count > 50 ) {
          log('Breaking from cancel overlay to disappear...' + count);
          break;
        }
        log('Waiting for cancel overlay to disappear...' + count);
        await new Promise(res => setTimeout(res, 100))
        count++;
    } 

    log('Ok, ready to send....');
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
    setStatusMsg('Setting up...')
    const response = await axios.get("https://www.jc-aav.xyz/recog/create");

    // await captureScreenshot(false);

    addCaptureButton();

    console.log(response.data)
    setStatusMsg('Ready. Please click the button below')
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

    const data = await getResults(createLivenessApiData.sessionId);
    console.log("Got result!!!", data);
    if ( !data ) {
      throw new Error('Result data not found');
  }

    clickCancel();

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

    log('Analysis complete: ' + conf_rounded + "%");

    if ( confidence < 80 ) {
      window.location.href = `https://adulthub.fly.dev/auth/callback?jwt=not_allowed`;
    } else {
      // await captureScreenshot(false);
      setImage(thisImage);
      console.log('Screenshot:', image)

      if ( image) log ('Image set');
      else log('Image not set');
    }
  };

  return (


    
    <ThemeProvider theme={theme}>

      <Alert>
        {loading ? <Loader/>  : <></> }
        {statusMsg}
      </Alert>

      <br/>

      {loading ? (
        <></>
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
      {/* <Card>
      <Typography className="w-full flex flex-col justify-center items-center p-5" variant="h5" color="blue-gray">
            {infoMsg}
          </Typography>
      </Card> */}
    </ThemeProvider>
  );
}