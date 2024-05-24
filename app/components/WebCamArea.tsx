'use client'
 
import { Alert, Button, Spinner } from "@material-tailwind/react";
import { useRouter } from "next/navigation";
import { useCallback, useRef, useState } from "react";
import { LivenessQuickStartReact } from "./Liveness";

function Icon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={2}
      stroke="currentColor"
      className="h-6 w-6"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z"
      />
    </svg>
  );
}

const WebcamArea = () => {
    const [imgSrc, setImgSrc] = useState<string | null>(null);
    const [age, setAge] = useState<number | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<boolean | null>(false);

    const router = useRouter();

    const adultHubUrl = process.env.NEXT_PUBLIC_ADULTHUB_URL || 'https://adulthub.fly.dev';

    console.log('main site url', adultHubUrl);

    // const capture = useCallback(async () => {
    //     if (webcamRef && webcamRef.current) {
    //       const imageSrc = webcamRef.current.getScreenshot();
    //       setImgSrc(imageSrc);

    //       setLoading(true);

    //       setError(false);
    //       try {
    //           // send a http post to endpoint /api/verify with the imageSrc as json body
    //         const response = await fetch('/api/verify', {
    //           method: 'POST',
    //           headers: {
    //               'Content-Type': 'application/json',
    //           },
    //           body: JSON.stringify({ url: imageSrc }),
    //         });

    //         setLoading(false);

    //         if ( !response.ok) {
    //           setError(true);
    //           const text = await response.text();

    //           if ( text === 'Unable to determine age over 25') {
    //             router.push('/notallowed');
    //           }
    //         }

    //         const data = await response.json();

    //         setAge(data.age);

    //         window.location.href = `${adultHubUrl}/auth/callback?jwt=${data.access_token}`;
    //       } catch (error: Error | any) {
    //         console.log(error);
    //         if ( error === 'Unable to determine age over 25' ) {
    //           // navigate to /notallowed
    //           router.push('/notallowed');
    //         }
    //         setLoading(false);
    //       }
    //     }
    // }, [webcamRef, setImgSrc]);

    return (
      <>
      <div>
        <LivenessQuickStartReact/>
      </div>

      {/* <div className="mb-1 flex flex-col items-center gap-4 p-5">
        {error ? <Alert color="red" className="alert-override">There was a problem contacting the server. Please try again later.</Alert> : null}
        {loading ? 

            <div className="flex items-center gap-4">
                <Button className="flex items-center gap-3" color="white" disabled fullWidth>
                    <Spinner onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}/>
                    Please wait while we verify your age...
                    </Button>
            </div>
         : 
        <Button className="mt-6" color="white" onClick={capture} fullWidth>Capture photo</Button>
        }        
      </div> */}
    {age ? 
    <div className="mb-1 flex flex-col gap-4 p-5 blue-gray">
        {age}
    </div> : null}
      </>
    );
  };

export default WebcamArea;